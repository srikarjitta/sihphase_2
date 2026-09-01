import json
import os
import re
from typing import List, Dict, Any, Tuple
from models.schemas import ChatRequest, ChatResponse

KB_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "knowledge_base.json")
SCHEMES_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "schemes.json")

def load_kb():
    with open(KB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_schemes_raw():
    with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def retrieve_relevant_contexts(query: str) -> Tuple[List[Dict[str, Any]], List[str]]:
    kb = load_kb()
    schemes = load_schemes_raw()
    
    query_tokens = set(re.findall(r'\w+', query.lower()))
    scored_results = []
    
    # 1. Search KB topics
    for item in kb:
        topic_tokens = set(re.findall(r'\w+', item['topic'].lower()))
        keyword_tokens = set([k.lower() for k in item.get('keywords', [])])
        
        overlap = len(query_tokens.intersection(topic_tokens.union(keyword_tokens)))
        if overlap > 0:
            scored_results.append((overlap * 2, item['topic'], item['content']))
            
    # 2. Search Schemes
    for s in schemes:
        s_tokens = set(re.findall(r'\w+', (s['name'] + " " + s['category'] + " " + s['description'] + " " + " ".join(s['eligible_project_types'])).lower()))
        overlap = len(query_tokens.intersection(s_tokens))
        if overlap > 0:
            summary = (
                f"{s['name']}: Max loan ₹{s['max_project_cost']:,.0f}, Interest rate {s['interest_rate_pct']}% p.a., "
                f"Moratorium {s['moratorium_months_min']}-{s['moratorium_months_max']} months. "
                f"Eligible for: {', '.join(s['eligible_project_types'])}. "
                f"Benefits: {'; '.join(s['key_benefits'])}."
            )
            scored_results.append((overlap * 1.5, s['name'], summary))
            
    scored_results.sort(key=lambda x: x[0], reverse=True)
    
    top_matches = scored_results[:3]
    source_topics = [item[1] for item in top_matches]
    return top_matches, source_topics

def answer_financial_query(req: ChatRequest) -> ChatResponse:
    q = req.question.strip()
    q_lower = q.lower()
    
    matches, sources = retrieve_relevant_contexts(q)
    
    # Default follow-ups
    suggested = [
        "What is a moratorium period?",
        "Which documents are needed for Micro Finance?",
        "How do Channel Partners disburse the loan?",
        "Can I get an education loan for studying abroad?"
    ]
    
    # Context-aware grounded responses
    if not matches:
        answer = (
            "I could not find a direct match in the current MoSJE scheme database for your question. "
            "Under the Ministry of Social Justice and Empowerment (MoSJE), concessional credit is provided "
            "for Micro Finance (up to ₹2 Lakhs), Term Loans (up to ₹20 Lakhs), and Educational Loans (up to ₹20 Lakhs). "
            "Please check the official MoSJE/NSFDC guidelines or consult your local State Channelizing Agency for detailed clarification."
        )
        sources = ["General MoSJE Knowledge"]
    else:
        # Synthesize synthesized response from retrieved context
        context_texts = "\n\n".join([f"• {item[1]}: {item[2]}" for item in matches])
        
        answer = (
            f"Here is the verified information from the MoSJE scheme repository:\n\n"
            f"{context_texts}\n\n"
            f"💡 Important: Scheme sanctions require document verification and project appraisal by authorized Channel Partners (SCAs/Banks)."
        )

    disclaimer = (
        "AI Assistant Notice: Guidance provided is for informational purposes only based on the prototype knowledge base. "
        "It does not constitute loan sanction or legal government guarantee."
    )

    return ChatResponse(
        answer=answer,
        source_topics=sources,
        suggested_followups=suggested,
        disclaimer=disclaimer
    )
