import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  BookOpen, 
  Copy, 
  Check, 
  Plus, 
  HelpCircle, 
  Loader2, 
  RefreshCw, 
  FileText,
  BookmarkPlus
} from 'lucide-react';
import { Subject, ChatMessage, Note } from '../types';

interface AiTutorViewProps {
  subjects: Subject[];
  notes: Note[];
  onSaveToNotes: (title: string, content: string, subjectId: string) => void;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  subjects,
  notes,
  onSaveToNotes,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [inputQuestion, setInputQuestion] = useState('');
  const [selectedNoteContextId, setSelectedNoteContextId] = useState<string>('none');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [savedNoteIndex, setSavedNoteIndex] = useState<number | null>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I'm your **StudyFlow AI Tutor**. 🎓\n\nHow can I assist your learning today?\n- Ask me to **explain complex concepts** step-by-step.\n- Ask for **real-world analogies** or code examples.\n- Request **practice questions** to test your knowledge.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectNotes = notes.filter((n) => n.subjectId === selectedSubjectId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isLoading]);

  const handleSend = async (customPrompt?: string) => {
    const questionText = (customPrompt || inputQuestion).trim();
    if (!questionText || isLoading) return;

    const userMessage: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: questionText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    if (!customPrompt) setInputQuestion('');
    setIsLoading(true);

    try {
      // Find context note if selected
      const contextNote = notes.find((n) => n.id === selectedNoteContextId);

      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          subject: activeSubject ? `${activeSubject.code} - ${activeSubject.name}` : undefined,
          contextNotes: contextNote ? contextNote.content : undefined,
          history: chatHistory.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const aiMessage: ChatMessage = {
        id: 'msg-ai-' + Date.now(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: 'msg-err-' + Date.now(),
        role: 'assistant',
        content: `Sorry, I encountered an issue: ${err.message || 'Unable to connect to AI server.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveToNotes = (content: string, idx: number) => {
    const title = `AI Tutor Note - ${activeSubject?.code || 'Study'} (${new Date().toLocaleDateString()})`;
    onSaveToNotes(title, content, selectedSubjectId);
    setSavedNoteIndex(idx);
    setTimeout(() => setSavedNoteIndex(null), 2000);
  };

  const quickPrompts = [
    "Explain this concept like I'm 5 years old",
    "Give me 3 practice questions with detailed answers",
    "What are the most common student mistakes on this topic?",
    "Provide a step-by-step real world analogy",
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>AI Study Tutor</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-semibold">
                Gemini 3.6 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Interactive 24/7 academic tutor for deep concept mastery and problem solving.
            </p>
          </div>
        </div>

        {/* Subject & Context Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Active Course:</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {subjectNotes.length > 0 && (
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Reference Note Context:</label>
              <select
                value={selectedNoteContextId}
                onChange={(e) => setSelectedNoteContextId(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="none">No note attached</option>
                {subjectNotes.map((n) => (
                  <option key={n.id} value={n.id}>
                    📄 {n.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex overflow-x-auto gap-2 py-1 scrollbar-none">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            disabled={isLoading}
            className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-indigo-300 text-xs font-medium transition flex items-center space-x-1.5 shrink-0"
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 min-h-[450px] max-h-[600px] flex flex-col justify-between shadow-xl">
        <div className="space-y-4 overflow-y-auto pr-2 flex-1">
          {chatHistory.map((msg, index) => {
            const isAi = msg.role === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAi
                      ? 'bg-slate-950 border border-slate-800 text-slate-200'
                      : 'bg-indigo-600 text-white shadow-md'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                  <div
                    className={`flex items-center justify-between text-[10px] mt-2 pt-2 border-t ${
                      isAi ? 'border-slate-800 text-slate-500' : 'border-indigo-500 text-indigo-200'
                    }`}
                  >
                    <span>{msg.timestamp}</span>

                    {isAi && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleCopyText(msg.content, index)}
                          className="hover:text-slate-300 flex items-center gap-1 transition"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedIndex === index ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveToNotes(msg.content, index)}
                          className="hover:text-indigo-300 flex items-center gap-1 transition"
                        >
                          {savedNoteIndex === index ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <BookmarkPlus className="w-3 h-3" />
                          )}
                          <span>{savedNoteIndex === index ? 'Saved' : 'Save to Notes'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {!isAi && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-2xl flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>AI Tutor is thinking & crafting response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder={`Ask AI Tutor a question about ${activeSubject?.name || 'your studies'}...`}
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold p-3 rounded-xl transition shadow-md shadow-indigo-600/30 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
