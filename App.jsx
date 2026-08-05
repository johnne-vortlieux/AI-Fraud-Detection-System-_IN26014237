import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LiveStreamMonitor from './components/LiveStreamMonitor';
import TransactionPredictor from './components/TransactionPredictor';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import RuleEngineManager from './components/RuleEngineManager';
import IncidentInvestigationDesk from './components/IncidentInvestigationDesk';
import BatchScanner from './components/BatchScanner';
import ProjectDocViewer from './components/ProjectDocViewer';

import { INITIAL_RULES } from './engine/defaultRules';
import { generateRandomTransaction, generateInitialDataset } from './engine/mockDataGenerator';
import { X, Lock, CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('monitor');
  const [rules, setRules] = useState(INITIAL_RULES);
  const [riskThreshold, setRiskThreshold] = useState(65);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [isAttackMode, setIsAttackMode] = useState(false);

  const [transactions, setTransactions] = useState(() => {
    return generateInitialDataset(25, INITIAL_RULES, 65);
  });

  const [inspectedTx, setInspectedTx] = useState(null);

  // Live streaming effect
  useEffect(() => {
    if (!isLiveStreaming) return;

    const intervalTime = isAttackMode ? 700 : 1800;

    const interval = setInterval(() => {
      const newTx = generateRandomTransaction(isAttackMode, rules, riskThreshold);
      setTransactions(prev => [newTx, ...prev.slice(0, 199)]); // Keep last 200 txns
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isLiveStreaming, isAttackMode, rules, riskThreshold]);

  const triggerAttackMode = () => {
    setIsAttackMode(true);
    setTimeout(() => {
      setIsAttackMode(false);
    }, 10000);
  };

  const handleUpdateTxStatus = (id, newStatus) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: newStatus,
          actual_is_fraud: newStatus === 'CONFIRMED_FRAUD' ? true : false
        };
      }
      return t;
    }));
  };

  const highRiskCount = transactions.filter(t => t.riskLevel === 'HIGH').length;

  return (
    <div className="min-h-screen bg-[#090D16] text-gray-100 font-sans flex flex-col selection:bg-red-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveStreaming={isLiveStreaming}
        setIsLiveStreaming={setIsLiveStreaming}
        liveCount={transactions.length}
        highRiskCount={highRiskCount}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'monitor' && (
          <LiveStreamMonitor
            transactions={transactions}
            isLiveStreaming={isLiveStreaming}
            setIsLiveStreaming={setIsLiveStreaming}
            triggerAttackMode={triggerAttackMode}
            isAttackMode={isAttackMode}
            onInspectTransaction={(tx) => setInspectedTx(tx)}
            onClearTransactions={() => setTransactions([])}
          />
        )}

        {activeTab === 'predictor' && (
          <TransactionPredictor
            rules={rules}
            riskThreshold={riskThreshold}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            transactions={transactions}
          />
        )}

        {activeTab === 'rules' && (
          <RuleEngineManager
            rules={rules}
            setRules={setRules}
            riskThreshold={riskThreshold}
            setRiskThreshold={setRiskThreshold}
          />
        )}

        {activeTab === 'investigate' && (
          <IncidentInvestigationDesk
            transactions={transactions}
            onUpdateTxStatus={handleUpdateTxStatus}
          />
        )}

        {activeTab === 'batch' && (
          <BatchScanner
            rules={rules}
            riskThreshold={riskThreshold}
          />
        )}

        {activeTab === 'docs' && (
          <ProjectDocViewer />
        )}

      </main>

      {/* Inspection Modal */}
      {inspectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setInspectedTx(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className={`p-2.5 rounded-xl ${
                inspectedTx.riskLevel === 'HIGH' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                inspectedTx.riskLevel === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-bold text-white">Transaction Telemetry: {inspectedTx.id}</h3>
                <span className="text-xs font-mono text-gray-400">{inspectedTx.timestamp}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-950 p-4 rounded-xl border border-gray-800">
              <div>
                <span className="text-gray-400 font-mono block text-[10px]">USER / ACCOUNT</span>
                <span className="font-bold text-gray-200">{inspectedTx.userName}</span>
                <span className="block font-mono text-gray-400 text-[10px]">{inspectedTx.cardNumber}</span>
              </div>

              <div>
                <span className="text-gray-400 font-mono block text-[10px]">AMOUNT</span>
                <span className="font-extrabold font-mono text-white text-base">${inspectedTx.amount.toLocaleString()}</span>
                <span className="block text-gray-400 text-[10px]">{inspectedTx.payment_type}</span>
              </div>

              <div>
                <span className="text-gray-400 font-mono block text-[10px]">MERCHANT</span>
                <span className="text-gray-200 font-medium">{inspectedTx.merchant_category}</span>
              </div>

              <div>
                <span className="text-gray-400 font-mono block text-[10px]">LOCATION / DISTANCE</span>
                <span className="text-gray-200">{inspectedTx.countryFlag} {inspectedTx.country}</span>
                <span className="block text-amber-400 font-mono text-[10px]">{inspectedTx.location_dist_km} km away</span>
              </div>
            </div>

            {/* Risk Gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-gray-400">Risk Probability:</span>
                <span className={`font-bold ${inspectedTx.riskLevel === 'HIGH' ? 'text-red-400' : inspectedTx.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {inspectedTx.riskScore}% ({inspectedTx.riskLevel} RISK)
                </span>
              </div>
              <div className="w-full bg-gray-950 h-2.5 rounded-full overflow-hidden border border-gray-800">
                <div
                  className={`h-full rounded-full transition-all ${
                    inspectedTx.riskLevel === 'HIGH' ? 'bg-red-500' : inspectedTx.riskLevel === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${inspectedTx.riskScore}%` }}
                ></div>
              </div>
            </div>

            {/* XAI Factors */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-300 font-mono uppercase tracking-wider block">
                Feature Attribution Factors (XAI):
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {inspectedTx.factors && inspectedTx.factors.map((f, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs bg-gray-950 p-2 rounded border border-gray-800">
                    <span className="text-gray-300 truncate pr-2">{f.name}</span>
                    <span className={`font-mono font-bold ${f.type === 'risk' ? 'text-red-400' : 'text-emerald-400'}`}>
                      {f.impact > 0 ? `+${(f.impact * 100).toFixed(0)}%` : `${(f.impact * 100).toFixed(0)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setInspectedTx(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white"
              >
                Close Telemetry View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800/80 bg-[#070A11] py-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>AegisGuard AI Fraud Detection Engine • Academic & Enterprise Security System</span>
          <span>Domain: Finance | Modern Machine Learning Pipeline</span>
        </div>
      </footer>

    </div>
  );
}
