# AI-Driven Scheme Matching for Marginalized Entrepreneurs
### Smart India Hackathon 2026 • Problem Statement ID: SIH26092
**Ministry of Social Justice and Empowerment (MoSJE)**  
**Theme:** Smart Automation | **Category:** Software

---

## 📌 Project Overview
A digital empowerment platform designed to connect Scheduled Castes (SC), Other Backward Classes (OBC), Safai Karamcharis, and economically weaker marginalized entrepreneurs with tailored government credit and educational schemes under MoSJE apex corporations (**NSFDC**, **NBCFDC**, **NSKFDC**).

The platform eliminates information asymmetry, simplifies complex eligibility rules via a transparent deterministic rule engine, computes exact financial obligations with moratorium grace periods, routes applicants to nearby authorized Channel Partners on an interactive Leaflet OpenStreetMap, and provides multilingual guidance in **English, Telugu (తెలుగు), Hindi (हिन्दी), and Tamil (தமிழ்)**.

---

## 🚀 Key Features

### 1. Smart Scheme Recommender
- **Deterministic Rule Engine:** Evaluates applicant's annual family income, SC category status, project type (Dairy, Agriculture, Retail, Manufacturing, Service, Education), project cost, and education level against statutory scheme parameters.
- **AI Natural Language Explanation:** Provides plain-language explanations of *why* a specific scheme was recommended, detailing loan percentages (up to 95%) and interest rates (3.5% - 6.5% p.a.).
- **Clear Disqualification Breakdown:** If an applicant does not meet statutory criteria, transparently lists the exact reasons without ambiguity.

### 2. Financial & Moratorium Calculator
- **Exact Mathematical EMI Formula:** $EMI = P \times r \times \frac{(1+r)^N}{(1+r)^N - 1}$.
- **Moratorium Grace Period Handling:** Supports 3 to 48 months repayment holiday (where principal repayment is ₹0 and only simple interest is serviced).
- **Visual Breakdown:** Dynamic Principal vs. Interest percentage ratio bar.
- **Amortization Schedule:** Month-by-month repayment breakdown across the entire loan tenure.

### 3. Geo-Spatial Channel Partner Locator
- **Interactive OpenStreetMap + Leaflet:** Custom color-coded pins for State Channelizing Agencies (SCAs), Public Sector Banks (PSBs), Regional Rural Banks (RRBs), and NBFC-MFIs.
- **Proximity & Scheme Filtering:** Filters by recommended scheme and computes accurate great-circle distance via Haversine formula.
- **One-Click Route Direction:** Direct navigation links to Google Maps.

### 4. Dynamic Document Checklist
- **Scheme-Specific Requirements:** Dynamically loads checklist for Micro Finance, Term Loans, or Education Loans (Caste Certificate, Income Proof, DPR / Business Plan, Admission Letter).
- **Verification Progress Bar:** Tracks overall application readiness.
- **Simulated Upload & DigiLocker Authentication:** Instant status updates with mock verification badges.

### 5. 5-Stage Application Journey Tracker
- **Visual Progress Timeline:**
  1. *Application Submitted*
  2. *Documents Verified*
  3. *Under Processing (Field Appraisal)*
  4. *Sanction*
  5. *Disbursement (DBT)*
- **Reference ID Lookup:** Sample IDs `SIH-2026-MOSJE-8821` and `SIH-2026-MOSJE-9042`.

### 6. Multilingual Digital Assistance (i18n)
- Seamless real-time language switching across **English**, **Telugu**, **Hindi**, and **Tamil** for navigation, labels, parameters, cards, and AI prompts.

### 7. RAG AI Financial Assistant
- Grounded on the official MoSJE scheme knowledge repository.
- Non-hallucinatory with strict disclaimers preventing unauthorized promises of loan sanction.

---

## 🛠️ Technology Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Leaflet & React-Leaflet
- **Backend:** Python 3.13, FastAPI, Uvicorn, Pydantic v2
- **Testing:** Pytest, HTTPX
- **Maps:** Leaflet with OpenStreetMap tiles
- **State Management & i18n:** React Context API with modular JSON translation dictionaries

---

## 💻 How to Run the Project Locally

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to project directory
cd sih

# Install Python backend dependencies
python -m pip install fastapi uvicorn pydantic pytest httpx

# Start the FastAPI backend server (Runs on port 8000)
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
# In a new terminal, navigate to the frontend directory
cd sih/frontend

# Install dependencies (already initialized)
npm install

# Start the Vite development server
npm run dev
```
Open `http://127.0.0.1:5173` or `http://127.0.0.1:5174` in your browser.

### 4. Running Automated Tests
```bash
# From the project root
python -m pytest backend/tests
```
Executes all 17 unit and E2E integration test cases.

---

## 🏆 5-Minute Smart India Hackathon Presentation Scenario

1. **Minute 1 - Introduction & Problem ID SIH26092:**
   - Present the GovTech portal home page.
   - Switch language to **Telugu (తెలుగు)** or **Hindi (हिन्दी)** to show multilingual accessibility for rural marginalized entrepreneurs.
2. **Minute 2 - 1-Click SIH Judge Demo:**
   - Click the **"1-Click SIH Judge Demo"** button in the top navbar.
   - Automatically loads a realistic profile: *Smt. K. Lakshmi, SC Dairy Entrepreneur, Annual Family Income ₹1,20,000, Project Cost ₹1,40,000 in Hyderabad, Telangana*.
   - Click **"Check My Eligibility"**.
3. **Minute 3 - Smart Scheme Recommendation:**
   - Display the **Micro Credit Finance Scheme (NSFDC)** high match card.
   - Highlight the deterministic rule checklist (income ≤ ₹3L, SC verified, project type dairy, cost ≤ ₹2L).
   - Show the plain-language AI explanation detailing the 4% interest rate (with 0.5% female rebate) and 6-month moratorium.
4. **Minute 4 - Financial Calculator & Channel Partner Locator:**
   - Click **"Calculate EMI"**: Show prefilled ₹1,33,000 principal loan, 4% interest, and 6-month moratorium with visual Principal vs. Interest breakdown.
   - Click **"Find Channel Partner"**: View the Leaflet OpenStreetMap showing the nearest State Channelizing Agency (**TSSCCDC Masab Tank**, ~1.2 km away).
5. **Minute 5 - Document Checklist, Tracker & AI Assistant:**
   - View the scheme-tailored **Document Checklist**, simulate an upload to see the readiness bar increase.
   - Open **Track Application** to show the 5-stage DBT pipeline.
   - Click the floating **AI Assistant** and tap *"What is a moratorium period?"* to demonstrate grounded RAG assistance.

---

## ⚠️ Prototype Notices & Limitations
- **Indicative Recommendations:** Recommendations are generated based on statutory guidelines; actual loan sanctions require physical appraisal by authorized Channel Partners.
- **Mock Partner Status:** Channel partner fund allocation and operational ratings are simulated for this SIH prototype demonstration. Real-time government NPA and public banking APIs can be integrated via the modular FastAPI endpoints.
