
import React, { useState, useEffect } from 'react';
import { INITIAL_PROBLEMS } from './constants.tsx';
import { Category, Division, Problem } from './types.ts';
import ProblemCard from './components/ProblemCard.tsx';
import AIChatSolver from './components/AIChatSolver.tsx';
import AIDiscovery from './components/AIDiscovery.tsx';
import ProblemGenerator from './components/ProblemGenerator.tsx';
import { BookOpen, GraduationCap, Trophy, BrainCircuit, Database, Star, Search, Filter, Sparkles, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'study' | 'bank' | 'solve' | 'about'>('study');
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [divFilter, setDivFilter] = useState<Division | 'All'>('All');
  const [yearFilter, setYearFilter] = useState<string | 'All'>('All');
  const [customProblems, setCustomProblems] = useState<Problem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('moems_custom_problems');
    if (saved) {
      try {
        setCustomProblems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load custom problems", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('moems_custom_problems', JSON.stringify(customProblems));
  }, [customProblems]);

  const handleSaveProblem = (problem: Problem) => {
    if (!customProblems.find(p => p.id === problem.id)) {
      setCustomProblems(prev => [problem, ...prev]);
    }
  };

  const clearCustomBank = () => {
    if (window.confirm("Are you sure you want to clear your custom saved problems?")) {
      setCustomProblems([]);
    }
  };

  const years = Array.from(new Set(INITIAL_PROBLEMS.map(p => p.year).filter(Boolean)));
  const allAvailableProblems = [...customProblems, ...INITIAL_PROBLEMS];

  const filteredProblems = allAvailableProblems.filter(p => {
    const catMatch = filter === 'All' || p.category === filter;
    const divMatch = divFilter === 'All' || p.division === divFilter;
    const yearMatch = yearFilter === 'All' || p.year === yearFilter;
    return catMatch && divMatch && yearMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sidebar Navigation (Desktop) */}
      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Trophy className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">MOEMS Master</h1>
            </div>

            <nav className="space-y-1">
              <button 
                onClick={() => setActiveTab('study')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'study' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <BookOpen size={20} />
                Study Guide
              </button>
              <button 
                onClick={() => setActiveTab('bank')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'bank' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <Database size={20} />
                Contest Bank
              </button>
              <button 
                onClick={() => setActiveTab('solve')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'solve' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <BrainCircuit size={20} />
                AI Tutor
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'about' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <GraduationCap size={20} />
                About MOEMS
              </button>
            </nav>
          </div>

          <div className="mt-auto p-6">
            <div className="bg-indigo-600 rounded-2xl p-4 text-white">
              <p className="text-xs text-indigo-200 mb-1">Grade 6 Specialist</p>
              <p className="text-lg font-bold mb-3">{allAvailableProblems.length} Total Problems</p>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div className="bg-white w-[100%] h-full"></div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 pb-20 md:pb-0">
          {/* Header */}
          <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 p-4 md:px-8">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === 'study' ? 'Problem Explorer' : activeTab === 'bank' ? 'Contest Archives' : activeTab === 'solve' ? 'AI Solver' : 'Information'}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  JS
                </div>
              </div>
            </div>
          </header>

          <div className="p-4 md:p-8 max-w-5xl mx-auto">
            {activeTab === 'study' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* AI Problem Generator Section */}
                <ProblemGenerator onSaveProblem={handleSaveProblem} />

                {/* Filters */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Filter size={14} className="text-slate-400 shrink-0" />
                    {['All', ...Object.values(Division)].map((div) => (
                      <button
                        key={div}
                        onClick={() => setDivFilter(div as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          divFilter === div ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {div}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <Sparkles size={14} className="text-indigo-400 shrink-0" />
                    {['All', ...Object.values(Category)].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat as any)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          filter === cat ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Problem Grid */}
                <div className="grid grid-cols-1 gap-6">
                  {filteredProblems.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bank' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="fill-white" size={28} />
                      <h2 className="text-2xl font-black uppercase tracking-tighter">Official Contest Bank</h2>
                    </div>
                    <p className="opacity-90 max-w-2xl mb-6">
                      Access official Division M past papers or view your AI-discovered problems in the "Custom" tab.
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                       {['All', 'Custom', ...years].map(year => (
                         <button 
                           key={year}
                           onClick={() => setYearFilter(year!)}
                           className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${yearFilter === year ? 'bg-white text-amber-600' : 'bg-white/20 hover:bg-white/30'}`}
                         >
                           {year}
                         </button>
                       ))}
                    </div>
                  </div>
                  <Database size={150} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
                </div>

                <AIDiscovery onSaveProblem={handleSaveProblem} />

                <div className="grid grid-cols-1 gap-6">
                   <div className="flex justify-between items-center">
                     <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <Search size={18} className="text-amber-500" />
                       {yearFilter === 'All' ? 'Archive Questions' : yearFilter === 'Custom' ? 'My Custom Collection' : `${yearFilter} Questions`}
                     </h3>
                     {yearFilter === 'Custom' && customProblems.length > 0 && (
                       <button 
                         onClick={clearCustomBank}
                         className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-xs font-bold transition-colors"
                       >
                         <Trash2 size={14} /> Clear Bank
                       </button>
                     )}
                   </div>

                  {filteredProblems.length > 0 ? filteredProblems.map(problem => (
                    <ProblemCard key={problem.id} problem={problem} isCustom={problem.year === 'Custom' || problem.year === 'AI-Generated'} />
                  )) : (
                    <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                      <p className="text-slate-400 mb-4">No problems found for this specific filter.</p>
                      {yearFilter === 'Custom' && (
                        <button 
                          onClick={() => setActiveTab('study')}
                          className="text-indigo-600 font-bold text-sm hover:underline"
                        >
                          Go to Study Guide to generate new problems!
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'solve' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <AIChatSolver />
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 animate-in fade-in duration-500">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Mastering the Contest</h3>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
                  <p>
                    MOEMS contests are more about logic than simple arithmetic. The Division M set represents a high bar of excellence.
                  </p>
                  <p>
                    Use the <strong>Problem Generator</strong> to keep your brain sharp with infinite practice questions, or dive into the <strong>Contest Bank</strong> to see how previous champions were tested.
                  </p>
                  <p className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-xl">
                    <strong>Tip:</strong> You can save AI-generated questions to your personal <strong>Custom Bank</strong> to build your own curated study set!
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white border-t border-slate-200 flex justify-around p-2 sticky bottom-0 z-20">
        <button onClick={() => setActiveTab('study')} className={`flex flex-col items-center p-2 rounded-xl flex-1 ${activeTab === 'study' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <BookOpen size={20} />
          <span className="text-[10px] font-bold mt-1">Guide</span>
        </button>
        <button onClick={() => setActiveTab('bank')} className={`flex flex-col items-center p-2 rounded-xl flex-1 ${activeTab === 'bank' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Database size={20} />
          <span className="text-[10px] font-bold mt-1">Bank</span>
        </button>
        <button onClick={() => setActiveTab('solve')} className={`flex flex-col items-center p-2 rounded-xl flex-1 ${activeTab === 'solve' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <BrainCircuit size={20} />
          <span className="text-[10px] font-bold mt-1">Tutor</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
