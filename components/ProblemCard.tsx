
import React, { useState } from 'react';
import { Problem, Division, SymbolDefinition } from '../types.ts';
import MathDisplay from './MathDisplay.tsx';
import { fetchSymbolDefinitions } from '../services/geminiService.ts';
import { Lightbulb, CheckCircle, Info, XCircle, ChevronRight, HelpCircle, Sparkles, Hash, Loader2 } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  isCustom?: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isCustom = false }) => {
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [fetchingSymbols, setFetchingSymbols] = useState(false);
  const [customSymbols, setCustomSymbols] = useState<SymbolDefinition[] | undefined>(problem.symbols);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

  const checkAnswer = () => {
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = problem.answer.trim().toLowerCase();
    
    if (normalizedUser === normalizedCorrect) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const handleFetchSymbols = async () => {
    if (customSymbols && customSymbols.length > 0) {
      setShowSymbols(!showSymbols);
      return;
    }
    
    setFetchingSymbols(true);
    try {
      const symbols = await fetchSymbolDefinitions(problem.description);
      setCustomSymbols(symbols);
      setShowSymbols(true);
    } catch (err) {
      console.error("Failed to fetch symbols", err);
    } finally {
      setFetchingSymbols(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 overflow-hidden ${
      feedback === 'correct' ? 'border-green-200 ring-2 ring-green-50 shadow-green-100' : 
      isCustom ? 'border-indigo-200 ring-1 ring-indigo-50' : 'border-slate-200'
    }`}>
      <div className="p-6">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div className="flex gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
              problem.division === Division.M ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {problem.division}
            </span>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-tighter">
              {problem.category}
            </span>
            {isCustom && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full uppercase tracking-tighter">
                <Sparkles size={8} /> Custom
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
            {problem.year && <span>{problem.year}</span>}
            {problem.contest && <span>C{problem.contest}</span>}
            <span className="opacity-50">#{problem.id}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-slate-800 mb-2">{problem.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-4">{problem.description}</p>
        
        {problem.latex && (
          <div className="bg-slate-50 p-6 rounded-xl text-center mb-6 border border-slate-100/50">
            <MathDisplay latex={problem.latex} block />
          </div>
        )}

        {/* Interaction Area */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
           <div className="flex gap-2">
             <input 
               type="text"
               value={userAnswer}
               onChange={(e) => {
                 setUserAnswer(e.target.value);
                 if (feedback !== 'none') setFeedback('none');
               }}
               onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
               placeholder="Your answer..."
               className={`flex-1 px-4 py-2 rounded-xl text-sm border focus:outline-none transition-all ${
                 feedback === 'correct' ? 'border-green-300 bg-green-50' : 
                 feedback === 'incorrect' ? 'border-red-300 bg-red-50' : 
                 'border-slate-200 focus:ring-2 focus:ring-indigo-500'
               }`}
             />
             <button 
               onClick={checkAnswer}
               className={`px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-sm ${
                 feedback === 'correct' ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
               }`}
             >
               Check
             </button>
           </div>

           {feedback === 'correct' && (
             <div className="mt-3 flex items-center gap-2 text-green-600 text-xs font-bold animate-in slide-in-from-top-1">
               <CheckCircle size={14} /> Correct! Great job!
             </div>
           )}
           {feedback === 'incorrect' && (
             <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-600 text-xs font-bold animate-in slide-in-from-top-1">
                  <XCircle size={14} /> Not quite. Try again!
                </div>
                <button 
                  onClick={() => setShowHint(true)}
                  className="text-indigo-600 text-xs font-bold hover:underline"
                >
                  Need a hint?
                </button>
             </div>
           )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleFetchSymbols}
            disabled={fetchingSymbols}
            className="flex items-center gap-2 px-3 py-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
          >
            {fetchingSymbols ? <Loader2 size={14} className="animate-spin" /> : <Hash size={14} />}
            {showSymbols ? 'Hide Symbols' : 'Explain Symbols'}
          </button>

          {problem.hint && (
            <button 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-3 py-1.5 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg text-xs font-bold transition-colors"
            >
              <Lightbulb size={14} />
              {showHint ? 'Hide Hint' : 'Hint'}
            </button>
          )}
          
          <button 
            onClick={() => setShowSolution(!showSolution)}
            className="flex items-center gap-2 px-3 py-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
          >
            <HelpCircle size={14} />
            {showSolution ? 'Hide Steps' : 'View Solution'}
          </button>
        </div>

        {showSymbols && customSymbols && customSymbols.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-top-1">
            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1">
              <Hash size={10} /> Symbol Glossary
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customSymbols.map((s, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-100">
                  <span className="flex-shrink-0 font-mono text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded text-xs">
                    {s.symbol}
                  </span>
                  <p className="text-slate-600 text-[11px] leading-tight mt-0.5">{s.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showHint && problem.hint && (
          <div className="mt-4 p-4 bg-amber-50/50 border-l-4 border-amber-400 rounded-r-lg text-amber-800 text-xs italic animate-in fade-in duration-300">
            <strong>Hint:</strong> {problem.hint}
          </div>
        )}

        {showSolution && (
          <div className="mt-6 border-t border-slate-100 pt-6 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-4 bg-green-50 p-3 rounded-xl border border-green-100">
               <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black">ANS</div>
               <span className="text-green-700 font-bold text-sm">{problem.answer}</span>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                <Info size={10} /> Step-by-Step Breakdown
              </h4>
              {problem.solution.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemCard;
