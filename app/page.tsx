'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  BookOpen,
  Trophy,
  Home as HomeIcon,
  Heart,
  Star,
  Flame,
  CheckCircle2,
  XCircle,
  Sparkles,
  Volume2
} from 'lucide-react';
import {
  quizQuestions,
  dailyVocabulary,
  initialLeaderboard,
  Difficulty,
  Question,
  DailyWord
} from '@/data/content';

type View = 'home' | 'quiz' | 'daily' | 'leaderboard';

export default function Page() {
  const [view, setView] = useState<View>('home');
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // User Stats
  const [score, setScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedScore = localStorage.getItem('quizScore');
      if (savedScore) {
        const parsed = parseInt(savedScore, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedStreak = localStorage.getItem('quizStreak');
      if (savedStreak) {
        const parsed = parseInt(savedStreak, 10);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 0;
  });
  
  // Quiz State
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Daily State
  const [dailyWords, setDailyWords] = useState<DailyWord[]>(dailyVocabulary);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quizScore', score.toString());
      localStorage.setItem('quizStreak', streak.toString());
    }
  }, [score, streak]);

  const startQuiz = () => {
    const questions = quizQuestions.filter((q) => q.difficulty === difficulty);
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 5));
    setCurrentQuestionIndex(0);
    setLives(3);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
    setView('quiz');
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === currentQuestions[currentQuestionIndex].correctAnswer;
    setIsAnswerCorrect(correct);

    if (correct) {
      setScore((prev) => prev + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30));
    } else {
      setLives((prev) => prev - 1);
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (lives <= 0 && !isAnswerCorrect) {
      setQuizFinished(true);
      return;
    }

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerCorrect(null);
    } else {
      setQuizFinished(true);
      if (lives > 0) {
        setStreak((prev) => prev + 1);
      }
    }
  };

  const toggleWordLearned = (id: string) => {
    setDailyWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, learned: !w.learned } : w))
    );
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#6366F1] text-white font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      
      {view !== 'quiz' && (
        <header className="flex justify-between items-center p-6 bg-white shadow-xl z-10 relative rounded-b-[2rem]">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-xl">📚</span>
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-800">Eng<span className="text-indigo-500">Mastery</span></h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-black">
            <div className="flex items-center gap-1 text-blue-500">
              <Star className="w-4 h-4 fill-current" />
              <span>{score} XP</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="w-4 h-4 fill-current" />
              <span>{streak} ДН</span>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 overflow-y-auto pb-24 relative">
        <AnimatePresence mode="wait">
          
          {view === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 space-y-8"
            >
              <div className="text-center space-y-2 mt-4">
                <h2 className="text-3xl font-black tracking-tight text-white">Готовы учиться?</h2>
                <p className="text-indigo-100 font-medium">Выполняйте задания и зарабатывайте очки.</p>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-slate-800 space-y-6">
                <div>
                  <h3 className="font-black uppercase tracking-widest text-slate-400 text-sm mb-4">Уровень сложности</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['easy', 'medium', 'hard'] as Difficulty[]).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`py-3 px-2 rounded-2xl text-sm font-bold transition-all ${
                          difficulty === level
                            ? 'bg-indigo-500 text-white shadow-[0_4px_0_0_#4338ca] -translate-y-[2px]'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {level === 'easy' ? 'Новичок' : level === 'medium' ? 'Средний' : 'Профи'}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={startQuiz}
                  className="w-full bg-indigo-600 active:translate-y-[2px] active:shadow-[0_2px_0_0_#4338ca] transition-all text-white py-4 rounded-2xl font-black text-lg flex justify-center items-center gap-2 shadow-[0_6px_0_0_#4338ca]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  НАЧАТЬ ВИКТОРИНУ
                </button>
              </div>

              <div className="bg-yellow-400 p-6 rounded-[2rem] text-slate-900 shadow-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black uppercase tracking-tight text-lg">Ежедневная цель</h3>
                  <Trophy className="w-6 h-6" />
                </div>
                <p className="font-bold opacity-80 mb-4 text-sm">Выучите 5 новых слов сегодня, чтобы увеличить серию побед!</p>
                <div className="w-full bg-yellow-500 rounded-full h-4 mb-2 shadow-inner">
                  <div 
                    className="bg-white h-4 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${(dailyWords.filter(w => w.learned).length / dailyWords.length) * 100}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs font-black">
                  {dailyWords.filter(w => w.learned).length} / {dailyWords.length} СЛОВ
                </div>
              </div>
            </motion.div>
          )}

          {view === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="absolute inset-0 bg-[#6366F1] z-20 flex flex-col p-4 md:p-6"
            >
              {!quizFinished ? (
                <div className="bg-white rounded-[2.5rem] shadow-xl text-slate-800 flex-1 flex flex-col overflow-hidden">
                  <div className="p-6 flex justify-between items-center">
                    <button onClick={() => setView('home')} className="text-slate-400 hover:text-slate-600">
                      <XCircle className="w-8 h-8" />
                    </button>
                    <div className="w-full mx-6 bg-slate-100 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex) / currentQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Heart
                          key={i}
                          className={`w-7 h-7 ${i < lives ? 'text-red-500 fill-current' : 'text-slate-200'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 p-6 flex flex-col overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 italic">
                        {difficulty === 'easy' ? 'Новичок' : difficulty === 'medium' ? 'Средний' : 'Профи'} • Вопрос {currentQuestionIndex + 1}
                      </span>
                    </div>

                    <h2 className="text-3xl font-black leading-tight mb-8">
                      {currentQuestions[currentQuestionIndex].text}
                    </h2>

                    <div className="space-y-4 mb-8">
                      {currentQuestions[currentQuestionIndex].options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestions[currentQuestionIndex].correctAnswer;
                        
                        let buttonClass = 'border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50';
                        let letterClass = 'bg-slate-100 text-slate-400 group-hover:bg-indigo-200 group-hover:text-indigo-600';
                        
                        if (selectedAnswer !== null) {
                          if (isCorrect) {
                            buttonClass = 'border-4 border-green-500 bg-green-50 text-green-700';
                            letterClass = 'bg-green-500 text-white';
                          } else if (isSelected) {
                            buttonClass = 'border-4 border-red-500 bg-red-50 text-red-700';
                            letterClass = 'bg-red-500 text-white';
                          } else {
                            buttonClass = 'border-2 border-slate-100 opacity-50';
                          }
                        }

                        const letter = ['A', 'B', 'C', 'D'][index];

                        return (
                          <button
                            key={index}
                            disabled={selectedAnswer !== null}
                            onClick={() => handleAnswer(index)}
                            className={`w-full p-4 md:p-6 rounded-3xl text-left transition-all group flex items-center justify-between ${buttonClass}`}
                          >
                            <div className="flex items-center gap-4">
                              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-colors ${letterClass}`}>
                                {letter}
                              </span>
                              <span className="text-lg md:text-xl font-bold">{option}</span>
                            </div>
                            {selectedAnswer !== null && isCorrect && <span className="text-2xl">🎯</span>}
                          </button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {selectedAnswer !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-6 rounded-3xl mb-8 ${isAnswerCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          <div className="flex items-center gap-2 font-black mb-2 text-lg">
                            {isAnswerCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                            {isAnswerCorrect ? 'Правильно!' : 'Ошибка!'}
                          </div>
                          <p className="font-bold opacity-90">{currentQuestions[currentQuestionIndex].explanation}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mt-auto">
                      <button
                        disabled={selectedAnswer === null}
                        onClick={nextQuestion}
                        className={`w-full py-4 md:py-5 rounded-2xl font-black text-lg transition-all uppercase tracking-widest ${
                          selectedAnswer !== null
                            ? 'bg-indigo-600 text-white shadow-[0_6px_0_0_#4338ca] active:translate-y-[2px] active:shadow-[0_4px_0_0_#4338ca]'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {currentQuestionIndex === currentQuestions.length - 1 || lives === 0 ? 'Завершить' : 'Следующий вопрос →'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-[2.5rem] shadow-xl text-slate-800 flex-1 flex flex-col items-center justify-center p-8 space-y-8">
                  <div className="relative">
                    <Trophy className={`w-32 h-32 ${lives > 0 ? 'text-yellow-400' : 'text-slate-300'}`} />
                    {lives > 0 && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                         <Sparkles className="w-12 h-12 text-yellow-500 absolute -top-4 -right-4" />
                      </motion.div>
                    )}
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-4xl font-black leading-tight">{lives > 0 ? 'ОТЛИЧНАЯ\nРАБОТА!' : 'ИГРА\nОКОНЧЕНА'}</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                      {lives > 0 ? 'Викторина пройдена' : 'Попробуйте еще раз'}
                    </p>
                  </div>
                  
                  <div className="bg-indigo-50 w-full p-6 rounded-3xl border-2 border-indigo-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-indigo-400 uppercase tracking-widest text-sm">Очки</span>
                      <span className="text-2xl font-black text-indigo-600">
                        +{lives > 0 ? currentQuestions.length * (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30) : 0} XP
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-indigo-400 uppercase tracking-widest text-sm">Жизни</span>
                      <div className="flex gap-1">
                         {Array.from({ length: 3 }).map((_, i) => (
                           <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-current' : 'text-indigo-200'}`} />
                         ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setView('home')}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-[0_6px_0_0_#4338ca] active:translate-y-[2px] active:shadow-[0_4px_0_0_#4338ca] transition-all"
                  >
                    ДОМОЙ
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {view === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6 text-white"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-black tracking-tight uppercase">Слова дня</h2>
                <p className="text-indigo-200 font-medium">Изучайте новые слова каждый день для поддержания серии.</p>
              </div>

              <div className="space-y-4">
                {dailyWords.map((word) => (
                  <div key={word.id} className="bg-white p-6 rounded-[2rem] shadow-xl text-slate-800 flex flex-col gap-4 border-b-4 border-slate-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black text-indigo-600">{word.word}</h3>
                        <p className="font-bold text-slate-500">{word.translation}</p>
                      </div>
                      <button
                        onClick={() => toggleWordLearned(word.id)}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all ${word.learned ? 'bg-green-500 text-white shadow-[0_4px_0_0_#16a34a] active:translate-y-[2px] active:shadow-[0_2px_0_0_#16a34a]' : 'bg-slate-100 text-slate-400 shadow-[0_4px_0_0_#e2e8f0] active:translate-y-[2px] active:shadow-[0_2px_0_0_#e2e8f0]'}`}
                      >
                        <CheckCircle2 className="w-7 h-7" />
                      </button>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-2xl flex items-start gap-3">
                      <Volume2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="text-sm font-bold text-indigo-900 italic">&ldquo;{word.example}&rdquo;</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6 flex flex-col h-full"
            >
              <div className="bg-indigo-900/20 backdrop-blur-sm rounded-[2.5rem] p-6 flex-1 border border-white/10 shadow-xl mb-[80px]">
                <div className="flex flex-col items-center mb-8 mt-4">
                   <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                     <Trophy className="w-8 h-8 text-yellow-700" />
                   </div>
                   <h2 className="text-2xl font-black uppercase tracking-tight text-white">Таблица лидеров</h2>
                </div>

                <div className="space-y-3">
                  {(() => {
                    const combined = [...initialLeaderboard, { id: 'user', name: 'ВЫ', score, avatar: '😎', isUser: true }]
                      .sort((a, b) => b.score - a.score);
                    
                    return combined.map((entry, index) => {
                      const isFirst = index === 0;
                      const isSecond = index === 1;
                      const isThird = index === 2;
                      
                      let rankClass = 'text-indigo-200';
                      if (isFirst) rankClass = 'text-yellow-400';
                      if (isSecond) rankClass = 'text-slate-300';
                      if (isThird) rankClass = 'text-orange-400';

                      if (entry.isUser) {
                        return (
                          <div key={entry.id} className="bg-white rounded-2xl p-4 flex items-center justify-between ring-4 ring-indigo-400 shadow-lg">
                            <div className="flex items-center gap-3 text-slate-800">
                              <span className={`font-black w-6 text-center ${rankClass}`}>0{index + 1}</span>
                              <div className="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-lg">{entry.avatar}</div>
                              <span className="text-base font-black">{entry.name}</span>
                            </div>
                            <span className="text-xs font-black bg-indigo-600 text-white px-3 py-2 rounded-xl shadow-inner">{entry.score} XP</span>
                          </div>
                        )
                      }

                      return (
                        <div key={entry.id} className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`font-black w-6 text-center ${rankClass}`}>0{index + 1}</span>
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-lg">{entry.avatar}</div>
                            <span className="text-base font-bold text-white">{entry.name}</span>
                          </div>
                          <span className="text-xs font-black bg-indigo-500/30 text-white px-3 py-2 rounded-xl shadow-inner">{entry.score} XP</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view !== 'quiz' && (
        <nav className="bg-white fixed bottom-0 w-full max-w-md pb-safe z-50 rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)]">
          <div className="flex justify-around items-center p-4">
            <button
              onClick={() => setView('home')}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${view === 'home' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <HomeIcon className={`w-7 h-7 ${view === 'home' ? 'fill-indigo-100' : ''}`} />
            </button>
            <button
              onClick={() => setView('daily')}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${view === 'daily' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <BookOpen className={`w-7 h-7 ${view === 'daily' ? 'fill-indigo-100' : ''}`} />
            </button>
            <button
              onClick={() => setView('leaderboard')}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${view === 'leaderboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Trophy className={`w-7 h-7 ${view === 'leaderboard' ? 'fill-indigo-100' : ''}`} />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
