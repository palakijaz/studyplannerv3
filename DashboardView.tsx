import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Flame, 
  BookOpen, 
  ArrowRight, 
  Play, 
  Bot, 
  Layers, 
  TrendingUp, 
  CheckSquare, 
  BarChart2,
  Plus
} from 'lucide-react';
import { Subject, Task, StudyPlan, UserStats, StudySessionLog } from '../types';

interface DashboardViewProps {
  stats: UserStats;
  subjects: Subject[];
  tasks: Task[];
  studyPlans: StudyPlan[];
  sessions: StudySessionLog[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (tab: string) => void;
  onOpenAiPlanner: () => void;
  onOpenAddTask: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  subjects,
  tasks,
  studyPlans,
  sessions,
  onToggleTask,
  onNavigate,
  onOpenAiPlanner,
  onOpenAddTask,
}) => {
  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const pendingTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Active study plan
  const activePlan = studyPlans[0];

  // Calculate hours spent per subject this week from sessions
  const subjectHoursMap = subjects.map((sub) => {
    const subSessions = sessions.filter((s) => s.subjectId === sub.id);
    const totalMinutes = subSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const hours = (totalMinutes / 60).toFixed(1);
    return {
      subject: sub,
      hours: parseFloat(hours),
      target: sub.targetHoursWeek,
      progress: Math.min(100, Math.round((parseFloat(hours) / sub.targetHoursWeek) * 100)),
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-slate-100 shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-12 w-48 h-48 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Study Companion Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to crush your study goals today?
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              You've logged <strong className="text-indigo-300">{stats.todayStudyMinutes} mins</strong> today across your courses. Keep up the momentum!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAiPlanner}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 transition transform active:scale-95 text-xs sm:text-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span>Generate AI Plan</span>
            </button>
            <button
              onClick={() => onNavigate('focus')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition"
            >
              <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span>Start Focus Session</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Study Time</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">
              {(stats.totalStudyMinutes / 60).toFixed(1)} <span className="text-sm font-normal text-slate-400">hrs</span>
            </p>
            <p className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +{(stats.todayStudyMinutes / 60).toFixed(1)}h today
            </p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Study Streak</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">
              {stats.streakDays} <span className="text-sm font-normal text-amber-500/80">days</span>
            </p>
            <p className="text-[11px] text-amber-400/90 mt-0.5">Top 5% consistent learner</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">Task Completion</p>
            <p className="text-2xl font-bold text-slate-100 mt-1">{completionRate}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{completedTasks.length} of {tasks.length} tasks done</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-400">AI Quizzes Taken</p>
            <p className="text-2xl font-bold text-purple-300 mt-1">{stats.quizzesTaken}</p>
            <p className="text-[11px] text-purple-400/90 mt-0.5">Active recall drills</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
            <Layers className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Tasks & Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Tasks & Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Priority Tasks Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-slate-100">Tasks & Homework</h2>
                <span className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded-full font-medium">
                  {pendingTasks.length} pending
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAddTask}
                  className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
                <button
                  onClick={() => onNavigate('planner')}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Task Items List */}
            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((task) => {
                const subject = getSubject(task.subjectId);
                const isCompleted = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isCompleted
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600 hover:border-indigo-400 text-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <div>
                        <p className={`text-xs sm:text-sm font-semibold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          {subject && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${subject.color}`}>
                              {subject.code}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            Due: {task.dueDate}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            • {task.estimatedMinutes} mins
                          </span>
                          {task.isAiGenerated && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                        task.priority === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : task.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-700/50 text-slate-300'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active AI Study Plan Overview */}
          {activePlan && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="text-base font-bold text-slate-100">{activePlan.title}</h2>
                </div>
                <button
                  onClick={() => onNavigate('planner')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Full Plan Details <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <p className="text-xs text-slate-300 mb-4">{activePlan.overview}</p>

              {/* Day preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activePlan.days.slice(0, 2).map((day) => (
                  <div key={day.dayNumber} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-300">
                        Day {day.dayNumber}: {day.title}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {day.objectives.map((obj, idx) => (
                        <li key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right 1 Col: Course Progress & AI Assistant Quick Links */}
        <div className="space-y-6">
          
          {/* Quick AI Tools Panel */}
          <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900 border border-indigo-900/40 rounded-2xl p-5">
            <div className="flex items-center space-x-2 mb-3">
              <Bot className="w-5 h-5 text-indigo-400" />
              <h2 className="text-base font-bold text-white">AI Learning Powerups</h2>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Get instant help with complex concepts, flashcards, or study plans.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('tutor')}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100 group-hover:text-indigo-300">
                      Ask AI Tutor
                    </p>
                    <p className="text-[10px] text-slate-400">Step-by-step concept explanations</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => onNavigate('flashcards')}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100 group-hover:text-purple-300">
                      Flashcards & Quizzes
                    </p>
                    <p className="text-[10px] text-slate-400">Active recall with AI drills</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition" />
              </button>

              <button
                onClick={() => onNavigate('notes')}
                className="w-full text-left p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100 group-hover:text-emerald-300">
                      Summarize Notes
                    </p>
                    <p className="text-[10px] text-slate-400">Extract key terms & takeaways</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition" />
              </button>
            </div>
          </div>

          {/* Subject Hours Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-slate-100">Course Hours Target</h2>
              </div>
              <span className="text-xs text-slate-400">This Week</span>
            </div>

            <div className="space-y-3.5">
              {subjectHoursMap.map(({ subject, hours, target, progress }) => (
                <div key={subject.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-200 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${subject.color}`} />
                      {subject.name}
                    </span>
                    <span className="text-slate-400 font-mono">
                      {hours} / {target} hrs
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress >= 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
