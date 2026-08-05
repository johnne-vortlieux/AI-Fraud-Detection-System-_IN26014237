import React from 'react';
import { ShieldCheck, Activity, Cpu, AlertTriangle, Sliders, FileText, UploadCloud, Search } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, isLiveStreaming, setIsLiveStreaming, liveCount, highRiskCount }) {
  const tabs = [
    { id: 'monitor', label: 'Live Stream', icon: Activity, badge: liveCount > 0 ? liveCount : null },
    { id: 'predictor', label: 'Single Predictor (XAI)', icon: Cpu },
    { id: 'analytics', label: 'Analytics & ML Metrics', icon: ShieldCheck },
    { id: 'rules', label: 'Security Rules & Tuning', icon: Sliders },
    { id: 'investigate', label: 'Incident Desk', icon: AlertTriangle, badge: highRiskCount > 0 ? highRiskCount : null, badgeColor: 'bg-red-500' },
    { id: 'batch', label: 'Batch CSV Scanner', icon: UploadCloud },
    { id: 'docs', label: 'Architecture Docs', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-gray-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('monitor')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-500/30">
              <ShieldCheck className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg text-white tracking-wide">AEGIS<span className="text-red-500">GUARD</span></h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                  AI Real-Time
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">Fraud Prevention System v3.6</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500/20 to-rose-500/10 text-white border border-red-500/40 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge !== undefined && (
                    <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${tab.badgeColor || 'bg-blue-600'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls Right */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isLiveStreaming
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveStreaming ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span>{isLiveStreaming ? 'Engine Live' : 'Engine Paused'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-2 border-t border-gray-800/60 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs whitespace-nowrap ${
                  isActive ? 'bg-red-500 text-white font-semibold' : 'text-gray-400 bg-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
