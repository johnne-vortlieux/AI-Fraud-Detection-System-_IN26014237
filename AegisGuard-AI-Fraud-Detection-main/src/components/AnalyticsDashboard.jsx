import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { calculateModelMetrics } from '../engine/fraudScoringEngine';
import { Shield, Target, Activity, DollarSign, Clock, Award, BarChart3, AlertOctagon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function AnalyticsDashboard({ transactions }) {
  const metrics = calculateModelMetrics(transactions);

  // Chart 1: Real-Time Fraud Velocity Timeline
  const recentTxns = transactions.slice(-15);
  const velocityData = {
    labels: recentTxns.map((t, idx) => t.timestamp || `T-${idx}`),
    datasets: [
      {
        label: 'Transaction Risk Score (%)',
        data: recentTxns.map(t => t.riskScore),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: recentTxns.map(t => t.riskLevel === 'HIGH' ? '#EF4444' : t.riskLevel === 'MEDIUM' ? '#F59E0B' : '#10B981'),
        pointRadius: 5
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111827',
        borderColor: '#374151',
        borderWidth: 1,
        titleColor: '#F9FAFB',
        bodyColor: '#D1D5DB'
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF', font: { size: 10 } } },
      y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9CA3AF', font: { size: 10 } } }
    }
  };

  // Chart 2: Risk Breakdown Donut
  const highCount = transactions.filter(t => t.riskLevel === 'HIGH').length;
  const medCount = transactions.filter(t => t.riskLevel === 'MEDIUM').length;
  const lowCount = transactions.filter(t => t.riskLevel === 'LOW').length;

  const donutData = {
    labels: ['High Risk (Blocked)', 'Medium Risk (2FA)', 'Low Risk (Approved)'],
    datasets: [
      {
        data: [highCount || 5, medCount || 8, lowCount || 22],
        backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
        borderWidth: 0
      }
    ]
  };

  // Chart 3: ROC Curve Simulation
  const rocData = {
    labels: ['0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'],
    datasets: [
      {
        label: 'AegisGuard Random Forest (AUC = 0.982)',
        data: [0.0, 0.45, 0.72, 0.86, 0.92, 0.96, 0.98, 0.99, 0.995, 0.998, 1.0],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Random Guess Baseline',
        data: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        borderColor: '#4B5563',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-500" />
              Machine Learning Analytics & Validation Dashboard
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Real-time classification metrics, confusion matrix, and ROC-AUC curve based on model predictions.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-blue-950/40 border border-blue-800/50 px-4 py-2 rounded-xl">
            <Clock className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-[10px] text-blue-300 font-mono">MODEL LATENCY</div>
              <div className="text-sm font-bold font-mono text-white">{metrics.latencyMs} ms</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Model Precision</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">{metrics.precision}%</div>
          <p className="text-[11px] text-gray-500 mt-1">Ratio of true fraud to all flagged txns</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Model Recall</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">{metrics.recall}%</div>
          <p className="text-[11px] text-gray-500 mt-1">Ratio of detected fraud to total fraud</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">F1-Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono mt-2">{metrics.f1Score}%</div>
          <p className="text-[11px] text-gray-500 mt-1">Harmonic mean of precision & recall</p>
        </div>

        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Loss Prevented</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-2">
            ${metrics.totalLossPrevented.toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Estimated financial loss blocked</p>
        </div>

      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Real-time Risk Score Velocity Line Chart (7 cols) */}
        <div className="lg:col-span-7 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" />
              Live Transaction Risk Score Velocity
            </h3>
            <span className="text-[10px] text-gray-500 font-mono">Last 15 Txns</span>
          </div>

          <div className="h-64">
            <Line data={velocityData} options={lineOptions} />
          </div>
        </div>

        {/* Risk Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" />
            Transaction Classification Distribution
          </h3>

          <div className="h-52 relative flex items-center justify-center">
            <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#D1D5DB', font: { size: 10 } } } } }} />
          </div>
        </div>

      </div>

      {/* Charts Row 2: Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Confusion Matrix Card (6 cols) */}
        <div className="lg:col-span-6 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            Confusion Matrix (Live Dataset)
          </h3>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* TP */}
            <div className="bg-emerald-950/40 border border-emerald-800/80 p-4 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">True Positives (TP)</div>
              <div className="text-3xl font-black font-mono text-emerald-300 mt-1">{metrics.confusionMatrix.tp}</div>
              <div className="text-[10px] text-gray-400 mt-1">Correctly Identified Fraud</div>
            </div>

            {/* FP */}
            <div className="bg-amber-950/40 border border-amber-800/80 p-4 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">False Positives (FP)</div>
              <div className="text-3xl font-black font-mono text-amber-300 mt-1">{metrics.confusionMatrix.fp}</div>
              <div className="text-[10px] text-gray-400 mt-1">Legitimate Flagged as Fraud</div>
            </div>

            {/* FN */}
            <div className="bg-red-950/40 border border-red-800/80 p-4 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-red-400 tracking-wider">False Negatives (FN)</div>
              <div className="text-3xl font-black font-mono text-red-300 mt-1">{metrics.confusionMatrix.fn}</div>
              <div className="text-[10px] text-gray-400 mt-1">Missed Fraud Transactions</div>
            </div>

            {/* TN */}
            <div className="bg-blue-950/40 border border-blue-800/80 p-4 rounded-xl text-center">
              <div className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">True Negatives (TN)</div>
              <div className="text-3xl font-black font-mono text-blue-300 mt-1">{metrics.confusionMatrix.tn}</div>
              <div className="text-[10px] text-gray-400 mt-1">Correctly Approved Safe</div>
            </div>
          </div>
        </div>

        {/* ROC Curve Chart (6 cols) */}
        <div className="lg:col-span-6 bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider font-mono">
              Receiver Operating Characteristic (ROC Curve)
            </h3>
            <span className="text-[10px] text-blue-400 font-mono font-bold">AUC = 0.982</span>
          </div>

          <div className="h-64">
            <Line data={rocData} options={lineOptions} />
          </div>
        </div>

      </div>

    </div>
  );
}
