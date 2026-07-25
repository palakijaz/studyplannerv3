import React, { useState } from 'react';
import { X, Plus, BookOpen, Trash2, Check } from 'lucide-react';
import { Subject } from '../types';

interface SubjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export const SubjectManagerModal: React.FC<SubjectManagerModalProps> = ({
  isOpen,
  onClose,
  subjects,
  onAddSubject,
  onDeleteSubject,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [targetHours, setTargetHours] = useState(6);
  const [selectedColor, setSelectedColor] = useState('bg-indigo-600');

  if (!isOpen) return null;

  const colorOptions = [
    'bg-indigo-600',
    'bg-emerald-600',
    'bg-amber-600',
    'bg-rose-600',
    'bg-purple-600',
    'bg-cyan-600',
    'bg-blue-600',
    'bg-pink-600',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) return;

    onAddSubject({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      color: selectedColor,
      targetHoursWeek: Number(targetHours) || 5,
    });

    setName('');
    setCode('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Manage Courses & Subjects
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Subjects List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
          <p className="font-semibold text-slate-400">Current Active Courses ({subjects.length}):</p>
          {subjects.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center space-x-2.5">
                <span className={`w-3 h-3 rounded-full ${sub.color}`} />
                <div>
                  <p className="font-bold text-slate-200">
                    {sub.code} - {sub.name}
                  </p>
                  <p className="text-[10px] text-slate-400">Target: {sub.targetHoursWeek} hrs/week</p>
                </div>
              </div>

              {subjects.length > 1 && (
                <button
                  onClick={() => onDeleteSubject(sub.id)}
                  title="Remove course"
                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Subject Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-slate-800 text-xs">
          <p className="font-bold text-slate-200">Add New Course:</p>

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block text-slate-400 mb-1 font-medium">Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. CS101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-slate-400 mb-1 font-medium">Course Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Intro to Computer Science"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Weekly Target Hours</label>
            <input
              type="number"
              min={1}
              max={30}
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Theme Color</label>
            <div className="flex items-center space-x-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full ${c} flex items-center justify-center transition ${
                    selectedColor === c ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70'
                  }`}
                >
                  {selectedColor === c && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200"
            >
              Done
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-xl"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
