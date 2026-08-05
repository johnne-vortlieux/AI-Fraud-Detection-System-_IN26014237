export const INITIAL_RULES = [
  {
    id: 'rule-1',
    name: 'High Amount Location Anomaly',
    condition: 'amount > 5000 AND location_dist_km > 500',
    action: 'FORCE_BLOCK',
    enabled: true,
    severity: 'High',
    description: 'Triggers when transaction is over $5,000 and location is over 500 km away from home base.'
  },
  {
    id: 'rule-2',
    name: 'Rapid Fire Velocity Attack',
    condition: 'velocity_1h >= 6',
    action: 'FORCE_CHALLENGE',
    enabled: true,
    severity: 'High',
    description: 'Triggers when user makes 6 or more transactions in under 1 hour.'
  },
  {
    id: 'rule-3',
    name: 'PIN Retry Limit Exceeded',
    condition: 'failed_pin_count >= 3',
    action: 'FORCE_BLOCK',
    enabled: true,
    severity: 'Critical',
    description: 'Triggers when 3 or more incorrect PIN or CVV attempts occur.'
  },
  {
    id: 'rule-4',
    name: 'Crypto / Wire High Risk Merchant',
    condition: 'merchant_category IN ["Crypto Exchange", "Wire Transfer"] AND amount > 2500',
    action: 'FORCE_CHALLENGE',
    enabled: true,
    severity: 'Medium',
    description: 'Flags large transfers to high-risk merchant categories.'
  },
  {
    id: 'rule-5',
    name: 'New Device Night Anomaly',
    condition: 'device_change == true AND hour < 5 AND amount > 1000',
    action: 'FORCE_CHALLENGE',
    enabled: true,
    severity: 'Medium',
    description: 'Detects midnight transactions from unknown devices.'
  }
];

export const MERCHANT_CATEGORIES = [
  { name: 'Online Retail', baseRisk: 0.15, icon: 'ShoppingBag' },
  { name: 'Electronics Store', baseRisk: 0.35, icon: 'Smartphone' },
  { name: 'Luxury Goods', baseRisk: 0.45, icon: 'Watch' },
  { name: 'Crypto Exchange', baseRisk: 0.70, icon: 'Bitcoin' },
  { name: 'Wire Transfer / P2P', baseRisk: 0.65, icon: 'Send' },
  { name: 'Online Casino / Gambling', baseRisk: 0.75, icon: 'Dices' },
  { name: 'Supermarket / Grocery', baseRisk: 0.05, icon: 'ShoppingCart' },
  { name: 'Travel & Airline', baseRisk: 0.40, icon: 'Plane' },
  { name: 'ATM Cash Withdrawal', baseRisk: 0.30, icon: 'DollarSign' }
];

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', riskFactor: 1.0 },
  { code: 'IN', name: 'India', flag: '🇮🇳', riskFactor: 1.0 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', riskFactor: 1.1 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', riskFactor: 1.0 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', riskFactor: 1.05 },
  { code: 'NG', name: 'Nigeria (High Risk Proxy)', flag: '🇳🇬', riskFactor: 2.2 },
  { code: 'RU', name: 'Russia (High Risk Proxy)', flag: '🇷🇺', riskFactor: 2.4 },
  { code: 'KY', name: 'Cayman Islands', flag: '🇰🇾', riskFactor: 1.9 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', riskFactor: 1.5 }
];
