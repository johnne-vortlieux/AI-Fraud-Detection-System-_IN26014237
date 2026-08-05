import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, XCircle, Lock, Smartphone, MapPin, User, FileText, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function IncidentInvestigationDesk({ transactions, onUpdateTxStatus }) {
  const flaggedList = transactions.filter(t => t.riskLevel === 'HIGH' || t.riskLevel === 'MEDIUM');
  const [selectedTx, setSelectedTx] = useState(flaggedList[0] || null);
  const [analystNotes, setAnalystNotes] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleConfirmFraud = (tx) => {
    onUpdateTxStatus(tx.id, 'CONFIRMED_FRAUD');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`🚨 Transaction ${tx.id} confirmed as FRAUD. User Card Locked & Notification Sent!`);
    setSelectedTx(null);
  };

  const handleMarkFalsePositive = (tx) => {
    onUpdateTxStatus(tx.id, 'FALSE_POSITIVE');
    showToast(`✅ Transaction ${tx.id} marked as FALSE POSITIVE. Model weights updated.`);
    setSelectedTx(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-gray-700 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 animate-bounce">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Fraud Incident Investigation Desk
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Review flagged high-risk transactions, inspect user historical timeline, and perform manual analyst confirmation.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-red-950/40 border border-red-800/50 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-bold font-mono text-red-400">
              {flaggedList.length} Incidents Pending Analyst Review
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Queue List (4 cols) & Inspector Panel (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Flagged Queue List */}
        <div className="lg:col-span-5 bg-gray-900/80 border border-gray-800 rounded-2xl p-4 shadow-xl space-y-3">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider font-mono border-b border-gray-800 pb-2">
            Flagged Cases Queue ({flaggedList.length})
          </h3>

          <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
            {flaggedList.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No active incidents pending analyst review.
              </div>
            ) : (
              flaggedList.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTx(t)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedTx?.id === t.id
                      ? 'bg-red-950/30 border-red-500/80 shadow-md ring-1 ring-red-500/40'
                      : 'bg-gray-950/60 border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-xs text-white">{t.userName}</div>
                      <div className="text-[10px] font-mono text-gray-400">{t.id} • {t.timestamp}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {t.riskScore}% RISK
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-2 text-[11px]">
                    <span className="font-bold font-mono text-gray-200">${t.amount.toLocaleString()}</span>
                    <span className="text-gray-400">{t.merchant_category}</span>
                  </div>

                  {t.status === 'CONFIRMED_FRAUD' && (
                    <div className="mt-2 text-[10px] font-bold text-red-400 bg-red-950/60 p-1 rounded text-center">
                      🚨 CONFIRMED FRAUD (CARD LOCKED)
                    </div>
                  )}
                  {t.status === 'FALSE_POSITIVE' && (
                    <div className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 p-1 rounded text-center">
                      ✅ MARKED SAFE / FALSE POSITIVE
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Case Inspector Drawer */}
        <div className="lg:col-span-7 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-6">
          {selectedTx ? (
            <div className="space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-800 pb-4 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-white">Incident Details: {selectedTx.id}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      selectedTx.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {selectedTx.riskLevel} RISK ({selectedTx.riskScore}%)
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Timestamp: {selectedTx.fullTimestamp || selectedTx.timestamp}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-extrabold text-white font-mono">${selectedTx.amount.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{selectedTx.payment_type}</div>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <div className="text-gray-400 font-mono text-[10px] uppercase">Cardholder Info</div>
                  <div className="font-bold text-gray-200">{selectedTx.userName}</div>
                  <div className="font-mono text-gray-400">{selectedTx.userEmail}</div>
                  <div className="font-mono text-gray-400">{selectedTx.cardNumber}</div>
                </div>

                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                  <div className="text-gray-400 font-mono text-[10px] uppercase">Merchant & Geolocation</div>
                  <div className="font-bold text-gray-200">{selectedTx.merchantName}</div>
                  <div className="text-gray-300">{selectedTx.countryFlag} {selectedTx.country}</div>
                  <div className="text-amber-400 font-mono">Geo Distance: {selectedTx.location_dist_km} km</div>
                </div>

              </div>

              {/* Risk Feature Tree */}
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                  Machine Learning Risk Factors
                </h4>

                <div className="space-y-2">
                  {selectedTx.factors && selectedTx.factors.map((f, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded bg-gray-900/60 border border-gray-800">
                      <span className="text-gray-300">{f.name}</span>
                      <span className={`font-mono font-bold ${f.type === 'risk' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {f.impact > 0 ? `+${(f.impact * 100).toFixed(0)}%` : `${(f.impact * 100).toFixed(0)}%`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Analyst Decision Action Buttons */}
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                  Analyst Final Determination
                </h4>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleConfirmFraud(selectedTx)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg transition"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Confirm Fraud & Lock Card</span>
                  </button>

                  <button
                    onClick={() => handleMarkFalsePositive(selectedTx)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-emerald-400 font-bold text-xs border border-gray-700 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Safe / False Positive</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="text-center py-24 text-gray-500 text-sm">
              Select an incident from the left queue to inspect full telemetry.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
