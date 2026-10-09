import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Sparkles,
  Shuffle
} from 'lucide-react';
import { QuizQuestion, generateNewQuiz } from '../../data/quizData.ts';

export const QuizView: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => generateNewQuiz(5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizRound, setQuizRound] = useState(1);

  const currentQ = questions[currentIndex] || questions[0];

  const handleSelect = (answer: boolean) => {
    if (selectedAnswer !== null || !currentQ) return;
    setSelectedAnswer(answer);
    if (answer === currentQ.is_phishing) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      // Completed the quiz
      setIsCompleted(true);
    }
  };

  /**
   * Resets and generates a fresh dynamic quiz upon submission / retry
   */
  const handleStartFreshQuiz = () => {
    const freshQuestions = generateNewQuiz(5);
    setQuestions(freshQuestions);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsCompleted(false);
    setQuizRound((r) => r + 1);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="p-6 rounded-2xl glass-panel space-y-4 bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900 tracking-wide">
              Kavach Cyber Defense Academy: Spot-The-Phish Simulation
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              Round #{quizRound}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStartFreshQuiz}
              title="Generate fresh randomized quiz simulation"
              className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-rose-600" />
              <span>New Scenarios</span>
            </button>
            <span className="text-xs font-mono text-slate-500">
              Scenario {currentIndex + 1} of {questions.length}
            </span>
          </div>
        </div>

        {!isCompleted && currentQ ? (
          <div className="space-y-6 pt-2">
            {/* Scenario Card */}
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-rose-700 font-semibold">{currentQ.category}</span>
                <span className="text-slate-500">{currentQ.sender_or_medium}</span>
              </div>

              <p className="text-sm text-slate-800 leading-relaxed font-sans font-medium">
                {currentQ.scenario}
              </p>

              {/* Sample Target Link / Message Box */}
              <div className="p-3.5 rounded-lg bg-white border border-slate-200 text-xs font-mono text-rose-700 break-all select-all shadow-inner font-semibold">
                {currentQ.url_or_content}
              </div>
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleSelect(true)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  selectedAnswer === null
                    ? 'bg-white hover:bg-red-50 border-slate-300 hover:border-red-500 text-slate-800'
                    : selectedAnswer === true
                    ? currentQ.is_phishing
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-rose-50 border-rose-500 text-rose-800'
                    : currentQ.is_phishing
                    ? 'border-emerald-300 bg-slate-50 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>PHISHING / MALICIOUS FRAUD</span>
              </button>

              <button
                onClick={() => handleSelect(false)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  selectedAnswer === null
                    ? 'bg-white hover:bg-emerald-50 border-slate-300 hover:border-emerald-500 text-slate-800'
                    : selectedAnswer === false
                    ? !currentQ.is_phishing
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-rose-50 border-rose-500 text-rose-800'
                    : !currentQ.is_phishing
                    ? 'border-emerald-300 bg-slate-50 text-slate-400'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>GENUINE & SAFE RESOURCE</span>
              </button>
            </div>

            {/* Explanation reveal upon answering */}
            {selectedAnswer !== null && (
              <div className="p-5 rounded-xl glass-panel space-y-3 bg-white border border-slate-200 shadow-sm animate-fadeIn">
                <div className="flex items-center gap-2">
                  {selectedAnswer === currentQ.is_phishing ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-sm text-emerald-700 font-mono">
                        CORRECT DIAGNOSIS!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <span className="font-bold text-sm text-rose-700 font-mono">
                        INCORRECT - Threat Uncovered!
                      </span>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider font-semibold">
                    Key Indicators & Forensic Signals:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {currentQ.key_indicators.map((ind, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-rose-600 font-bold">•</span>
                        <span>{ind}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-95"
                  >
                    <span>
                      {currentIndex < questions.length - 1 ? 'Next Scenario' : 'Submit & View Score'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Final Quiz Score Screen with Instant "Create New Quiz" Action */
          <div className="text-center p-8 space-y-6">
            <div className="relative inline-block">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto animate-bounce" />
              <Sparkles className="w-6 h-6 text-rose-500 absolute -top-1 -right-2" />
            </div>

            <div>
              <h3 className="text-2xl font-bold font-mono text-slate-900">
                SIMULATION SUBMITTED & EVALUATED
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Your Cyber Defense Awareness & Accuracy Score
              </p>
            </div>

            <div className="text-5xl font-extrabold font-mono text-rose-600">
              {score} / {questions.length}
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {score === questions.length
                ? 'Outstanding! You have elite security vigilance and accurately spot deceptive typosquatting, UPI traps, and deceptive subdomains.'
                : 'Good practice! Phishers rely heavily on panic, urgency, and subtle visual letter replacements. Keep inspecting the true domain stem before entering passwords.'}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleStartFreshQuiz}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Create New Quiz & Start Next Round</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
