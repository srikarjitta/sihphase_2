import json
import math
import os
from typing import List, Optional
from models.schemas import ChannelPartnerModel, PartnerFilterRequest, PartnerListResponse

PARTNERS_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "channel_partners.json")

def load_partners() -> List[ChannelPartnerModel]:
    with open(PARTNERS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return [ChannelPartnerModel(**item) for item in data]

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great circle distance in kilometers between two points
    on the earth (specified in decimal degrees).
    """
    R = 6371.0 # Earth radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    distance = R * c
    return round(distance, 2)

def find_channel_partners(req: PartnerFilterRequest) -> PartnerListResponse:
    all_partners = load_partners()
    user_lat = req.user_latitude or 17.3850
    user_lon = req.user_longitude or 78.4867
    max_radius = req.max_radius_km or 1000.0

    filtered: List[ChannelPartnerModel] = []

    for p in all_partners:
        # Scheme filter
        if req.scheme_id and req.scheme_id not in p.supported_schemes:
            continue
        
        # Partner Type filter
        if req.partner_type and req.partner_type.lower() != "all":
            if p.partner_type.lower() != req.partner_type.lower():
                continue

        # Calculate distance
        dist = calculate_haversine_distance(user_lat, user_lon, p.latitude, p.longitude)
        p_copy = p.model_copy()
        p_copy.distance_km = dist

        if dist <= max_radius:
            filtered.append(p_copy)

    # Sort by distance
    filtered.sort(key=lambda x: (x.distance_km if x.distance_km is not None else 9999))

    # Mark the first/closest SCA or PSB as recommended
    if filtered:
        filtered[0].is_recommended = True

    disclaimer = (
        "MOCK DATA NOTICE: Channel partner operational status, fund utilization, and contact details "
        "are simulated for this SIH hackathon prototype. Real-time government NPA and fund-utilization APIs "
        "will be integrated upon official MoSJE portal deployment."
    )

    return PartnerListResponse(
        user_location={"latitude": user_lat, "longitude": user_lon},
        total_found=len(filtered),
        partners=filtered,
        disclaimer=disclaimer
    )
