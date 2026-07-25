import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Plus, 
  RotateCw, 
  Check, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Award, 
  HelpCircle, 
  Loader2, 
  BookOpen, 
  Trash2,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Subject, FlashcardDeck, Flashcard, QuizQuestion } from '../types';

interface FlashcardsViewProps {
  subjects: Subject[];
  decks: FlashcardDeck[];
  onAddDeck: (deck: FlashcardDeck) => void;
  onDeleteDeck: (deckId: string) => void;
  onIncrementQuizStats: () => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  subjects,
  decks,
  onAddDeck,
  onDeleteDeck,
  onIncrementQuizStats,
}) => {
  const [activeDeckId, setActiveDeckId] = useState<string | null>(null);
  const [studyCardIndex, setStudyCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // AI Flashcard Deck Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genSubjectId, setGenSubjectId] = useState(subjects[0]?.id || '');
  const [genTopic, setGenTopic] = useState('');
  const [genCardCount, setGenCardCount] = useState(6);
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Quiz Runner State
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const getSubject = (id: string) => subjects.find((s) => s.id === id);
  const activeDeck = decks.find((d) => d.id === activeDeckId);

  // Flashcard Flip & Study handlers
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setStudyCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
  };

  const handlePrevCard = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setStudyCardIndex((prev) => (prev - 1 + activeDeck.cards.length) % activeDeck.cards.length);
  };

  // Generate Deck via Gemini
  const handleGenerateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genTopic.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrNotes: genTopic.trim(),
          count: genCardCount,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate flashcards');
      }

      const newDeck: FlashcardDeck = {
        id: 'deck-' + Date.now(),
        title: `${genTopic.trim()} (AI Deck)`,
        subjectId: genSubjectId,
        createdAt: new Date().toISOString(),
        cards: data.cards.map((c: any, idx: number) => ({
          id: `card-${idx}-${Date.now()}`,
          front: c.front,
          back: c.back,
          category: c.category || 'Core Concept',
          mastered: false,
        })),
      };

      onAddDeck(newDeck);
      setIsGeneratorOpen(false);
      setGenTopic('');
      setActiveDeckId(newDeck.id);
    } catch (err: any) {
      alert(err.message || 'Failed to generate cards');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate AI Quiz via Gemini
  const handleStartAiQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTopic.trim()) return;

    setIsGeneratingQuiz(true);
    try {
      const response = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicOrNotes: quizTopic.trim(),
          numQuestions: 5,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate quiz');
      }

      setQuizQuestions(data.questions);
      setIsQuizMode(true);
      setQuizCurrentIndex(0);
      setQuizScore(0);
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
      setQuizFinished(false);
    } catch (err: any) {
      alert(err.message || 'Failed to generate quiz questions');
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSelectQuizOption = (optIndex: number) => {
    if (quizSubmitted) return;
    setQuizSelectedOption(optIndex);
  };

  const handleConfirmQuizAnswer = () => {
    if (quizSelectedOption === null) return;
    const currentQ = quizQuestions[quizCurrentIndex];
    if (quizSelectedOption === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
    setQuizSubmitted(true);
  };

  const handleNextQuizQuestion = () => {
    if (quizCurrentIndex < quizQuestions.length - 1) {
      setQuizCurrentIndex((prev) => prev + 1);
      setQuizSelectedOption(null);
      setQuizSubmitted(false);
    } else {
      setQuizFinished(true);
      onIncrementQuizStats();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <span>Flashcards & Active Recall Quizzes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Master active recall with 3D flashcard decks and AI generated practice quizzes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsGeneratorOpen(true)}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md transition"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Generate AI Flashcard Deck</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: STUDYING A FLASHCARD DECK */}
      {activeDeck ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveDeckId(null)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Decks
            </button>
            <span className="text-xs text-slate-400 font-mono">
              Card {studyCardIndex + 1} of {activeDeck.cards.length}
            </span>
          </div>

          {/* 3D Animated Card */}
          {activeDeck.cards.length > 0 && (
            <div className="max-w-xl mx-auto space-y-6">
              <div
                onClick={handleFlipCard}
                className="cursor-pointer perspective-1000 w-full min-h-[280px]"
              >
                <div
                  className={`relative w-full h-full min-h-[280px] rounded-2xl border transition-all duration-500 transform-gpu p-8 flex flex-col justify-between shadow-2xl ${
                    isFlipped
                      ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-indigo-600/60'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold text-indigo-400 uppercase tracking-wider text-[10px]">
                      {activeDeck.cards[studyCardIndex].category || 'Core Concept'}
                    </span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                      {isFlipped ? 'ANSWER (BACK)' : 'QUESTION (FRONT)'}
                    </span>
                  </div>

                  <div className="py-6 text-center">
                    <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                      {isFlipped
                        ? activeDeck.cards[studyCardIndex].back
                        : activeDeck.cards[studyCardIndex].front}
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-1 text-xs text-slate-500">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click card to flip</span>
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePrevCard}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  onClick={handleFlipCard}
                  className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-5 py-2.5 rounded-xl text-xs font-semibold transition"
                >
                  Flip Card
                </button>

                <button
                  onClick={handleNextCard}
                  className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : isQuizMode ? (
        /* VIEW MODE 2: ACTIVE AI QUIZ TEST */
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <button
              onClick={() => setIsQuizMode(false)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Exit Quiz
            </button>
            <span className="text-xs font-bold text-slate-300">
              Question {quizCurrentIndex + 1} of {quizQuestions.length}
            </span>
          </div>

          {!quizFinished ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              <h3 className="text-base font-bold text-white leading-relaxed">
                {quizQuestions[quizCurrentIndex]?.question}
              </h3>

              <div className="space-y-2.5">
                {quizQuestions[quizCurrentIndex]?.options.map((option, idx) => {
                  const isSelected = quizSelectedOption === idx;
                  const isCorrect = idx === quizQuestions[quizCurrentIndex].correctIndex;
                  let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

                  if (quizSubmitted) {
                    if (isCorrect) btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                    else if (isSelected && !isCorrect) btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  } else if (isSelected) {
                    btnStyle = 'bg-indigo-950/80 border-indigo-500 text-indigo-200 font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-xs text-indigo-200 space-y-1">
                  <strong className="font-bold text-indigo-300">Explanation:</strong>
                  <p className="text-slate-300">{quizQuestions[quizCurrentIndex].explanation}</p>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                {!quizSubmitted ? (
                  <button
                    onClick={handleConfirmQuizAnswer}
                    disabled={quizSelectedOption === null}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition"
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-1.5"
                  >
                    <span>{quizCurrentIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Score Summary */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Quiz Completed!</h2>
              <p className="text-sm text-slate-300">
                You scored <strong className="text-indigo-300">{quizScore}</strong> out of{' '}
                <strong className="text-indigo-300">{quizQuestions.length}</strong> ({Math.round((quizScore / quizQuestions.length) * 100)}%)
              </p>

              <button
                onClick={() => setIsQuizMode(false)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-xs inline-flex items-center gap-2"
              >
                <span>Back to Library</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* VIEW MODE 3: DECKS LIBRARY & AI QUIZ GENERATOR BAR */
        <div className="space-y-8">
          {/* AI Quiz Starter Box */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-900/40 p-6 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Generate Instant AI Practice Quiz</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Type any subject topic or paste textbook notes to take a 5-question multiple choice test.
                </p>
              </div>

              <form onSubmit={handleStartAiQuiz} className="flex items-center space-x-2 w-full md:w-auto">
                <input
                  type="text"
                  required
                  placeholder="e.g. Graph Algorithms or Reaction Mechanisms"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 text-xs focus:outline-none focus:border-purple-500 w-full md:w-64"
                />
                <button
                  type="submit"
                  disabled={isGeneratingQuiz}
                  className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-xl text-xs transition shrink-0 flex items-center gap-1.5"
                >
                  {isGeneratingQuiz ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Start Quiz</span>
                </button>
              </form>
            </div>
          </div>

          {/* Flashcard Decks Grid */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Your Flashcard Decks ({decks.length})</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {decks.map((deck) => {
                const subject = getSubject(deck.subjectId);
                return (
                  <div
                    key={deck.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-sm flex flex-col justify-between transition group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        {subject && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${subject.color}`}>
                            {subject.code}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {deck.cards.length} cards
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition">
                        {deck.title}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-4">
                      <button
                        onClick={() => {
                          setActiveDeckId(deck.id);
                          setStudyCardIndex(0);
                          setIsFlipped(false);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition"
                      >
                        Study Deck
                      </button>

                      <button
                        onClick={() => onDeleteDeck(deck.id)}
                        title="Delete Deck"
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* AI FLASHCARD GENERATOR MODAL */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Generate AI Flashcards
              </h2>
              <button onClick={() => setIsGeneratorOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateDeck} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Course / Subject</label>
                <select
                  value={genSubjectId}
                  onChange={(e) => setGenSubjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Topic or Study Notes *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Paste lecture notes, topic name, or key concepts..."
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Number of Cards: <strong className="text-purple-300">{genCardCount}</strong>
                </label>
                <input
                  type="range"
                  min={4}
                  max={12}
                  value={genCardCount}
                  onChange={(e) => setGenCardCount(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGeneratorOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !genTopic.trim()}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate Cards</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
