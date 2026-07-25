import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  AlertCircle, 
  Filter, 
  BookOpen, 
  Tag, 
  ChevronRight, 
  ListTodo, 
  Layers, 
  X,
  Loader2,
  Check
} from 'lucide-react';
import { Subject, Task, StudyPlan, StudyPlanDay } from '../types';

interface PlannerViewProps {
  subjects: Subject[];
  tasks: Task[];
  studyPlans: StudyPlan[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSaveStudyPlan: (plan: StudyPlan) => void;
  onOpenAiPlannerModal: () => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  subjects,
  tasks,
  studyPlans,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSaveStudyPlan,
  onOpenAiPlannerModal,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'plans' | 'exams'>('tasks');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Add task modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || '');
  const [newDueDate, setNewDueDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    return today.toISOString().split('T')[0];
  });
  const [newMinutes, setNewMinutes] = useState(45);
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newNotes, setNewNotes] = useState('');

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const filteredTasks = tasks.filter((t) => {
    if (selectedSubjectFilter !== 'all' && t.subjectId !== selectedSubjectFilter) return false;
    if (selectedPriorityFilter !== 'all' && t.priority !== selectedPriorityFilter) return false;
    if (statusFilter === 'todo' && t.status === 'completed') return false;
    if (statusFilter === 'completed' && t.status !== 'completed') return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      subjectId: newSubjectId || subjects[0]?.id || '',
      dueDate: newDueDate,
      estimatedMinutes: Number(newMinutes) || 30,
      priority: newPriority,
      status: 'todo',
      notes: newNotes.trim() || undefined,
    });

    setNewTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Main Nav Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Study Planner & Schedule</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize tasks, exams, and generate customized multi-day AI study schedules.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenAiPlannerModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-purple-200 animate-pulse" />
            <span>AI Plan Generator</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-700 transition"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'tasks'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>All Tasks ({tasks.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'plans'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>AI Study Schedules ({studyPlans.length})</span>
        </button>
      </div>

      {/* TAB 1: TASKS & FILTERS */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {/* Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-slate-800/80 p-3 rounded-xl text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1.5 text-slate-400 font-medium">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </div>

              {/* Subject Filter */}
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Courses</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriorityFilter}
                onChange={(e) => setSelectedPriorityFilter(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="todo">Pending Only</option>
                <option value="completed">Completed Only</option>
              </select>
            </div>

            <span className="text-slate-400 text-[11px]">
              Showing {filteredTasks.length} tasks
            </span>
          </div>

          {/* Task List */}
          {filteredTasks.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-200">No tasks found matching filters</p>
              <p className="text-xs text-slate-400 mt-1">
                Add a new task or reset your search filters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const subject = getSubject(task.subjectId);
                const isCompleted = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isCompleted
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3.5">
                      <button
                        onClick={() => onToggleTask(task.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'border-slate-600 hover:border-indigo-400 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </button>

                      <div className="space-y-1">
                        <p className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                          {task.title}
                        </p>

                        {task.notes && (
                          <p className="text-xs text-slate-400 leading-relaxed">{task.notes}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {subject && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${subject.color}`}>
                              {subject.code}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {task.estimatedMinutes} mins
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Due {task.dueDate}
                          </span>
                          {task.isAiGenerated && (
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-1.5 py-0.2 rounded flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> AI Target
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded uppercase tracking-wider ${
                          task.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {task.priority}
                      </span>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        title="Delete task"
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AI STUDY PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {studyPlans.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-3 animate-pulse" />
              <p className="text-base font-bold text-white">No AI Study Plans Generated Yet</p>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
                Use the AI Plan Generator to instantly construct a customized multi-day study schedule with daily milestones and time blocks!
              </p>
              <button
                onClick={onOpenAiPlannerModal}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create First AI Plan</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {studyPlans.map((plan) => {
                const subject = getSubject(plan.subjectId);
                return (
                  <div key={plan.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h2 className="text-lg font-bold text-white">{plan.title}</h2>
                          {subject && (
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${subject.color}`}>
                              {subject.code}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{plan.overview}</p>
                      </div>

                      <div className="text-right text-xs text-slate-400">
                        <p>Target Exam: <strong className="text-indigo-300">{plan.examDate}</strong></p>
                      </div>
                    </div>

                    {/* Study Tips Box */}
                    {plan.studyTips && plan.studyTips.length > 0 && (
                      <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-3 text-xs text-indigo-200 space-y-1">
                        <strong className="text-indigo-300 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Study Recommendations:
                        </strong>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                          {plan.studyTips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Days Accordion / List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plan.days.map((day) => (
                        <div key={day.dayNumber} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                              Day {day.dayNumber}: {day.title}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase">Objectives:</p>
                            <ul className="space-y-1">
                              {day.objectives.map((obj, i) => (
                                <li key={i} className="text-xs text-slate-200 flex items-start gap-1.5">
                                  <span className="text-indigo-500">•</span>
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase">Planned Sessions:</p>
                            {day.sessions.map((sess, i) => (
                              <div key={i} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/60 text-xs flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-slate-200">{sess.topic}</p>
                                  <p className="text-[10px] text-slate-400">{sess.description}</p>
                                </div>
                                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                                  {sess.durationMinutes}m
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CREATE NEW TASK MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> Add Homework / Task
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read Organic Chem Chapter 4 & solve problems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Course / Subject</label>
                  <select
                    value={newSubjectId}
                    onChange={(e) => setNewSubjectId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Est. Duration (mins)</label>
                  <input
                    type="number"
                    min={10}
                    max={360}
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Instructions (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Additional details, page numbers, or submission link..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-indigo-600/30"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
