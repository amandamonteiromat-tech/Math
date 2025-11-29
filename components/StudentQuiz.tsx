import React, { useState, useEffect } from 'react';
import { Question, QuizAttempt, StudentAnswer, GradeLevel } from '../types';
import { getQuestions, saveAttempt, BNCC_TOPICS } from '../services/storageService';
import { CheckCircleIcon, XCircleIcon, TrophyIcon } from './Icons';

interface StudentQuizProps {
  onExit: () => void;
}

const StudentQuiz: React.FC<StudentQuizProps> = ({ onExit }) => {
  const [name, setName] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | ''>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  
  const [hasStarted, setHasStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // Load questions based on grade when game starts
  const handleStart = () => {
    if (name.trim() && selectedGrade) {
      const allQuestions = getQuestions();
      let filteredQuestions = allQuestions.filter(q => q.gradeLevel === selectedGrade);
      
      if (selectedTopic !== 'all') {
        filteredQuestions = filteredQuestions.filter(q => q.category === selectedTopic);
      }

      filteredQuestions = filteredQuestions.sort(() => Math.random() - 0.5); // Shuffle
      
      setQuestions(filteredQuestions);
      setHasStarted(true);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (feedback !== null) return; // Prevent double clicking

    setSelectedOption(optionIndex);
    const currentQ = questions[currentIndex];
    const isCorrect = optionIndex === currentQ.correctOptionIndex;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    // Wait a moment before moving to next question
    setTimeout(() => {
      const answer: StudentAnswer = {
        questionId: currentQ.id,
        selectedOptionIndex: optionIndex,
        isCorrect,
        timeSpentSeconds: 0 // Simplification for this demo
      };
      
      const newAnswers = [...answers, answer];
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setFeedback(null);
      } else {
        finishQuiz(newAnswers);
      }
    }, 1500);
  };

  const finishQuiz = (finalAnswers: StudentAnswer[]) => {
    const score = finalAnswers.filter(a => a.isCorrect).length;
    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      studentName: name,
      gradeLevel: selectedGrade as GradeLevel,
      timestamp: Date.now(),
      score,
      totalQuestions: questions.length,
      answers: finalAnswers
    };
    saveAttempt(attempt);
    setIsFinished(true);
  };

  if (!hasStarted) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-indigo-100">
        <h2 className="text-3xl font-bold text-indigo-900 mb-6 text-center">Entrar no Quiz</h2>
        <div className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Qual sua série?</label>
            <div className="grid grid-cols-2 gap-3">
              {(['6ano', '7ano', '8ano', '9ano'] as GradeLevel[]).map((grade) => (
                 <button
                   key={grade}
                   onClick={() => {
                     setSelectedGrade(grade);
                     setSelectedTopic('all'); // Reset topic when grade changes
                   }}
                   className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                     selectedGrade === grade 
                       ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                       : 'border-slate-200 text-slate-500 hover:border-indigo-300'
                   }`}
                 >
                   {grade.replace('ano', 'º Ano')}
                 </button>
              ))}
            </div>
          </div>

          {selectedGrade && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-slate-700 mb-2">Tópico do Desafio</label>
              <select 
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white"
              >
                <option value="all">🌟 Misturar todos os assuntos</option>
                {BNCC_TOPICS[selectedGrade]?.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Seu Nome</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Digite seu nome completo"
            />
          </div>

          <button 
            onClick={handleStart}
            disabled={!name.trim() || !selectedGrade}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all shadow-md transform hover:-translate-y-0.5"
          >
            Começar Desafio
          </button>
          <button 
            onClick={onExit}
            className="w-full text-slate-500 text-sm hover:text-indigo-600 mt-2"
          >
            Voltar ao menu
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 text-center">
        <div className="mb-4">
           <span className="text-4xl">😔</span>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Ops! Sem questões.</h3>
        <p className="text-slate-500 mb-6">
          Não encontramos perguntas para o {selectedGrade.toString().replace('ano', 'º Ano')} 
          {selectedTopic !== 'all' ? ` no tópico "${selectedTopic}"` : ''}.
          <br/>Peça ao seu professor para adicionar!
        </p>
        <button 
          onClick={onExit}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          Voltar
        </button>
      </div>
    )
  }

  if (isFinished) {
    const score = answers.filter(a => a.isCorrect).length;
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-indigo-100 text-center">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-yellow-100 rounded-full">
            <TrophyIcon className="w-16 h-16 text-yellow-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-indigo-900 mb-2">Parabéns, {name}!</h2>
        <p className="text-slate-600 mb-2">
          Você completou o desafio do {selectedGrade.replace('ano', 'º Ano')} 
          {selectedTopic !== 'all' && ` (${selectedTopic})`}.
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8 mt-6">
          <div className="bg-indigo-50 p-4 rounded-xl">
            <div className="text-4xl font-bold text-indigo-600">{score}/{questions.length}</div>
            <div className="text-sm text-indigo-800 font-medium">Acertos</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl">
            <div className="text-4xl font-bold text-emerald-600">{percentage}%</div>
            <div className="text-sm text-emerald-800 font-medium">Aproveitamento</div>
          </div>
        </div>

        <button 
          onClick={onExit}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="flex justify-between items-end mb-4">
        <div>
           <h2 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">
             Desafio {selectedGrade.replace('ano', 'º Ano')}
           </h2>
           <p className="text-xs text-slate-400">Aluno: {name}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 bg-slate-200 rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-slate-200">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">
            Questão {currentIndex + 1} de {questions.length}
          </span>
          <div className="flex gap-2">
             <span className="text-slate-500 text-xs bg-slate-100 px-2 py-1 rounded font-medium border border-slate-200">
                {currentQ.category}
             </span>
             <span className={`text-xs font-medium px-2 py-1 rounded border capitalize ${
               currentQ.difficulty === 'hard' ? 'bg-red-50 text-red-600 border-red-100' :
               currentQ.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
               'bg-green-50 text-green-600 border-green-100'
             }`}>
               {currentQ.difficulty === 'easy' ? 'Fácil' : currentQ.difficulty === 'medium' ? 'Médio' : 'Difícil'}
             </span>
          </div>
        </div>

        <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
          {currentQ.text}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, index) => {
            let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium text-lg relative ";
            
            if (feedback) {
              if (index === currentQ.correctOptionIndex) {
                btnClass += "border-emerald-500 bg-emerald-50 text-emerald-800";
              } else if (index === selectedOption) {
                btnClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                btnClass += "border-slate-100 text-slate-400 opacity-50";
              }
            } else {
               btnClass += "border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-slate-700 hover:shadow-md";
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={feedback !== null}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {feedback === 'correct' && index === currentQ.correctOptionIndex && (
                    <CheckCircleIcon className="w-6 h-6 text-emerald-500" />
                  )}
                  {feedback === 'incorrect' && index === selectedOption && (
                    <XCircleIcon className="w-6 h-6 text-red-500" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentQuiz;