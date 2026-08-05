import React, { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, FileSpreadsheet, Download, CheckCircle, ShieldAlert, Cpu, Play } from 'lucide-react';
import { predictFraudRisk } from '../engine/fraudScoringEngine';

export default function BatchScanner({ rules, riskThreshold }) {
  const [scannedResults, setScannedResults] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState('');

  const loadSampleDataset = () => {
    setIsProcessing(true);
    setFileName('sample_creditcard_fraud_transactions.csv');

    setTimeout(() => {
      const sampleRows = [
        { id: 'CSV-001', userName: 'John Doe', amount: 4500, merchant_category: 'Crypto Exchange', country: 'Nigeria (High Risk Proxy)', location_dist_km: 1200, velocity_1h: 6, device_change: true, failed_pin_count: 2 },
        { id: 'CSV-002', userName: 'Alice Smith', amount: 35.00, merchant_category: 'Supermarket / Grocery', country: 'United States', location_dist_km: 3, velocity_1h: 1, device_change: false, failed_pin_count: 0 },
        { id: 'CSV-003', userName: 'Robert Chen', amount: 12000, merchant_category: 'Wire Transfer / P2P', country: 'Russia (High Risk Proxy)', location_dist_km: 3400, velocity_1h: 5, device_change: true, failed_pin_count: 3 },
        { id: 'CSV-004', userName: 'Emily Watson', amount: 120.50, merchant_category: 'Online Retail', country: 'United Kingdom', location_dist_km: 12, velocity_1h: 1, device_change: false, failed_pin_count: 0 },
        { id: 'CSV-005', userName: 'Michael Brown', amount: 890, merchant_category: 'Electronics Store', country: 'United States', location_dist_km: 45, velocity_1h: 4, device_change: true, failed_pin_count: 1 },
        { id: 'CSV-006', userName: 'Sophia Taylor', amount: 15.99, merchant_category: 'Online Retail', country: 'India', location_dist_km: 5, velocity_1h: 1, device_change: false, failed_pin_count: 0 },
        { id: 'CSV-007', userName: 'David Miller', amount: 7800, merchant_category: 'Luxury Goods', country: 'Cayman Islands', location_dist_km: 2100, velocity_1h: 7, device_change: true, failed_pin_count: 2 }
      ];

      const scored = sampleRows.map(row => ({
        ...row,
        ...predictFraudRisk(row, rules, riskThreshold)
      }));

      setScannedResults(scored);
      setIsProcessing(false);
    }, 600);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const scored = results.data.map((row, idx) => {
          const txObj = {
            id: row.id || row.txn_id || `CSV-${idx + 1}`,
            userName: row.user || row.name || 'CSV User',
            amount: parseFloat(row.amount || row.Amount || 100),
            merchant_category: row.merchant_category || row.category || 'Online Retail',
            country: row.country || 'United States',
            location_dist_km: parseFloat(row.distance || row.location_dist_km || 10),
            velocity_1h: parseInt(row.velocity || row.velocity_1h || 1),
            device_change: row.device_change === 'true' || row.device_change === true,
            failed_pin_count: parseInt(row.failed_pin_count || 0)
          };
          return {
            ...txObj,
            ...predictFraudRisk(txObj, rules, riskThreshold)
          };
        });

        setScannedResults(scored);
        setIsProcessing(false);
      }
    });
  };

  const downloadCSVReport = () => {
    if (scannedResults.length === 0) return;

    const csvContent = Papa.unparse(scannedResults.map(r => ({
      Transaction_ID: r.id,
      User: r.userName,
      Amount: r.amount,
      Merchant_Category: r.merchant_category,
      Country: r.country,
      Risk_Score_Percent: r.riskScore,
      Risk_Level: r.riskLevel,
      Recommended_Action: r.recommendedAction,
      Primary_Trigger: r.triggeredRule ? r.triggeredRule.name : (r.factors[0]?.name || 'N/A')
    })));

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Fraud_Detection_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const highRiskBatchCount = scannedResults.filter(r => r.riskLevel === 'HIGH').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-500" />
              Batch CSV Dataset Scanner & Inference
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Upload custom dataset CSV files or run sample transactions through the trained fraud model pipeline.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadSampleDataset}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition"
            >
              Load Pre-Populated Sample CSV
            </button>
          </div>
        </div>
      </div>

      {/* Upload Drop Zone */}
      <div className="bg-gray-900/80 border-2 border-dashed border-gray-800 hover:border-red-500/50 rounded-2xl p-8 text-center shadow-xl transition-all">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csvFileInput"
        />
        <label htmlFor="csvFileInput" className="cursor-pointer space-y-3 flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <FileSpreadsheet className="w-6 h-6" />
          </div>

          <div>
            <span className="text-sm font-bold text-gray-200">
              {fileName ? `File Selected: ${fileName}` : 'Click to Upload Transaction CSV Dataset'}
            </span>
            <p className="text-xs text-gray-500 mt-1">Supports Kaggle Credit Card Fraud dataset format & custom columns</p>
          </div>
        </label>
      </div>

      {/* Results Table */}
      {scannedResults.length > 0 && (
        <div className="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Batch Scan Summary ({scannedResults.length} Processed)
              </h3>
              <p className="text-xs text-gray-400">
                Flagged <span className="text-red-400 font-bold">{highRiskBatchCount} High Risk</span> transactions.
              </p>
            </div>

            <button
              onClick={downloadCSVReport}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition"
            >
              <Download className="w-4 h-4" />
              <span>Export Scored CSV Report</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950 text-gray-400 font-mono uppercase border-b border-gray-800">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Merchant Category</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Risk Score</th>
                  <th className="p-3">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {scannedResults.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-800/40">
                    <td className="p-3 font-mono text-gray-400">{r.id}</td>
                    <td className="p-3 font-semibold text-gray-200">{r.userName}</td>
                    <td className="p-3 font-mono font-bold text-gray-100">${r.amount}</td>
                    <td className="p-3 text-gray-300">{r.merchant_category}</td>
                    <td className="p-3 text-gray-400">{r.country}</td>
                    <td className="p-3 font-mono font-bold text-xs">
                      <span className={r.riskLevel === 'HIGH' ? 'text-red-400' : r.riskLevel === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}>
                        {r.riskScore}% ({r.riskLevel})
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs uppercase font-semibold">
                      <span className={r.recommendedAction === 'BLOCK' ? 'text-red-400' : r.recommendedAction === 'CHALLENGE_2FA' ? 'text-amber-400' : 'text-emerald-400'}>
                        {r.recommendedAction}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
