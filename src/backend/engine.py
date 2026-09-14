"""
Codewarrior AI - Core Cold-Chain & MKT Calculation Engine
"""
import math
from typing import List, Dict

R = 8.314472
DELTA_H = 83144.0 

def calculate_mkt(temperatures_celsius: List[float]) -> float:
    if not temperatures_celsius:
        return 0.0
    temps_kelvin = [t + 273.15 for t in temperatures_celsius]
    n = len(temps_kelvin)
    sum_exp = sum(math.exp(-DELTA_H / (R * t)) for t in temps_kelvin)
    log_arg = sum_exp / n
    # When all readings are identical log_arg == 1.0, so log == 0 → MKT is
    # simply the common temperature itself (mathematically correct limit).
    if log_arg == 1.0:
        return round(temps_kelvin[0] - 273.15, 2)
    mkt_kelvin = (DELTA_H / R) / (-math.log(log_arg))
    return round(mkt_kelvin - 273.15, 2)

def evaluate_excursion_severity(temperatures_celsius: List[float], max_safe_temp: float = 8.0) -> Dict:
    mkt = calculate_mkt(temperatures_celsius)
    current_temp = temperatures_celsius[-1] if temperatures_celsius else 0.0
    is_breached = current_temp > max_safe_temp
    
    if current_temp > 12.0 or mkt > 9.5:
        severity = "CRITICAL"
        action = "CARGO_SPOILED_QUARANTINE"
    elif is_breached:
        severity = "MAJOR_HAZARD"
        action = "EMERGENCY_DIVERT_REQUIRED"
    elif current_temp > 6.5:
        severity = "WARNING"
        action = "MONITOR_COOLING_COMPRESSOR"
    else:
        severity = "OPTIMAL"
        action = "MAINTAIN_ROUTE"
        
    return {
        "current_temperature_c": current_temp,
        "mean_kinetic_temp_c": mkt,
        "severity": severity,
        "action_required": action
    }