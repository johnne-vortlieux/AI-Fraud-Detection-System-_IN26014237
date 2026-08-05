import React, { useState } from 'react';
import { Play, Pause, Zap, ShieldAlert, CheckCircle, AlertTriangle, Search, Filter, Eye, ArrowUpRight, Lock, MapPin, Smartphone, Clock } from 'lucide-react';

export default function LiveStreamMonitor({
  transactions,
  isLiveStreaming,
  setIsLiveStreaming,
  triggerAttackMode,
  isAttackMode,
  onInspectTransaction,
  onClearTransactions
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filteredTxns = transactions.filter(t => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.merchant_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || t.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const highRiskCount = transactions.filter(t => t.riskLevel === 'HIGH').length;
  const medRiskCount = transactions.filter(t => t.riskLevel === 'MEDIUM').length;
  const lowRiskCount = transactions.filter(t => t.riskLevel === 'LOW').length;
  const fraudRate = transactions.length > 0 ? ((highRiskCount / transactions.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Real-Time Transaction Stream
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isAttackMode ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {isAttackMode ? '⚠️ Fraud Attack Burst Active' : 'Normal Traffic'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Scoring transactions in real time using Random Forest Ensemble & Rule Engine.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Stream Toggle Button */}
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all shadow-md ${
                isLiveStreaming
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
            >
              {isLiveStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLiveStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
            </button>

            {/* Attack Simulator Button */}
            <button
              onClick={triggerAttackMode}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-lg ${
                isAttackMode
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 animate-pulse ring-2 ring-red-500'
                  : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500'
              }`}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Simulate Fraud Attack Burst</span>
            </button>

            {/* Clear Button */}
            <button
              onClick={onClearTransactions}
              className="px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
            >
              Clear Feed
            </button>
          </div>

        </div>

        {/* Ticker Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-gray-950/60 border border-gray-800/80 rounded-xl p-3">
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">Total Streamed</div>
            <div className="text-xl font-bold text-white mt-1 font-mono">{transactions.length}</div>
          </div>

          <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-3">
            <div className="text-[11px] font-medium text-red-400 uppercase tracking-wider flex items-center justify-between">
              <span>High Risk (Blocked)</span>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-xl font-bold text-red-400 mt-1 font-mono">{highRiskCount}</div>
          </div>

          <div className="bg-amber-950/30 border border-amber-900/40 rounded-xl p-3">
            <div className="text-[11px] font-medium text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>Medium Risk (2FA)</span>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-amber-400 mt-1 font-mono">{medRiskCount}</div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-xl p-3">
            <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>Fraud Rate</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-mono">{fraudRate}%</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, User, Merchant, Country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map(level => (
            <button
              key={level}
              onClick={() => setRiskFilter(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                riskFilter === level
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'
              }`}
            >
              {level === 'ALL' ? 'All Risks' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-950/80 text-gray-400 uppercase tracking-wider font-mono border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Time / TXN ID</th>
                <th className="py-3 px-4">User & Account</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Category & Geo</th>
                <th className="py-3 px-4">Risk Gauge</th>
                <th className="py-3 px-4">Primary Flag / XAI Factor</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-sans">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500">
                    No transactions matching current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => {
                  const isHigh = t.riskLevel === 'HIGH';
                  const isMed = t.riskLevel === 'MEDIUM';

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-gray-800/40 transition-colors ${
                        isHigh ? 'bg-red-950/10' : isMed ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Time / ID */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3.5 h-3.5 text-gray-500" />
                          <span className="font-mono text-gray-300">{t.timestamp}</span>
                        </div>
                        <div className="font-mono text-[10px] text-gray-500">{t.id}</div>
                      </td>

                      {/* User */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-gray-200">{t.userName}</div>
                        <div className="font-mono text-[10px] text-gray-500">{t.cardNumber}</div>
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-gray-100 font-mono text-sm">${t.amount.toLocaleString()}</div>
                        <div className="text-[10px] text-gray-500">{t.payment_type}</div>
                      </td>

                      {/* Merchant & Geo */}
                      <td className="py-3 px-4">
                        <div className="text-gray-300 font-medium">{t.merchant_category}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <span>{t.countryFlag} {t.country}</span>
                          {t.location_dist_km > 100 && (
                            <span className="text-amber-400 font-mono">({t.location_dist_km} km)</span>
                          )}
                        </div>
                      </td>

                      {/* Risk Score */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-800 rounded-full h-2 overflow-hidden border border-gray-700">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isHigh ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${t.riskScore}%` }}
                            ></div>
                          </div>
                          <span className={`font-mono font-bold text-xs ${
                            isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {t.riskScore}%
                          </span>
                        </div>
                        <div className="mt-0.5">
                          <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            isHigh ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            isMed ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {t.riskLevel} RISK
                          </span>
                        </div>
                      </td>

                      {/* Primary Factor */}
                      <td className="py-3 px-4 max-w-xs">
                        {t.triggeredRule ? (
                          <div className="text-[11px] font-semibold text-red-400 bg-red-950/40 p-1.5 rounded border border-red-900/50">
                            🚨 Rule Trigger: {t.triggeredRule.name}
                          </div>
                        ) : t.factors && t.factors.length > 0 ? (
                          <div className="text-[11px] text-gray-300 truncate">
                            {t.factors[0].type === 'risk' ? '⚠️ ' : '✅ '}
                            {t.factors[0].name}
                          </div>
                        ) : (
                          <div className="text-gray-500">Normal pattern</div>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onInspectTransaction(t)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition flex items-center space-x-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
