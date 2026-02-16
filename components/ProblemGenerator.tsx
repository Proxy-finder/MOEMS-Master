
import React, { useState } from 'react';
import { generateMOEMSProblemBatch } from '../services/geminiService.ts';
import { Category, Division, Problem, SymbolDefinition } from '../types.ts';
import { Sparkles, Loader2, Wand2, RefreshCw, CheckCircle, XCircle, HelpCircle, Save, Hash, Layers, ChevronRight, ChevronLeft } from 'lucide-react';
import MathDisplay from './MathDisplay.tsx';

interface ProblemGeneratorProps {
  onSaveProblem: (problem: Problem) => void;
}

const ProblemGenerator: React.FC<ProblemGeneratorProps> = ({ onSaveProblem }) => {
  const [loading, setLoading] = useState(false);
  const [batch, setBatch] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [showSymbols, setShowSymbols] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'incorrect'>('none');

  const handleGenerate = async () => {
    setLoading(true);
    setBatch([]);
    setCurrentIndex(0);
    setShowSolution(false);
    setShowSymbols(false);
    setUserAnswer('');
    setFeedback('none');
    
    try {
      const results = await generateMOEMSProblemBatch('Random');
      setBatch(results);
      
      // Automatically add all to bank
      results.forEach((p: any, idx: number) => {
        const problemToSave: Problem = {
          id: `ai-batch-${Date.now()}-${idx}`,
          title: p.title,
          category: p.category as Category,
          division: p.division as Division,
          year: 'Custom',
          description: p.problem,
          latex: p.latex,
          solution: p.explanation,
          answer: String(p.answer),
          symbols: p.symbols
        };
        onSaveProblem(problemToSave);
      });
    } catch (error) {
      console.error(error);
      alert("Failed to generate batch. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = () => {
    const currentProblem = batch[currentIndex];
    if (!currentProblem) return;
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = String(currentProblem.answer).trim().toLowerCase();
    
    if (normalizedUser === normalizedCorrect) {
      setFeedback('correct');
    } else {
      setFeedback('incorrect');
    }
  };

  const nextProblem = () => {
    if (currentIndex < batch.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowSolution(false);
      setShowSymbols(false);
      setUserAnswer('');
      setFeedback('none');
    }
  };

  const prevProblem = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowSolution(false);
      setShowSymbols(false);
      setUserAnswer('');
      setFeedback('none');
    }
  };

  const currentProblem = batch[currentIndex];

  return (
    <div className={`bg-white rounded-3xl p-8 border transition-all duration-300 shadow-sm overflow-hidden relative group ${
      feedback === 'correct' ? 'border-green-200 ring-4 ring-green-50' : 'border-slate-200'
    }`}>
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <Layers size={120} className="text-indigo-600" />
      </div>
      
      <div className="relative z-10">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Problem Batcher</h3>
              <p className="text-slate-500 text-sm">Generate 5 problems at once!</p>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
            {loading ? 'Generating Pack...' : 'Generate New Pack'}
          </button>
        </div>

        {batch.length === 0 ? (
          <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-100 rounded-3xl">
             <Layers size={48} className="text-slate-200 mb-4" />
             <p className="text-slate-400 max-w-xs italic mb-2 font-medium">Click generate to create a training pack of 5 problems.</p>
             <p className="text-slate-300 text-xs">Every generated problem is automatically saved to your Bank!</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Batch Navigation Header */}
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl mb-6 border border-slate-100">
              <button 
                onClick={prevProblem} 
                disabled={currentIndex === 0}
                className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-1.5">
                {batch.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-indigo-600' : 'w-2 bg-slate-200'}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextProblem} 
                disabled={currentIndex === batch.length - 1}
                className="p-2 rounded-xl hover:bg-white text-slate-400 hover:text-indigo-600 disabled:opacity-20 transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {currentProblem.division} • {currentProblem.category}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1">
                  <CheckCircle size={10} /> Saved to Bank
                </span>
                {currentProblem.symbols && currentProblem.symbols.length > 0 && (
                   <button 
                    onClick={() => setShowSymbols(!showSymbols)}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 hover:bg-indigo-200"
                   >
                     <Hash size={10} /> {showSymbols ? 'Hide Glossary' : 'Symbols'}
                   </button>
                )}
              </div>
              <span className="text-slate-400 text-xs font-bold font-mono">PROBLEM {currentIndex + 1} OF 5</span>
            </div>
            
            <h4 className="text-xl font-bold text-slate-800 mb-3">{currentProblem.title}</h4>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg">{currentProblem.problem}</p>
            
            {showSymbols && currentProblem.symbols && (
              <div className="mb-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 animate-in zoom-in-95">
                <h5 className="text-[10px] font-black uppercase text-indigo-400 mb-3 tracking-widest">Notations in this problem</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {currentProblem.symbols.map((s: SymbolDefinition, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/80 p-2 rounded-xl border border-white">
                      <span className="font-mono text-indigo-600 font-bold text-xs bg-white px-1.5 py-0.5 rounded shadow-sm">{s.symbol}</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{s.meaning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentProblem.latex && (
              <div className="bg-slate-50 p-6 rounded-2xl mb-6 text-center border border-slate-100">
                <MathDisplay latex={currentProblem.latex} block />
              </div>
            )}

            {/* Answer Input */}
            <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    if (feedback !== 'none') setFeedback('none');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                  placeholder="Type your answer..."
                  className={`flex-1 px-4 py-3 rounded-xl text-sm border focus:outline-none transition-all ${
                    feedback === 'correct' ? 'border-green-300 bg-green-50' : 
                    feedback === 'incorrect' ? 'border-red-300 bg-red-50' : 
                    'border-slate-200 focus:ring-2 focus:ring-indigo-500 shadow-inner'
                  }`}
                />
                <button 
                  onClick={checkAnswer}
                  className={`px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    feedback === 'correct' ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                  }`}
                >
                  Check
                </button>
              </div>
              {feedback === 'correct' && (
                <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-bold animate-in bounce-in">
                  <CheckCircle size={18} /> Brilliant! That is correct.
                </div>
              )}
              {feedback === 'incorrect' && (
                <div className="mt-3 flex items-center gap-2 text-red-600 text-sm font-bold animate-in shake">
                  <XCircle size={18} /> Not quite right. Try again!
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowSolution(!showSolution)}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-all"
              >
                <HelpCircle size={16} />
                {showSolution ? 'Hide Solution' : 'View Steps'}
              </button>
            </div>

            {showSolution && (
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4 animate-in fade-in duration-300">
                <div className="bg-green-50 text-green-700 p-4 rounded-xl font-bold text-sm flex items-center gap-2 border border-green-100">
                  <div className="w-5 h-5 bg-green-600 text-white rounded-full flex items-center justify-center text-[10px]">A</div>
                  Official Answer: {currentProblem.answer}
                </div>
                <div className="space-y-4">
                  {currentProblem.explanation.map((step: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm leading-relaxed text-slate-600 items-start">
                      <span className="font-black text-indigo-300 bg-indigo-50/50 w-6 h-6 rounded flex items-center justify-center text-[10px] shrink-0">0{i+1}</span>
                      <p>{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemGenerator;
