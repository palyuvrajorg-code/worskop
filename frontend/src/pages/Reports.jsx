import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFReport } from '../components/PDFReport';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Reports() {
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  const [selectedType, setSelectedType] = useState('Portfolio Impact Report');
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [reportingPeriod, setReportingPeriod] = useState('Q2 2026');

  // Simple CSV generation
  const handleCSVExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Project,Location,Sector,Allocated\n"
      + `Solar Array Alpha,India,Renewable Energy,${investmentAmount * 0.45}\n`
      + `Coastal Mangroves,India,Biodiversity,${investmentAmount * 0.30}\n`
      + `Pending Deployment,N/A,Unallocated,${investmentAmount * 0.25}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedType.replace(/ /g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div className="space-y-10 animate-fade-in max-w-6xl mx-auto" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-cream">Report Generation Center</h2>
          <p className="text-mint/60 mt-2">Generate, preview, and download institutional-grade sustainability reports.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column - Configuration */}
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] shadow-glow">
            <h3 className="text-2xl font-semibold text-cream mb-6">Configure Report</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-mint/70 mb-2 block">Report Type</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint focus:border-neonEmerald/50 transition-all outline-none appearance-none"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option>Portfolio Impact Report</option>
                  <option>Green Bond Allocation Report</option>
                  <option>ESG Compliance Report</option>
                  <option>Sustainability Performance Report</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-mint/70 mb-2 block">Reporting Period</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint focus:border-neonEmerald/50 transition-all outline-none appearance-none"
                  value={reportingPeriod}
                  onChange={(e) => setReportingPeriod(e.target.value)}
                >
                  <option>Q2 2026</option>
                  <option>Q1 2026</option>
                  <option>FY 2025</option>
                  <option>YTD (Year to Date)</option>
                </select>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-mint/70 mb-2 block">Simulated Investment Amount ($)</label>
                <input 
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-mint focus:border-neonEmerald/50 transition-all outline-none" 
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-mint/70 mb-2 block">Export Format</label>
                <div className="flex gap-4">
                  {['PDF', 'CSV', 'Excel'].map(format => (
                    <button 
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`flex-1 py-3 rounded-xl border font-medium transition-colors ${selectedFormat === format ? 'bg-white/10 border-white text-cream' : 'bg-transparent border-white/20 text-mint/60 hover:text-mint'}`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {selectedFormat === 'PDF' ? (
                <PDFDownloadLink
                  document={<PDFReport reportType={selectedType} investmentAmount={investmentAmount} />}
                  fileName={`${selectedType.replace(/ /g, "_")}.pdf`}
                  className="w-full py-4 rounded-xl bg-neonEmerald text-forest font-bold text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex justify-center items-center gap-2"
                >
                  {({ loading }) => (
                    loading ? (
                      <><div className="w-5 h-5 border-2 border-forest border-t-transparent rounded-full animate-spin" /> Generating PDF...</>
                    ) : (
                      <><span className="text-xl">📄</span> Download PDF Report</>
                    )
                  )}
                </PDFDownloadLink>
              ) : (
                <button 
                  onClick={handleCSVExport}
                  className="w-full py-4 rounded-xl bg-neonEmerald text-forest font-bold text-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all flex justify-center items-center gap-2"
                >
                  <span className="text-xl">📊</span> Download {selectedFormat}
                </button>
              )}
            </div>
          </div>

          <div className="p-6 rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-[12px]">
            <h3 className="text-lg font-semibold text-cream mb-4">Saved Reports History</h3>
            <div className="space-y-3">
              {[
                { name: 'FY2025_Impact_Report.pdf', date: 'Jan 10, 2026' },
                { name: 'Q1_2026_Allocation.csv', date: 'Apr 05, 2026' }
              ].map((doc, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{doc.name.endsWith('pdf') ? '📄' : '📊'}</span>
                    <div>
                      <p className="text-sm font-medium text-cream">{doc.name}</p>
                      <p className="text-xs text-mint/50">{doc.date}</p>
                    </div>
                  </div>
                  <span className="text-mint/40 hover:text-mint transition-colors">⬇</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Live Preview */}
        <motion.div variants={itemVariants} className="lg:col-span-7 p-8 rounded-[36px] bg-white text-black shadow-2xl relative min-h-[700px]">
          <div className="absolute top-0 right-0 p-4">
            <span className="bg-black/10 text-black/50 text-xs uppercase tracking-widest px-3 py-1 rounded-full">Web Preview</span>
          </div>
          
          <div className="space-y-8">
            <div className="border-b-2 border-green-800 pb-6 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-serif text-green-900 font-bold">Eco-Capital</h1>
                <p className="text-sm text-gray-500 tracking-widest uppercase">Institutional Impact Report</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>Period: {reportingPeriod}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-gray-800">{selectedType}</h2>
              <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">This report is aligned with the <span className="font-semibold text-green-700">ICMA Harmonised Framework for Impact Reporting</span>, utilizing globally recognized standardized templates and core indicators.</p>
            </div>

            {/* 1. Executive Summary */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 border-b border-gray-200 pb-2">Executive Summary</h3>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 italic">
                "For the period of {reportingPeriod}, your simulated investment of ${investmentAmount.toFixed(2)} has actively contributed to a diversified portfolio of green bonds. The overall portfolio ESG score remains at an exceptional 92/100, signifying strong adherence to sustainable practices and low exposure to greenwashing risks."
              </p>
            </div>

            {/* 2. Detailed Allocation Reporting */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">1. Detailed Allocation Reporting</h3>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 font-semibold">Project & Location</th>
                    <th className="p-2 font-semibold">Sector</th>
                    <th className="p-2 font-semibold text-right">Allocated ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-2">
                      <p className="font-semibold text-gray-800">Solar Array Alpha</p>
                      <p className="text-xs text-gray-500">Rajasthan, India</p>
                    </td>
                    <td className="p-2 text-gray-600">Renewable Energy</td>
                    <td className="p-2 font-bold text-green-700 text-right">${(investmentAmount * 0.45).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="p-2">
                      <p className="font-semibold text-gray-800">Coastal Mangrove Restoration</p>
                      <p className="text-xs text-gray-500">Kerala, India</p>
                    </td>
                    <td className="p-2 text-gray-600">Biodiversity</td>
                    <td className="p-2 font-bold text-green-700 text-right">${(investmentAmount * 0.30).toFixed(2)}</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <td className="p-2 text-gray-500 italic" colSpan="2">Pending Deployment (Unallocated Funds)</td>
                    <td className="p-2 font-bold text-gray-600 text-right">${(investmentAmount * 0.25).toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="bg-green-50/50">
                    <td colSpan="2" className="p-2 font-bold text-right text-gray-800">Total Investment Assessed:</td>
                    <td className="p-2 font-bold text-green-800 text-right">${investmentAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 3. Personalized Impact Metrics */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">2. Pro-Rata Environmental Impact</h3>
              <p className="text-xs text-gray-500 mb-4">Calculated based on your specific ${investmentAmount.toFixed(2)} fractional holding.</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center shadow-sm">
                  <div className="text-2xl mb-1">💨</div>
                  <p className="text-[10px] uppercase text-gray-500 mb-1 font-semibold">CO₂ Avoided</p>
                  <p className="text-xl font-bold text-green-700">{(investmentAmount * 0.0125).toFixed(2)} <span className="text-xs text-gray-500 font-normal">Tons</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center shadow-sm">
                  <div className="text-2xl mb-1">⚡</div>
                  <p className="text-[10px] uppercase text-gray-500 mb-1 font-semibold">Clean Energy</p>
                  <p className="text-xl font-bold text-green-700">{(investmentAmount * 0.0042).toFixed(2)} <span className="text-xs text-gray-500 font-normal">MWh</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center shadow-sm">
                  <div className="text-2xl mb-1">💧</div>
                  <p className="text-[10px] uppercase text-gray-500 mb-1 font-semibold">Water Saved</p>
                  <p className="text-xl font-bold text-green-700">{(investmentAmount * 0.85).toFixed(0)} <span className="text-xs text-gray-500 font-normal">m³</span></p>
                </div>
              </div>
            </div>

            {/* 4. Proof of Third-Party Verification */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">3. External Verification</h3>
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-500 flex-shrink-0">
                  <span className="text-green-700 text-xl">✓</span>
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Verified by Sustainalytics</p>
                  <p className="text-xs text-gray-500">A Second Party Opinion (SPO) has confirmed that the use of proceeds aligns fully with the Green Bond Principles 2021.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
