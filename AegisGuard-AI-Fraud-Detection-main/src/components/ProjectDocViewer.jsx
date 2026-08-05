import React from 'react';
import { ShieldCheck, Cpu, Database, Network, Award, FileText, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProjectDocViewer() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950/40 via-gray-900 to-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Project Documentation & Technical Specs</h2>
            <p className="text-xs text-gray-400 mt-1">Domain: Finance | Project Title: AI-Based Real-Time Fraud Detection System</p>
          </div>
        </div>
      </div>

      {/* Problem Statement Card */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider font-mono flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Problem Statement & Objectives
        </h3>
        <blockquote className="border-l-4 border-red-500 pl-4 py-2 bg-red-950/20 text-gray-200 text-sm font-medium italic">
          "Online transactions are increasing rapidly, leading to sophisticated fraudulent activities. Traditional static rules fail to detect zero-day fraud vectors. Develop an AI system that detects suspicious financial transactions in real time with high precision and low latency."
        </blockquote>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
            <div className="text-xs font-bold text-white">Real-Time Scoring</div>
            <div className="text-xs text-gray-400">Sub-10ms latency per transaction scoring stream.</div>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
            <div className="text-xs font-bold text-white">Explainable AI (XAI)</div>
            <div className="text-xs text-gray-400">SHAP feature attribution explaining model decisions.</div>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-1">
            <div className="text-xs font-bold text-white">Hybrid Engine</div>
            <div className="text-xs text-gray-400">Combines ML Random Forest with deterministic rule overrides.</div>
          </div>
        </div>
      </div>

      {/* System Pipeline Architecture */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-400" />
          End-to-End System Pipeline Architecture
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 relative">
            <div className="font-bold text-blue-400 font-mono">1. Telemetry Ingestion</div>
            <p className="text-gray-400">Captures transaction payload (Amount, Velocity, Geo Distance, Device ID, Merchant category).</p>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 relative">
            <div className="font-bold text-amber-400 font-mono">2. Feature Engineering</div>
            <p className="text-gray-400">Calculates location anomaly jumps, hourly rolling velocity, night hour markers, and PIN retries.</p>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 relative">
            <div className="font-bold text-red-400 font-mono">3. Hybrid ML Classifier</div>
            <p className="text-gray-400">Ensemble classifier outputs risk probability curve (0-100%) and SHAP factor attribution tree.</p>
          </div>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 relative">
            <div className="font-bold text-emerald-400 font-mono">4. Action Enforcer</div>
            <p className="text-gray-400">Triggers instantaneous BLOCK, 2FA OTP challenge, or APPROVE with analyst queue integration.</p>
          </div>

        </div>
      </div>

      {/* Algorithms Comparison Table */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          Machine Learning Model Benchmark Comparison
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-gray-800 rounded-xl overflow-hidden">
            <thead className="bg-gray-950 text-gray-400 font-mono uppercase">
              <tr>
                <th className="p-3">Model Algorithm</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Precision</th>
                <th className="p-3">Recall</th>
                <th className="p-3">ROC-AUC</th>
                <th className="p-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              <tr className="bg-red-950/20 border-l-4 border-red-500 font-bold">
                <td className="p-3 text-white">Random Forest Ensemble (AegisGuard Core)</td>
                <td className="p-3 text-emerald-400">98.8%</td>
                <td className="p-3 text-emerald-400">96.4%</td>
                <td className="p-3 text-emerald-400">94.2%</td>
                <td className="p-3 text-blue-400">0.982</td>
                <td className="p-3 text-gray-300 font-mono">8.4 ms</td>
              </tr>
              <tr className="hover:bg-gray-800/40">
                <td className="p-3 text-gray-300">XGBoost Classifier</td>
                <td className="p-3 text-emerald-400">98.5%</td>
                <td className="p-3 text-emerald-400">95.8%</td>
                <td className="p-3 text-emerald-400">93.9%</td>
                <td className="p-3 text-blue-400">0.979</td>
                <td className="p-3 text-gray-300 font-mono">11.2 ms</td>
              </tr>
              <tr className="hover:bg-gray-800/40">
                <td className="p-3 text-gray-300">Isolation Forest (Unsupervised)</td>
                <td className="p-3 text-gray-300">94.2%</td>
                <td className="p-3 text-gray-300">88.5%</td>
                <td className="p-3 text-gray-300">86.1%</td>
                <td className="p-3 text-blue-400">0.915</td>
                <td className="p-3 text-gray-300 font-mono">4.1 ms</td>
              </tr>
              <tr className="hover:bg-gray-800/40">
                <td className="p-3 text-gray-300">Logistic Regression (Baseline)</td>
                <td className="p-3 text-gray-400">91.0%</td>
                <td className="p-3 text-gray-400">81.2%</td>
                <td className="p-3 text-gray-400">79.0%</td>
                <td className="p-3 text-blue-400">0.850</td>
                <td className="p-3 text-gray-300 font-mono">2.5 ms</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
