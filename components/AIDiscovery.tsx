
import React, { useState } from 'react';
import { discoverProblemsFromWeb } from '../services/geminiService.ts';
import { Category, Division, Problem } from '../types.ts';
import { Search, Loader2, ExternalLink, Sparkles, BookOpen, Save, CheckCircle } from 'lucide-react';
import MathDisplay from './MathDisplay.tsx';

interface AIDiscoveryProps {
  onSaveProblem: (problem: Problem) => void;
}

const AIDiscovery: React.FC<AIDiscoveryProps> = ({ onSaveProblem }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setIsSaved(false);
    try {
      const data = await discoverProblemsFromWeb(query);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("AI Search failed. Please try a more specific math topic.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const problemToSave: Problem = {
      id: `discovered-${Date.now()}`,
      title: result.data.source_year ? `${result.data.source_year} Contest ${result.data.source_contest}` : 'Discovered Problem',
      category: Category.LOGIC, // Defaulting as discovery doesn't always provide specific cat
      division: Division.M,
      year: 'Custom',
      description: result.data.problem,
      latex: result.data.latex,
      solution: result.data.explanation,
      answer: String(result.data.answer)
    };
    onSaveProblem(problemToSave);
    setIsSaved(true);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-amber-500" />
        <h3 className="font-bold text-slate-800">Search Official Past Papers</h3>
      </div>
      
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g. 2017 Division M Geometry..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Discover'}
        </button>
      </div>

      {result && (
        <div className="mt-6 animate-in zoom-in-95 duration-300">
           <div className="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100">
              <div className="flex justify-between items-start mb-3">
                 <div className="flex gap-2 items-center">
                   <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">NEW FIND</span>
                   <button 
                     onClick={handleSave}
                     disabled={isSaved}
                     className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                       isSaved ? 'bg-green-100 text-green-700' : 'bg-white border border-indigo-200 text-indigo-600 hover:bg-indigo-50'
                     }`}
                   >
                     {isSaved ? <CheckCircle size={10} /> : <Save size={10} />}
                     {isSaved ? 'Saved' : 'Save to Bank'}
                   </button>
                 </div>
                 <div className="text-[10px] font-bold text-slate-400">
                   {result.data.source_year} Contest {result.data.source_contest}
                 </div>
              </div>
              <p className="text-slate-800 font-medium mb-4">{result.data.problem}</p>
              
              {result.data.latex && (
                <div className="bg-white p-4 rounded-xl mb-4 text-center">
                  <MathDisplay latex={result.data.latex} block />
                </div>
              )}

              <details className="group">
                <summary className="list-none cursor-pointer flex items-center gap-2 text-indigo-600 text-xs font-bold hover:underline mb-2">
                  <BookOpen size={14} /> View Official Solution
                </summary>
                <div className="space-y-3 pt-2 pl-4 border-l-2 border-indigo-200">
                  {result.data.explanation.map((step: string, i: number) => (
                    <p key={i} className="text-slate-600 text-xs leading-relaxed">{step}</p>
                  ))}
                  <div className="font-bold text-green-600 text-sm pt-2">Answer: {result.data.answer}</div>
                </div>
              </details>

              {result.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-indigo-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Verified Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.map((source: any, i: number) => (
                      <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink size={12} />
                        {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default AIDiscovery;
