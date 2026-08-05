import React, { useState, useEffect } from 'react';
import { Cpu, Zap, RefreshCw, ShieldCheck, ShieldAlert, AlertTriangle, Info, Check, ArrowRight, HelpCircle } from 'lucide-react';
import { predictFraudRisk } from '../engine/fraudScoringEngine';
import { MERCHANT_CATEGORIES, COUNTRIES } from '../engine/defaultRules';

export default function TransactionPredictor({ rules, riskThreshold }) {
  const [formData, setFormData] = useState({
    amount: 3200,
    velocity_1h: 4,
    location_dist_km: 750,
    merchant_category: 'Crypto Exchange',
    country: 'United States',
    device_change: true,
    failed_pin_count: 2,
    card_present: false,
    hour: 2
  });

  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    runPrediction();
  }, [formData, rules, riskThreshold]);

  const runPrediction = () => {
    const res = predictFraudRisk(formData, rules, riskThreshold);
    setPrediction(res);
  };

  const applyPreset = (presetType) => {
    if (presetType === 'SAFE') {
      setFormData({
        amount: 45.50,
        velocity_1h: 1,
        location_dist_km: 2,
        merchant_category: 'Supermarket / Grocery',
        country: 'United States',
        device_change: false,
        failed_pin_count: 0,
        card_present: true,
        hour: 14
      });
    } else if (presetType === 'VELOCITY_ATTACK') {
      setFormData({
        amount: 850,
        velocity_1h: 8,
        location_dist_km: 15,
        merchant_category: 'Electronics Store',
        country: 'United States',
        device_change: true,
        failed_pin_count: 1,
        card_present: false,
        hour: 18
      });
    } else if (presetType === 'GEO_JUMP') {
      setFormData({
        amount: 6500,
        velocity_1h: 2,
        location_dist_km: 3800,
        merchant_category: 'Wire Transfer / P2P',
        country: 'Nigeria (High Risk Proxy)',
        device_change: true,
        failed_pin_count: 0,
        card_present: false,
        hour: 3
      });
    } else if (presetType === 'PIN_RETRY_FRAUD') {
      setFormData({
        amount: 1200,
        velocity_1h: 3,
        location_dist_km: 45,
        merchant_category: 'ATM Cash Withdrawal',
        country: 'United States',
        device_change: false,
        failed_pin_count: 3,
        card_present: true,
        hour: 23
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-red-500" />
              Single Transaction AI Predictor & Explainable AI (XAI)
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Adjust transaction features below to observe real-time machine learning scoring and feature contribution breakdown (SHAP values).
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('SAFE')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
            >
              Preset: Safe Purchase
            </button>
            <button
              onClick={() => applyPreset('VELOCITY_ATTACK')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition"
            >
              Preset: Velocity Attack
            </button>
            <button
              onClick={() => applyPreset('GEO_JUMP')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition"
            >
              Preset: Geo Jump + Wire
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Feature Inputs Form (7 cols) */}
        <div className="lg:col-span-7 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono border-b border-gray-800 pb-3">
            Transaction Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Transaction Amount ($ USD)
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-red-500 focus:outline-none"
              />
              <input
                type="range"
                min="5"
                max="15000"
                step="50"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="w-full mt-2 accent-red-500"
              />
            </div>

            {/* Velocity */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Velocity (Txns in last 1 hour)
              </label>
              <input
                type="number"
                min="1"
                max="15"
                value={formData.velocity_1h}
                onChange={(e) => setFormData({ ...formData, velocity_1h: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-red-500 focus:outline-none"
              />
              <input
                type="range"
                min="1"
                max="12"
                value={formData.velocity_1h}
                onChange={(e) => setFormData({ ...formData, velocity_1h: parseInt(e.target.value) || 1 })}
                className="w-full mt-2 accent-red-500"
              />
            </div>

            {/* Location Distance */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Distance from Base Location (km)
              </label>
              <input
                type="number"
                value={formData.location_dist_km}
                onChange={(e) => setFormData({ ...formData, location_dist_km: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-red-500 focus:outline-none"
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="20"
                value={formData.location_dist_km}
                onChange={(e) => setFormData({ ...formData, location_dist_km: parseFloat(e.target.value) || 0 })}
                className="w-full mt-2 accent-red-500"
              />
            </div>

            {/* Merchant Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Merchant Category
              </label>
              <select
                value={formData.merchant_category}
                onChange={(e) => setFormData({ ...formData, merchant_category: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-red-500 focus:outline-none"
              >
                {MERCHANT_CATEGORIES.map(m => (
                  <option key={m.name} value={m.name}>{m.name} (Risk Base: {Math.round(m.baseRisk * 100)}%)</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Transaction Origin Country
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:border-red-500 focus:outline-none"
              >
                {COUNTRIES.map(c => (
                  <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>

            {/* Hour of Day */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Local Time Hour (0 - 23 hrs)
              </label>
              <input
                type="number"
                min="0"
                max="23"
                value={formData.hour}
                onChange={(e) => setFormData({ ...formData, hour: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-sm font-mono text-white focus:border-red-500 focus:outline-none"
              />
            </div>

          </div>

          {/* Checkbox Switches */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-800">
            <label className="flex items-center space-x-2 bg-gray-950 p-2.5 rounded-xl border border-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.device_change}
                onChange={(e) => setFormData({ ...formData, device_change: e.target.checked })}
                className="rounded border-gray-700 text-red-500 focus:ring-red-500"
              />
              <span className="text-xs text-gray-300">Unrecognized Device</span>
            </label>

            <label className="flex items-center space-x-2 bg-gray-950 p-2.5 rounded-xl border border-gray-800 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.card_present}
                onChange={(e) => setFormData({ ...formData, card_present: e.target.checked })}
                className="rounded border-gray-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-300">Physical Card Present</span>
            </label>

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">
                Failed PIN Retries
              </label>
              <select
                value={formData.failed_pin_count}
                onChange={(e) => setFormData({ ...formData, failed_pin_count: parseInt(e.target.value) || 0 })}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-2 py-1 text-xs text-white"
              >
                <option value={0}>0 attempts (Normal)</option>
                <option value={1}>1 attempt</option>
                <option value={2}>2 attempts</option>
                <option value={3}>3+ attempts (Blocked)</option>
              </select>
            </div>
          </div>

        </div>

        {/* Right Column: AI Risk Output & XAI Explainability (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Prediction Gauge Card */}
          {prediction && (
            <div className={`border rounded-2xl p-6 shadow-2xl backdrop-blur-sm transition-all ${
              prediction.riskLevel === 'HIGH'
                ? 'bg-red-950/30 border-red-800/80 shadow-red-900/20'
                : prediction.riskLevel === 'MEDIUM'
                ? 'bg-amber-950/30 border-amber-800/80 shadow-amber-900/20'
                : 'bg-emerald-950/30 border-emerald-800/80 shadow-emerald-900/20'
            }`}>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-400">
                  AI Model Assessment
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  prediction.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  prediction.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {prediction.riskLevel} RISK
                </span>
              </div>

              {/* Meter Score */}
              <div className="flex flex-col items-center justify-center my-4">
                <div className="relative flex items-center justify-center w-36 h-36">
                  {/* Circular Arc SVG */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={`transition-all duration-700 ease-out ${
                        prediction.riskLevel === 'HIGH' ? 'text-red-500' :
                        prediction.riskLevel === 'MEDIUM' ? 'text-amber-500' : 'text-emerald-500'
                      }`}
                      strokeDasharray={`${prediction.riskScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  
                  <div className="absolute text-center">
                    <span className="text-3xl font-extrabold font-mono text-white">
                      {prediction.riskScore}%
                    </span>
                    <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-mono">
                      Probability
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <div className="text-xs text-gray-400">Recommended System Action</div>
                  <div className={`text-base font-bold uppercase tracking-wide mt-0.5 ${
                    prediction.recommendedAction === 'BLOCK' ? 'text-red-400' :
                    prediction.recommendedAction === 'CHALLENGE_2FA' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {prediction.recommendedAction === 'BLOCK' && '🚨 BLOCK TRANSACTION'}
                    {prediction.recommendedAction === 'CHALLENGE_2FA' && '🔑 CHALLENGE WITH 2FA / OTP'}
                    {prediction.recommendedAction === 'APPROVE' && '✅ APPROVE TRANSACTION'}
                  </div>
                </div>
              </div>

              {prediction.triggeredRule && (
                <div className="mt-3 p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                  <span className="font-bold">⚠️ Hard Rule Triggered:</span> {prediction.triggeredRule.name} ({prediction.triggeredRule.description})
                </div>
              )}

            </div>
          )}

          {/* Explainable AI (XAI) Feature Attribution */}
          {prediction && (
            <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono">
                  Explainable AI (SHAP Factors)
                </h3>
                <span className="text-[10px] text-gray-500 font-mono">Feature Impact</span>
              </div>

              <div className="space-y-2.5">
                {prediction.factors.map((f, i) => (
                  <div key={i} className="text-xs space-y-1">
                    <div className="flex justify-between text-gray-300">
                      <span className="truncate pr-2">{f.name}</span>
                      <span className={`font-mono font-bold ${f.type === 'risk' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {f.impact > 0 ? `+${(f.impact * 100).toFixed(0)}%` : `${(f.impact * 100).toFixed(0)}%`}
                      </span>
                    </div>

                    <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden flex">
                      <div
                        className={`h-full rounded-full ${f.type === 'risk' ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(100, Math.abs(f.impact) * 200)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
