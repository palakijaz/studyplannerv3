import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  Bot, 
  Flame, 
  Clock, 
  Layers, 
  FileText, 
  Plus, 
  Sparkles,
  Award
} from 'lucide-react';
import { UserStats } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  stats: UserStats;
  onOpenAiPlanner: () => void;
  onOpenSubjectModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onOpenAiPlanner,
  onOpenSubjectModal,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'tutor', label: 'AI Tutor', icon: Bot, badge: 'AI' },
    { id: 'flashcards', label: 'Flashcards & Quizzes', icon: Layers },
    { id: 'focus', label: 'Focus Timer', icon: Clock },
    { id: 'notes', label: 'Notes & AI Summaries', icon: FileText },
  ];

  const todayHours = (stats.todayStudyMinutes / 60).toFixed(1);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
                  StudyFlow
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Smart Planner & AI Learning Assistant</p>
            </div>
          </div>

          {/* Center Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Stats & Quick Action */}
          <div className="flex items-center space-x-3">
            {/* Streak Counter */}
            <div className="flex items-center space-x-1.5 bg-amber-950/40 border border-amber-800/40 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-medium">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500/30 animate-bounce" />
              <span className="font-bold">{stats.streakDays}</span>
              <span className="hidden sm:inline text-amber-400/80">day streak</span>
            </div>

            {/* Today's Study Time */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-slate-800/60 border border-slate-700/60 text-slate-300 px-2.5 py-1 rounded-lg text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span><strong className="text-white">{todayHours}h</strong> studied today</span>
            </div>

            {/* Generate Plan Button */}
            <button
              onClick={onOpenAiPlanner}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span className="hidden sm:inline">AI Study Plan</span>
              <span className="sm:hidden">Plan</span>
            </button>

            {/* Add Subject Button */}
            <button
              onClick={onOpenSubjectModal}
              title="Manage Courses & Subjects"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-lg text-xs transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-2 border-t border-slate-800/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 whitespace-nowrap px-3 py-1 rounded-lg text-xs transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
