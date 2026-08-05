import React, { useState } from 'react';
import { Sliders, Plus, ToggleLeft, ToggleRight, ShieldAlert, Check, Trash2, HelpCircle, AlertTriangle } from 'lucide-react';

export default function RuleEngineManager({ rules, setRules, riskThreshold, setRiskThreshold }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    name: '',
    condition: '',
    action: 'FORCE_BLOCK',
    severity: 'High',
    description: ''
  });

  const toggleRule = (id) => {
    setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (!newRule.name || !newRule.condition) return;

    const ruleObj = {
      ...newRule,
      id: `rule-${Date.now()}`,
      enabled: true
    };

    setRules([...rules, ruleObj]);
    setNewRule({ name: '', condition: '', action: 'FORCE_BLOCK', severity: 'High', description: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              Security Rule Engine & ML Sensitivity Tuning
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Configure deterministic override security rules and adjust ML threshold sensitivities for fraud classification.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Security Rule</span>
          </button>
        </div>
      </div>

      {/* ML Sensitivity Slider Card */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono">
              Machine Learning Risk Classification Threshold
            </h3>
            <p className="text-xs text-gray-400">
              Transactions with a score above this threshold trigger automatic <span className="text-red-400 font-semibold">BLOCK</span> action.
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold font-mono text-red-400">{riskThreshold}%</span>
            <span className="text-xs text-gray-500 font-mono block">Cutoff Probability</span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <input
            type="range"
            min="40"
            max="90"
            step="1"
            value={riskThreshold}
            onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
            className="w-full accent-red-500 h-2 bg-gray-800 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] font-mono text-gray-400">
            <span>40% (Aggressive Detection / Higher False Positives)</span>
            <span>65% (Balanced Recommended)</span>
            <span>90% (Strict / Lower False Positives)</span>
          </div>
        </div>
      </div>

      {/* Rules List */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono border-b border-gray-800 pb-3">
          Active Security Override Rules ({rules.filter(r => r.enabled).length} Enabled)
        </h3>

        <div className="space-y-3">
          {rules.map((r) => (
            <div
              key={r.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                r.enabled ? 'bg-gray-950/80 border-gray-800' : 'bg-gray-950/30 border-gray-900 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.severity === 'Critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    r.severity === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {r.severity} Severity
                  </span>

                  <h4 className="font-bold text-sm text-gray-200">{r.name}</h4>
                </div>

                <div className="font-mono text-xs text-red-400/90 bg-red-950/30 px-2.5 py-1 rounded border border-red-900/40 inline-block">
                  IF {r.condition} THEN {r.action}
                </div>

                <p className="text-xs text-gray-400">{r.description}</p>
              </div>

              <div className="flex items-center space-x-3 self-end sm:self-center">
                <button
                  onClick={() => toggleRule(r.id)}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    r.enabled
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400 border-gray-700'
                  }`}
                >
                  {r.enabled ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{r.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>

                <button
                  onClick={() => deleteRule(r.id)}
                  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-gray-800 transition"
                  title="Delete Rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create Custom Security Rule</h3>
            
            <form onSubmit={handleAddRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Rule Name</label>
                <input
                  type="text"
                  placeholder="e.g. Overseas Crypto Sudden Jump"
                  required
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Logic Condition Expression</label>
                <input
                  type="text"
                  placeholder="e.g. amount > 2000 AND velocity_1h > 5"
                  required
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-red-400 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Target Action</label>
                  <select
                    value={newRule.action}
                    onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="FORCE_BLOCK">FORCE BLOCK</option>
                    <option value="FORCE_CHALLENGE">FORCE CHALLENGE (2FA)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Severity</label>
                  <select
                    value={newRule.severity}
                    onChange={(e) => setNewRule({ ...newRule, severity: e.target.value })}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Describe why this security rule is enforced..."
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:border-red-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 bg-gray-800 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
