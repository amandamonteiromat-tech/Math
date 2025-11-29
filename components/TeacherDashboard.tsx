import React, { useState, useEffect, useCallback } from 'react';
import { Question, QuizAttempt, GradeLevel } from '../types';
import { getQuestions, saveQuestion, deleteQuestion, getAttempts, clearAllData, BNCC_TOPICS } from '../services/storageService';
import { generateMathQuestion } from '../services/geminiService';
import { PlusIcon, SparklesIcon, TrashIcon, BarChartIcon, UserIcon } from './Icons';

interface TeacherDashboardProps {
  onExit: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'results'>('questions');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // Form State
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState(['', '', '', '']);
  const [newQCorrect, setNewQCorrect] = useState(0);
  const [newQGrade, setNewQGrade] = useState<GradeLevel>('6ano');
  const [newQCategory, setNewQCategory] = useState(''); // Holds the specific topic
  const [newQDifficulty, setNewQDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // AI State
  const [aiGrade, setAiGrade] = useState<GradeLevel>('6ano');
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  // Load data
  const refreshData = useCallback(() => {
    setQuestions(getQuestions());
    setAttempts(getAttempts());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Set default category when grade changes for manual form
  useEffect(() => {
    if (BNCC_TOPICS[newQGrade]?.length > 0) {
      setNewQCategory(BNCC_TOPICS[newQGrade][0]);
    }
  }, [newQGrade]);

  // Set default topic when grade changes for AI
  useEffect(() => {
    if (BNCC_TOPICS[aiGrade]?.length > 0) {
      setAiTopic(BNCC_TOPICS[aiGrade][0]);
    }
  }, [aiGrade]);

  const handleAddOption = (idx: number, val: string) => {
    const newOpts = [...newQOptions];
    newOpts[idx] = val;
    setNewQOptions(newOpts);
  };

  const handleSaveQuestion = () => {
    if (!newQText || newQOptions.some(o => !o)) {
      alert("Preencha todos os campos.");
      return;
    }
    const q: Question = {
      id: Date.now().toString(),
      text: newQText,
      options: newQOptions,
      correctOptionIndex: newQCorrect,
      category: newQCategory || 'Geral',
      difficulty: newQDifficulty,
      gradeLevel: newQGrade,
      createdAt: Date.now()
    };
    saveQuestion(q);
    setNewQText('');
    setNewQOptions(['', '', '', '']);
    refreshData();
    alert('Questão salva com sucesso!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta questão?')) {
      deleteQuestion(id);
      refreshData();
    }
  };

  const handleGenerateAI = async () => {
    if (!aiTopic) return;
    setLoadingAI(true);
    try {
      const q = await generateMathQuestion(aiTopic, aiDifficulty, aiGrade);
      const question: Question = { ...q, createdAt: Date.now() };
      saveQuestion(question);
      refreshData();
      alert('Questão gerada e salva com sucesso!');
    } catch (e) {
      alert("Erro ao gerar questão. Verifique a API Key.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Process Stats
  const sortedAttempts = [...attempts].sort((a, b) => b.score - a.score || b.timestamp - a.timestamp);

  const renderGradeBadge = (grade: string) => {
    const colors: Record<string, string> = {
      '6ano': 'bg-blue-100 text-blue-800',
      '7ano': 'bg-cyan-100 text-cyan-800',
      '8ano': 'bg-purple-100 text-purple-800',
      '9ano': 'bg-pink-100 text-pink-800',
    };
    const colorClass = colors[grade] || 'bg-gray-100';
    return <span className={`text-xs font-bold px-2 py-1 rounded ml-2 ${colorClass}`}>{grade.replace('ano', 'º Ano')}</span>;
  }

  const renderDifficultyBadge = (difficulty?: string) => {
    switch(difficulty) {
      case 'easy': return <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded border border-green-200">Fácil</span>;
      case 'hard': return <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-200">Difícil</span>;
      default: return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">Médio</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white min-h-[80vh] rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span>Prof. Panel</span>
        </h2>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('questions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'questions' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <PlusIcon className="w-5 h-5" />
            Gestão de Questões
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'results' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <BarChartIcon className="w-5 h-5" />
            Resultados & Rank
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-700">
           <button 
            onClick={onExit}
            className="w-full text-slate-400 hover:text-white text-sm text-left px-2"
           >
             Sair do Painel
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 p-6 md:p-10 overflow-y-auto max-h-screen">
        
        {activeTab === 'questions' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Adicionar Questões (BNCC)</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Manual Entry */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-4 text-indigo-900 flex items-center gap-2">
                  <UserIcon className="w-5 h-5" /> Manual
                </h3>
                <div className="space-y-3">
                   <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="text-xs font-semibold text-slate-500 mb-1 block">Série</label>
                       <select 
                          className="w-full p-2 border rounded text-sm bg-slate-50"
                          value={newQGrade}
                          onChange={(e) => setNewQGrade(e.target.value as GradeLevel)}
                        >
                          <option value="6ano">6º Ano</option>
                          <option value="7ano">7º Ano</option>
                          <option value="8ano">8º Ano</option>
                          <option value="9ano">9º Ano</option>
                        </select>
                     </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 mb-1 block">Dificuldade</label>
                        <select 
                          className="w-full p-2 border rounded text-sm bg-slate-50"
                          value={newQDifficulty}
                          onChange={(e) => setNewQDifficulty(e.target.value as any)}
                        >
                          <option value="easy">Fácil</option>
                          <option value="medium">Médio</option>
                          <option value="hard">Difícil</option>
                        </select>
                      </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 mb-1 block">Tópico (BNCC)</label>
                    <select 
                      className="w-full p-2 border rounded text-sm bg-slate-50"
                      value={newQCategory}
                      onChange={e => setNewQCategory(e.target.value)}
                    >
                      {BNCC_TOPICS[newQGrade]?.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <input 
                    className="w-full p-2 border rounded" 
                    placeholder="Enunciado da pergunta"
                    value={newQText}
                    onChange={e => setNewQText(e.target.value)}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    {newQOptions.map((opt, idx) => (
                      <div key={idx} className="flex gap-1 items-center">
                        <input 
                          type="radio" 
                          name="correct" 
                          checked={newQCorrect === idx}
                          onChange={() => setNewQCorrect(idx)}
                          className="w-4 h-4 text-indigo-600"
                        />
                        <input 
                          className="w-full p-2 border rounded text-sm"
                          placeholder={`Opção ${idx + 1}`}
                          value={opt}
                          onChange={e => handleAddOption(idx, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleSaveQuestion}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-medium"
                  >
                    Salvar Questão
                  </button>
                </div>
              </div>

              {/* AI Generation */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 bg-gradient-to-br from-white to-purple-50">
                <h3 className="text-lg font-semibold mb-4 text-purple-900 flex items-center gap-2">
                  <SparklesIcon className="w-5 h-5" /> Gerar com IA
                </h3>
                <div className="space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-purple-700 mb-1 block">Série Alvo</label>
                      <select 
                        className="w-full p-2 border rounded bg-white text-sm"
                        value={aiGrade}
                        onChange={(e) => setAiGrade(e.target.value as GradeLevel)}
                      >
                        <option value="6ano">6º Ano</option>
                        <option value="7ano">7º Ano</option>
                        <option value="8ano">8º Ano</option>
                        <option value="9ano">9º Ano</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-purple-700 mb-1 block">Dificuldade</label>
                      <select 
                        className="w-full p-2 border rounded bg-white text-sm"
                        value={aiDifficulty}
                        onChange={(e) => setAiDifficulty(e.target.value as any)}
                      >
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-purple-700 mb-1 block">Tópico (BNCC)</label>
                    <select 
                      className="w-full p-2 border rounded bg-white text-sm"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                    >
                      {BNCC_TOPICS[aiGrade]?.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-purple-600 italic">
                    A IA criará uma questão única sobre "{aiTopic}" adequada para o {aiGrade.replace('ano', 'º ano')}.
                  </div>

                  <button 
                    onClick={handleGenerateAI}
                    disabled={loadingAI || !aiTopic}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-md transition-all"
                  >
                    {loadingAI ? 'Criando...' : 'Gerar Questão Inteligente'}
                    {!loadingAI && <SparklesIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                 <h3 className="font-semibold text-slate-700">Banco de Questões ({questions.length})</h3>
                 <button onClick={clearAllData} className="text-xs text-red-400 hover:text-red-600 underline">Resetar tudo</button>
              </div>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {questions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">Nenhuma questão cadastrada.</div>
                ) : (
                  questions.map(q => (
                    <div key={q.id} className="p-4 hover:bg-slate-50 flex justify-between items-start group">
                      <div>
                        <div className="font-medium text-slate-800 mb-1">
                          {q.text} 
                          {renderGradeBadge(q.gradeLevel)}
                        </div>
                        <div className="flex gap-2 text-xs text-slate-500">
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100">{q.category}</span>
                          {renderDifficultyBadge(q.difficulty)}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Ranking & Desempenho</h2>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                    <th className="p-4 font-semibold">Aluno</th>
                    <th className="p-4 font-semibold">Série</th>
                    <th className="p-4 font-semibold">Pontuação</th>
                    <th className="p-4 font-semibold">Data</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {sortedAttempts.length === 0 ? (
                     <tr><td colSpan={4} className="p-8 text-center text-slate-400">Nenhum teste realizado ainda.</td></tr>
                  ) : (
                    sortedAttempts.map(attempt => (
                      <tr key={attempt.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="p-4 font-medium flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                             {attempt.studentName.charAt(0).toUpperCase()}
                           </div>
                           {attempt.studentName}
                        </td>
                        <td className="p-4">
                          {renderGradeBadge(attempt.gradeLevel)}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-indigo-900">{attempt.score}</span>
                          <span className="text-slate-400 text-sm">/{attempt.totalQuestions}</span>
                        </td>
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(attempt.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;