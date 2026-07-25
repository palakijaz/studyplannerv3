import React, { useState } from 'react';
import { Sparkles, X, Loader2, Calendar, BookOpen, Clock, Check, ArrowRight } from 'lucide-react';
import { Subject, StudyPlan, Task } from '../types';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onSavePlan: (plan: StudyPlan, addTasksToPlanner: boolean) => void;
}

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onSavePlan,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [examDate, setExamDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [topicsText, setTopicsText] = useState('');
  const [goalText, setGoalText] = useState('Master core concepts and ace the exam');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);

  if (!isOpen) return null;

  const subject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject ? `${subject.code} - ${subject.name}` : 'General Study',
          examDate,
          availableHoursPerDay: hoursPerDay,
          topics: topicsText.trim() ? topicsText.split('\n').filter(Boolean) : ['Key Course Fundamentals'],
          goal: goalText,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      setGeneratedPlan(data.plan);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while calling AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSave = (addTasksToPlanner: boolean) => {
    if (!generatedPlan) return;

    const newPlan: StudyPlan = {
      id: 'plan-' + Date.now(),
      title: generatedPlan.title || `${subject?.code || 'Course'} Study Schedule`,
      subjectId: selectedSubjectId,
      examDate,
      overview: generatedPlan.overview || 'AI Generated Study Schedule',
      days: generatedPlan.days.map((d: any, index: number) => ({
        dayNumber: d.dayNumber || index + 1,
        title: d.title || `Day ${index + 1}`,
        objectives: d.objectives || [],
        sessions: (d.sessions || []).map((s: any, sIdx: number) => ({
          id: `sess-${index}-${sIdx}-${Date.now()}`,
          topic: s.topic,
          durationMinutes: s.durationMinutes || 45,
          activityType: s.activityType || 'reading',
          description: s.description || '',
          completed: false,
        })),
      })),
      studyTips: generatedPlan.studyTips || [],
      createdAt: new Date().toISOString(),
    };

    onSavePlan(newPlan, addTasksToPlanner);
    onClose();
    setGeneratedPlan(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Study Plan Generator</h2>
              <p className="text-xs text-slate-400">Powered by Gemini 3.6 Flash</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!generatedPlan ? (
          /* Input Form */
          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Course / Subject *</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Exam / Goal Target Date *</label>
                <input
                  type="date"
                  required
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Available Daily Study Time: <strong className="text-indigo-300">{hoursPerDay} Hours/Day</strong>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Syllabus Topics / Chapter List (One per line or comma separated)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Chapter 1: Binary Search Trees&#10;Chapter 2: Heap Operations&#10;Chapter 3: Dijkstra Shortest Path"
                value={topicsText}
                onChange={(e) => setTopicsText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Main Learning Goal</label>
              <input
                type="text"
                placeholder="e.g. Score 90%+ on midterm exam"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                    <span>Building AI Plan...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>Generate AI Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Preview Generated Plan */
          <div className="space-y-4 text-xs max-h-[70vh] overflow-y-auto pr-1">
            <div className="bg-indigo-950/40 border border-indigo-900/50 p-4 rounded-xl">
              <h3 className="text-sm font-bold text-white">{generatedPlan.title}</h3>
              <p className="text-xs text-indigo-200 mt-1">{generatedPlan.overview}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Multi-Day Breakdown ({generatedPlan.days?.length} Days)
              </h4>

              {generatedPlan.days?.map((d: any) => (
                <div key={d.dayNumber} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <span className="font-bold text-indigo-300 text-xs">
                    Day {d.dayNumber}: {d.title}
                  </span>

                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                    {d.objectives?.map((obj: string, idx: number) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {d.sessions?.map((sess: any, idx: number) => (
                      <div key={idx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-[11px]">
                        <p className="font-semibold text-slate-200">{sess.topic}</p>
                        <p className="text-[10px] text-slate-400">{sess.durationMinutes}m • {sess.activityType}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setGeneratedPlan(null)}
                className="text-slate-400 hover:text-white"
              >
                ← Regenerate
              </button>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleConfirmSave(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-xl font-medium"
                >
                  Save Schedule Only
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSave(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Plan + Add Tasks</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
