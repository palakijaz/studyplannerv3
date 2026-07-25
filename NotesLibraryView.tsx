import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  BookOpen, 
  Loader2, 
  Layers, 
  Check, 
  Edit3, 
  X,
  BookmarkPlus
} from 'lucide-react';
import { Subject, Note } from '../types';

interface NotesLibraryViewProps {
  subjects: Subject[];
  notes: Note[];
  onAddNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onGenerateDeckFromNote: (title: string, text: string, subjectId: string) => void;
}

export const NotesLibraryView: React.FC<NotesLibraryViewProps> = ({
  subjects,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onGenerateDeckFromNote,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(notes[0]?.id || null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  // Edit / New Note modal state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubjectId, setEditSubjectId] = useState(subjects[0]?.id || '');
  const [editContent, setEditContent] = useState('');

  // AI Summarize loading
  const [isSummarizing, setIsSummarizing] = useState(false);

  const activeNote = notes.find((n) => n.id === selectedNoteId);
  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  const filteredNotes = notes.filter((n) => {
    if (selectedSubjectFilter !== 'all' && n.subjectId !== selectedSubjectFilter) return false;
    return true;
  });

  const handleOpenNewNote = () => {
    setEditTitle('');
    setEditSubjectId(subjects[0]?.id || '');
    setEditContent('');
    setIsEditorOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) return;

    onAddNote({
      title: editTitle.trim(),
      subjectId: editSubjectId,
      content: editContent.trim(),
    });

    setIsEditorOpen(false);
  };

  // Run AI Summarizer via Gemini
  const handleRunAiSummarizer = async () => {
    if (!activeNote) return;

    setIsSummarizing(true);
    try {
      const response = await fetch('/api/ai/summarize-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notesContent: activeNote.content,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to summarize notes');
      }

      const updated: Note = {
        ...activeNote,
        summary: data.result.summary,
        keyTakeaways: data.result.keyTakeaways,
        keyTerms: data.result.keyTerms,
        reviewQuestions: data.result.reviewQuestions,
        updatedAt: new Date().toISOString(),
      };

      onUpdateNote(updated);
    } catch (err: any) {
      alert(err.message || 'AI summarizer error');
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <span>Notes & AI Summarizer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store study notes and use 1-click AI to extract key terms, summaries, and flashcards.
          </p>
        </div>

        <button
          onClick={handleOpenNewNote}
          className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Grid: Sidebar List + Note View/Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Note List */}
        <div className="space-y-3">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Notes Filter:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
            >
              <option value="all">All Courses</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const subject = getSubject(note.subjectId);
              const isSelected = note.id === selectedNoteId;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500/80 text-white shadow'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    {subject && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${subject.color}`}>
                        {subject.code}
                      </span>
                    )}
                    {note.summary && (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded border border-purple-500/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> AI Boosted
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-bold leading-tight line-clamp-1">{note.title}</h3>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 font-sans">{note.content}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Active Note Viewer */}
        <div className="lg:col-span-2">
          {activeNote ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Note Header & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-lg font-bold text-white">{activeNote.title}</h2>
                    {getSubject(activeNote.subjectId) && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${getSubject(activeNote.subjectId)?.color}`}>
                        {getSubject(activeNote.subjectId)?.code}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Updated {new Date(activeNote.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRunAiSummarizer}
                    disabled={isSummarizing}
                    className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-3.5 py-2 rounded-xl text-xs transition shadow-md disabled:opacity-50"
                  >
                    {isSummarizing ? (
                      <Loader2 className="w-4 h-4 animate-spin text-purple-200" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-purple-200" />
                    )}
                    <span>AI Summarize & Boost</span>
                  </button>

                  <button
                    onClick={() => onGenerateDeckFromNote(activeNote.title, activeNote.content, activeNote.subjectId)}
                    title="Generate Flashcards from Note"
                    className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs transition"
                  >
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="hidden sm:inline">Make Flashcards</span>
                  </button>

                  <button
                    onClick={() => onDeleteNote(activeNote.id)}
                    title="Delete Note"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Generated Executive Summary Panel */}
              {activeNote.summary && (
                <div className="bg-indigo-950/40 border border-indigo-900/50 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-indigo-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AI Executive Summary</span>
                  </div>
                  <p className="text-xs text-indigo-100 leading-relaxed">{activeNote.summary}</p>

                  {/* Key Terms */}
                  {activeNote.keyTerms && activeNote.keyTerms.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[11px] font-bold text-purple-300 mb-2">Key Terms Glossary:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeNote.keyTerms.map((kt, i) => (
                          <div key={i} className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                            <strong className="text-indigo-300 font-semibold">{kt.term}:</strong>{' '}
                            <span className="text-slate-300">{kt.definition}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Main Raw Note Content */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap font-mono leading-relaxed">
                {activeNote.content}
              </div>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-200">No Note Selected</p>
              <p className="text-xs text-slate-400 mt-1">Select a note from the left menu or create a new one.</p>
            </div>
          )}
        </div>

      </div>

      {/* NEW NOTE MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" /> Create Study Note
              </h2>
              <button onClick={() => setIsEditorOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Note Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms & Dijkstra Shortest Path"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Course / Subject</label>
                <select
                  value={editSubjectId}
                  onChange={(e) => setEditSubjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs focus:outline-none focus:border-emerald-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Note Content *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Write or paste your lecture notes, key terms, or textbook summaries..."
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 text-xs font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl text-xs transition"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
