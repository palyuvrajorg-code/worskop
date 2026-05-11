import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Taxonomy() {
  const taxonomies = [
    {
      name: "EU Taxonomy",
      description: "A classification system establishing a list of environmentally sustainable economic activities.",
      compliance: ["Climate change mitigation", "Climate change adaptation", "Sustainable use of water", "Transition to circular economy", "Pollution prevention", "Protection of biodiversity"],
      strictness: "High",
      color: "border-blue-500/30 text-blue-400 bg-blue-500/10"
    },
    {
      name: "ICMA Green Bond Principles",
      description: "Voluntary process guidelines that recommend transparency and disclosure and promote integrity.",
      compliance: ["Use of Proceeds", "Process for Project Evaluation", "Management of Proceeds", "Reporting"],
      strictness: "Medium",
      color: "border-green-500/30 text-green-400 bg-green-500/10"
    },
    {
      name: "Climate Bonds Initiative",
      description: "Science-based sector criteria to ensure projects are consistent with the 1.5°C warming limit.",
      compliance: ["Sector specific criteria", "Certification process", "Post-issuance reporting", "Verification"],
      strictness: "Very High",
      color: "border-teal-500/30 text-teal-400 bg-teal-500/10"
    }
  ];

  return (
    <motion.div className="space-y-10 animate-fade-in" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="text-4xl font-serif text-cream">Cross-Taxonomy ESG Comparison</h2>
          <p className="text-mint/60 mt-2">Compare standards across major global sustainability frameworks.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {taxonomies.map((tax, i) => (
          <motion.div key={i} variants={itemVariants} className={`p-8 rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-glow relative overflow-hidden`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${tax.color.replace('text', 'bg').replace('border-', 'bg-').split(' ')[0]}`} />
            <h3 className="text-2xl font-bold text-cream mb-3">{tax.name}</h3>
            <p className="text-sm text-mint/70 mb-6 min-h-[60px]">{tax.description}</p>
            
            <div className="mb-6">
              <span className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${tax.color}`}>
                Strictness: {tax.strictness}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm uppercase tracking-widest text-mint/50">Key Principles</p>
              <ul className="space-y-2">
                {tax.compliance.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-mint">
                    <span className="text-neonEmerald mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="p-8 rounded-[36px] border border-white/10 bg-forest/40 backdrop-blur-[12px] shadow-glow overflow-x-auto">
        <h3 className="text-xl font-semibold text-cream mb-6">Alignment Matrix</h3>
        <table className="w-full text-left min-w-[600px]">
          <thead>
            <tr className="border-b border-white/10 text-sm uppercase tracking-widest text-mint/50">
              <th className="pb-4 font-normal">Project Category</th>
              <th className="pb-4 font-normal text-center">EU Taxonomy</th>
              <th className="pb-4 font-normal text-center">ICMA</th>
              <th className="pb-4 font-normal text-center">Climate Bonds</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { cat: "Solar PV Generation", eu: true, icma: true, cb: true },
              { cat: "Energy Efficiency", eu: true, icma: true, cb: "Condition" },
              { cat: "Nuclear Energy", eu: "Condition", icma: false, cb: false },
              { cat: "Clean Transportation", eu: true, icma: true, cb: true }
            ].map((row, i) => (
              <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 text-cream font-medium">{row.cat}</td>
                <td className="py-4 text-center">
                  {row.eu === true ? <span className="text-neonEmerald">Fully Aligned</span> : row.eu === false ? <span className="text-red-400">Not Aligned</span> : <span className="text-yellow-400">Conditional</span>}
                </td>
                <td className="py-4 text-center">
                  {row.icma === true ? <span className="text-neonEmerald">Fully Aligned</span> : row.icma === false ? <span className="text-red-400">Not Aligned</span> : <span className="text-yellow-400">Conditional</span>}
                </td>
                <td className="py-4 text-center">
                  {row.cb === true ? <span className="text-neonEmerald">Fully Aligned</span> : row.cb === false ? <span className="text-red-400">Not Aligned</span> : <span className="text-yellow-400">Conditional</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
