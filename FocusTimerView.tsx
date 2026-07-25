import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Award, 
  Music,
  Zap
} from 'lucide-react';
import { Subject, StudySessionLog } from '../types';

interface FocusTimerViewProps {
  subjects: Subject[];
  onLogSession: (session: StudySessionLog) => void;
}

export const FocusTimerView: React.FC<FocusTimerViewProps> = ({
  subjects,
  onLogSession,
}) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [timerMode, setTimerMode] = useState<'study' | 'short_break' | 'long_break'>('study');
  
  // Durations in seconds
  const modeDurations = {
    study: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  const [timeLeft, setTimeLeft] = useState(modeDurations.study);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);

  // Audio ambience state
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whitenoise' | 'lofi'>('none');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Handle timer countdown
  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    if (timerMode === 'study') {
      const durationMins = Math.round(modeDurations.study / 60);
      onLogSession({
        id: 'sess-' + Date.now(),
        subjectId: selectedSubjectId,
        durationMinutes: durationMins,
        date: new Date().toISOString().split('T')[0],
        type: 'pomodoro',
        notes: 'Pomodoro focus session completed',
      });
      setCompletedSessionsCount((prev) => prev + 1);
    }
  };

  const handleSwitchMode = (mode: 'study' | 'short_break' | 'long_break') => {
    setIsRunning(false);
    setTimerMode(mode);
    setTimeLeft(modeDurations[mode]);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[timerMode]);
  };

  // Web Audio Synthesizer for Ambient Noise (Rain / White Noise / Lo-Fi)
  useEffect(() => {
    if (ambientSound === 'none') {
      if (noiseNodeRef.current) {
        try { (noiseNodeRef.current as any).stop(); } catch (e) {}
        noiseNodeRef.current = null;
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      // Stop previous
      if (noiseNodeRef.current) {
        try { (noiseNodeRef.current as any).stop(); } catch (e) {}
      }

      // Generate White Noise / Rain Filter
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = ambientSound === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = ambientSound === 'rain' ? 800 : 1200;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      noiseNodeRef.current = whiteNoise as any;
    } catch (e) {
      console.warn('Audio synth not supported in iframe', e);
    }

    return () => {
      if (noiseNodeRef.current) {
        try { (noiseNodeRef.current as any).stop(); } catch (e) {}
      }
    };
  }, [ambientSound]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalDuration = modeDurations[timerMode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <span>Focus & Pomodoro Timer</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain deep focus with Pomodoro cycles and soothing ambient soundscapes.
          </p>
        </div>

        {/* Subject Selector */}
        <div>
          <label className="text-[10px] text-slate-400 block mb-0.5 font-medium">Log Time To Subject:</label>
          <select
            value={selectedSubjectId}
            onChange={(e) => setSelectedSubjectId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80 max-w-md mx-auto text-xs">
          <button
            onClick={() => handleSwitchMode('study')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              timerMode === 'study' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Study (25m)
          </button>
          <button
            onClick={() => handleSwitchMode('short_break')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              timerMode === 'short_break' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleSwitchMode('long_break')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              timerMode === 'long_break' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Countdown Ring */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-slate-800 fill-none stroke-[8]"
            />
            <circle
              cx="128"
              cy="128"
              r="110"
              className="stroke-indigo-500 fill-none stroke-[8] transition-all duration-1000 ease-linear"
              strokeDasharray={2 * Math.PI * 110}
              strokeDashoffset={2 * Math.PI * 110 * (1 - progressPercent / 100)}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold text-white font-mono tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mt-2">
              {timerMode === 'study' ? 'Deep Study Session' : 'Rest & Recharge'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition transform active:scale-95 ${
              isRunning ? 'bg-amber-600 hover:bg-amber-500' : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {isRunning ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleReset}
            title="Reset Timer"
            className="w-12 h-12 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl flex items-center justify-center border border-slate-700 transition"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Sound Ambiance Selector */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400 mb-3">
            <Music className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-slate-200">Ambient Background Audio</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              onClick={() => setAmbientSound('none')}
              className={`px-3 py-1.5 rounded-xl border transition ${
                ambientSound === 'none'
                  ? 'bg-slate-800 border-indigo-500 text-white font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Mute
            </button>
            <button
              onClick={() => setAmbientSound('rain')}
              className={`px-3 py-1.5 rounded-xl border transition ${
                ambientSound === 'rain'
                  ? 'bg-indigo-900/60 border-indigo-500 text-indigo-200 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              🌧️ Gentle Rain
            </button>
            <button
              onClick={() => setAmbientSound('whitenoise')}
              className={`px-3 py-1.5 rounded-xl border transition ${
                ambientSound === 'whitenoise'
                  ? 'bg-purple-900/60 border-purple-500 text-purple-200 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              📻 White Noise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
