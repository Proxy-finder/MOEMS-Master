
import React, { useState } from 'react';
import { solveCustomProblem } from '../services/geminiService.ts';
import { Sparkles, Loader2, Send } from 'lucide-react';
import MathDisplay from './MathDisplay.tsx';

const AIChatSolver: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSolve = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const solution = await solveCustomProblem(input);
      setResult(solution);
    } catch (error) {
      console.error(error);
      alert("Something went wrong with the AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles size={24} className="text-amber-300" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">AI Math Tutor</h2>
            <p className="text-indigo-100 text-sm">Paste any MOEMS problem and I'll explain it step-by-step!</p>
          </div>
        </div>

        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Example: What is the sum of the first 50 odd numbers?"
            className="w-full bg-white/10 border border-white/20 rounded-2xl p-6 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all min-h-[120px]"
          />
          <button
            onClick={handleSolve}
            disabled={loading || !input.trim()}
            className="absolute bottom-4 right-4 bg-white text-indigo-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-400 hover:text-white transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            {loading ? 'Thinking...' : 'Solve Problem'}
          </button>
        </div>

        {result && (
          <div className="mt-8 bg-white text-slate-800 rounded-2xl p-6 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full">
                {result.category}
              </span>
              <button onClick={() => setResult(null)} className="text-slate-400 hover:text-slate-600 text-sm">Clear</button>
            </div>
            
            <p className="font-medium text-lg mb-4">{result.problem}</p>
            
            {result.latex && (
               <div className="bg-slate-50 p-4 rounded-xl text-center mb-6">
                 <MathDisplay latex={result.latex} block />
               </div>
            )}

            <div className="space-y-4">
               {result.explanation.map((step: string, i: number) => (
                 <div key={i} className="flex gap-4 items-start">
                   <div className="flex-shrink-0 w-6 h-6 mt-0.5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                     {i + 1}
                   </div>
                   <p className="text-slate-600 text-sm leading-relaxed">{step}</p>
                 </div>
               ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
               <div className="flex items-center gap-2 font-bold text-green-600">
                 <CheckCircleIcon />
                 Final Answer: {result.answer}
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default AIChatSolver;
