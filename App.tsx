import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { DashboardView } from './DashboardView';
import { PlannerView } from './PlannerView';
import { AiTutorView } from './AiTutorView';
import { FlashcardsView } from './FlashcardsView';
import { FocusTimerView } from './FocusTimerView';
import { NotesLibraryView } from './NotesLibraryView';
import { AiPlannerModal } from './AiPlannerModal';
import { SubjectManagerModal } from './SubjectManagerModal';

import {
  Subject,
  Task,
  StudyPlan,
  FlashcardDeck,
  Note,
  StudySessionLog,
  UserStats,
} from './types';

import {
  INITIAL_SUBJECTS,
  INITIAL_TASKS,
  INITIAL_STUDY_PLANS,
  INITIAL_FLASHCARD_DECKS,
  INITIAL_NOTES,
  INITIAL_STUDY_SESSIONS,
  INITIAL_USER_STATS,
} from './data/initialData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // LocalStorage state management
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('studyflow_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('studyflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('studyflow_study_plans');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_PLANS;
  });

  const [decks, setDecks] = useState<FlashcardDeck[]>(() => {
    const saved = localStorage.getItem('studyflow_decks');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARD_DECKS;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('studyflow_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [sessions, setSessions] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem('studyflow_sessions');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_SESSIONS;
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('studyflow_stats');
    return saved ? JSON.parse(saved) : INITIAL_USER_STATS;
  });

  // Modal controls
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('studyflow_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('studyflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studyflow_study_plans', JSON.stringify(studyPlans));
  }, [studyPlans]);

  useEffect(() => {
    localStorage.setItem('studyflow_decks', JSON.stringify(decks));
  }, [decks]);

  useEffect(() => {
    localStorage.setItem('studyflow_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('studyflow_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('studyflow_stats', JSON.stringify(stats));
  }, [stats]);

  // Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          if (nextStatus === 'completed') {
            setStats((s) => ({ ...s, completedTasksCount: s.completedTasksCount + 1 }));
          }
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: 'task-' + Date.now(),
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSaveStudyPlan = (newPlan: StudyPlan, addTasksToPlanner: boolean) => {
    setStudyPlans((prev) => [newPlan, ...prev]);

    if (addTasksToPlanner) {
      const generatedTasks: Task[] = [];
      newPlan.days.forEach((day) => {
        day.sessions.forEach((s) => {
          generatedTasks.push({
            id: 'task-gen-' + Math.random().toString(36).substr(2, 9),
            title: `[Day ${day.dayNumber}] ${s.topic}`,
            subjectId: newPlan.subjectId,
            dueDate: newPlan.examDate,
            estimatedMinutes: s.durationMinutes,
            priority: 'high',
            status: 'todo',
            notes: s.description,
            isAiGenerated: true,
          });
        });
      });
      setTasks((prev) => [...generatedTasks, ...prev]);
    }
  };

  const handleAddSubject = (newSub: Omit<Subject, 'id'>) => {
    const subject: Subject = {
      ...newSub,
      id: 'subj-' + Date.now(),
    };
    setSubjects((prev) => [...prev, subject]);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  const handleAddDeck = (deck: FlashcardDeck) => {
    setDecks((prev) => [deck, ...prev]);
  };

  const handleDeleteDeck = (deckId: string) => {
    setDecks((prev) => prev.filter((d) => d.id !== deckId));
  };

  const handleLogSession = (session: StudySessionLog) => {
    setSessions((prev) => [session, ...prev]);
    setStats((s) => ({
      ...s,
      totalStudyMinutes: s.totalStudyMinutes + session.durationMinutes,
      todayStudyMinutes: s.todayStudyMinutes + session.durationMinutes,
    }));
  };

  const handleAddNote = (newNote: Omit<Note, 'id' | 'updatedAt'>) => {
    const note: Note = {
      ...newNote,
      id: 'note-' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [note, ...prev]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const handleGenerateDeckFromNote = async (title: string, text: string, subjectId: string) => {
    setActiveTab('flashcards');
  };

  const handleIncrementQuizStats = () => {
    setStats((s) => ({ ...s, quizzesTaken: s.quizzesTaken + 1 }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
        onOpenSubjectModal={() => setIsSubjectModalOpen(true)}
      />

      {/* View Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            stats={stats}
            subjects={subjects}
            tasks={tasks}
            studyPlans={studyPlans}
            sessions={sessions}
            onToggleTask={handleToggleTask}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
            onOpenAddTask={() => setActiveTab('planner')}
          />
        )}

        {activeTab === 'planner' && (
          <PlannerView
            subjects={subjects}
            tasks={tasks}
            studyPlans={studyPlans}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onSaveStudyPlan={(plan) => handleSaveStudyPlan(plan, true)}
            onOpenAiPlannerModal={() => setIsAiPlannerOpen(true)}
          />
        )}

        {activeTab === 'tutor' && (
          <AiTutorView
            subjects={subjects}
            notes={notes}
            onSaveToNotes={(title, content, subjectId) => {
              handleAddNote({ title, content, subjectId });
            }}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            subjects={subjects}
            decks={decks}
            onAddDeck={handleAddDeck}
            onDeleteDeck={handleDeleteDeck}
            onIncrementQuizStats={handleIncrementQuizStats}
          />
        )}

        {activeTab === 'focus' && (
          <FocusTimerView
            subjects={subjects}
            onLogSession={handleLogSession}
          />
        )}

        {activeTab === 'notes' && (
          <NotesLibraryView
            subjects={subjects}
            notes={notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onGenerateDeckFromNote={handleGenerateDeckFromNote}
          />
        )}
      </main>

      {/* Global Modals */}
      <AiPlannerModal
        isOpen={isAiPlannerOpen}
        onClose={() => setIsAiPlannerOpen(false)}
        subjects={subjects}
        onSavePlan={handleSaveStudyPlan}
      />

      <SubjectManagerModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        subjects={subjects}
        onAddSubject={handleAddSubject}
        onDeleteSubject={handleDeleteSubject}
      />
    </div>
  );
}
