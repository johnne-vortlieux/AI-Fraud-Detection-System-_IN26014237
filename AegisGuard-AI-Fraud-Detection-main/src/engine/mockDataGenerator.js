import { predictFraudRisk } from './fraudScoringEngine';
import { MERCHANT_CATEGORIES, COUNTRIES } from './defaultRules';

const FIRST_NAMES = ['Alex', 'Sarah', 'Marcus', 'Priya', 'David', 'Elena', 'Chen', 'Zoe', 'Liam', 'Aarav', 'Sophia', 'Hiroshi', 'Amara', 'Carlos', 'Fatima'];
const LAST_NAMES = ['Chen', 'Smith', 'Patel', 'Johnson', 'Gupta', 'Silva', 'Kim', 'O\'Connor', 'Müller', 'Al-Mansoor', 'Tanaka', 'Schneider', 'Rossi', 'Zhang'];

const USER_ACCOUNTS = Array.from({ length: 25 }, (_, i) => {
  const fName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
  const cardLast4 = Math.floor(1000 + Math.random() * 9000);
  return {
    id: `USR-${1000 + i}`,
    name: `${fName} ${lName}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}@example.com`,
    card: `•••• •••• •••• ${cardLast4}`,
    cardType: i % 2 === 0 ? 'Visa Gold' : 'Mastercard Platinum',
    homeCountry: 'United States',
    avgMonthlySpend: 2500 + Math.floor(Math.random() * 5000)
  };
});

const PAYMENT_METHODS = ['Online Card', 'UPI / P2P Transfer', 'Chip & PIN (POS)', 'Wire Transfer', 'Crypto Payment', 'Apple Pay'];

export function generateRandomTransaction(isAttackMode = false, rules = [], threshold = 65) {
  const user = USER_ACCOUNTS[Math.floor(Math.random() * USER_ACCOUNTS.length)];
  const merchantObj = MERCHANT_CATEGORIES[Math.floor(Math.random() * MERCHANT_CATEGORIES.length)];
  const countryObj = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];

  // Force higher fraud probability if attack mode is active
  const forceFraud = isAttackMode || Math.random() < 0.18;

  let amount;
  let velocity_1h;
  let location_dist_km;
  let device_change;
  let failed_pin_count;
  let card_present;

  if (forceFraud) {
    amount = Math.random() < 0.5 ? Math.floor(3500 + Math.random() * 12000) : Math.floor(10 + Math.random() * 50);
    velocity_1h = Math.floor(4 + Math.random() * 8);
    location_dist_km = Math.random() < 0.6 ? Math.floor(600 + Math.random() * 4500) : 5;
    device_change = Math.random() < 0.8;
    failed_pin_count = Math.random() < 0.4 ? Math.floor(2 + Math.random() * 3) : 0;
    card_present = false;
  } else {
    amount = parseFloat((12 + Math.random() * 250).toFixed(2));
    velocity_1h = Math.floor(1 + Math.random() * 2);
    location_dist_km = Math.floor(0 + Math.random() * 25);
    device_change = Math.random() < 0.05;
    failed_pin_count = 0;
    card_present = Math.random() < 0.7;
  }

  const date = new Date();
  const txId = `TXN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const txData = {
    id: txId,
    timestamp: date.toLocaleTimeString(),
    fullTimestamp: date.toISOString(),
    userName: user.name,
    userId: user.id,
    userEmail: user.email,
    cardNumber: user.card,
    amount,
    currency: 'USD',
    merchant_category: merchantObj.name,
    merchantName: `${merchantObj.name} Store #${Math.floor(10 + Math.random() * 90)}`,
    country: countryObj.name,
    countryFlag: countryObj.flag,
    location_dist_km,
    velocity_1h,
    device_change,
    failed_pin_count,
    card_present,
    payment_type: PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)],
    hour: date.getHours(),
    actual_is_fraud: forceFraud
  };

  const scoring = predictFraudRisk(txData, rules, threshold);

  return {
    ...txData,
    ...scoring,
    status: scoring.riskLevel === 'HIGH' ? 'BLOCKED' : (scoring.riskLevel === 'MEDIUM' ? 'FLAGGED_2FA' : 'APPROVED')
  };
}

export function generateInitialDataset(count = 35, rules = [], threshold = 65) {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(generateRandomTransaction(i % 5 === 0, rules, threshold));
  }
  return list;
}
