import React, { useState } from 'react';
import { ViewState } from './types';
import StudentQuiz from './components/StudentQuiz';
import TeacherDashboard from './components/TeacherDashboard';
import { TrophyIcon, UserIcon } from './components/Icons';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');

  const renderContent = () => {
    switch (view) {
      case 'STUDENT_QUIZ':
        return <StudentQuiz onExit={() => setView('HOME')} />;
      case 'TEACHER_DASHBOARD':
        return <TeacherDashboard onExit={() => setView('HOME')} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-fade-in">
             <div className="bg-white p-6 rounded-full shadow-2xl mb-4 border-4 border-indigo-100">
                <span className="text-6xl">🧮</span>
             </div>
             <div>
                <h1 className="text-5xl font-extrabold text-indigo-900 mb-4 tracking-tight">MathMaster</h1>
                <p className="text-xl text-slate-500 max-w-md mx-auto">
                  A plataforma de gamificação matemática para transformar sua sala de aula.
                </p>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl px-4 mt-8">
               <button 
                 onClick={() => setView('STUDENT_QUIZ')}
                 className="group relative bg-white border-2 border-slate-200 hover:border-indigo-500 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
               >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                   <TrophyIcon className="w-12 h-12 text-indigo-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 mb-2">Sou Aluno</h3>
                 <p className="text-slate-500">Entrar no quiz, ganhar pontos e subir no ranking.</p>
               </button>

               <button 
                 onClick={() => setView('TEACHER_DASHBOARD')}
                 className="group relative bg-white border-2 border-slate-200 hover:border-purple-500 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-left"
               >
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                   <UserIcon className="w-12 h-12 text-purple-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-800 group-hover:text-purple-600 mb-2">Sou Professor</h3>
                 <p className="text-slate-500">Criar questões, usar IA e ver relatórios de desempenho.</p>
               </button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setView('HOME')}
          >
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg font-bold">MM</div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">MathMaster</span>
          </div>
          {view !== 'HOME' && (
            <button 
              onClick={() => setView('HOME')}
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition"
            >
              Início
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-8 border-t border-slate-200">
         <div className="text-center text-slate-400 text-sm">
           &copy; {new Date().getFullYear()} MathMaster Gamified. Powered by Gemini API.
         </div>
      </footer>
    </div>
  );
};

export default App;
