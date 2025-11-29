import { Question, QuizAttempt, GradeLevel } from '../types';

const QUESTIONS_KEY = 'mathmaster_questions';
const ATTEMPTS_KEY = 'mathmaster_attempts';

export const BNCC_TOPICS: Record<GradeLevel, string[]> = {
  '6ano': [
    'Sistema de Numeração Decimal',
    'Operações com Naturais',
    'Frações e Decimais',
    'Geometria Plana e Espacial',
    'Grandezas e Medidas',
    'Probabilidade e Estatística'
  ],
  '7ano': [
    'Números Inteiros',
    'Números Racionais',
    'Equações de 1º Grau',
    'Transformações Geométricas',
    'Proporcionalidade e Regra de 3',
    'Médias e Gráficos'
  ],
  '8ano': [
    'Potenciação e Radiciação',
    'Notação Científica',
    'Polinômios e Produtos Notáveis',
    'Sistemas de Equações',
    'Geometria e Triângulos',
    'Áreas de Figuras Planas'
  ],
  '9ano': [
    'Números Reais',
    'Equações de 2º Grau',
    'Funções e Gráficos',
    'Teorema de Pitágoras',
    'Trigonometria',
    'Probabilidade e Combinatória'
  ]
};

const INITIAL_QUESTIONS: Question[] = [
  // 6º Ano
  {
    id: '6-easy',
    text: 'Qual é o resultado da multiplicação 7 x 8?',
    options: ['54', '56', '48', '64'],
    correctOptionIndex: 1,
    category: 'Operações com Naturais',
    difficulty: 'easy',
    gradeLevel: '6ano',
    createdAt: Date.now()
  },
  {
    id: '6-medium',
    text: 'Maria tinha 12 balas e deu 1/3 para seu irmão. Quantas balas ela deu?',
    options: ['3', '4', '6', '2'],
    correctOptionIndex: 1,
    category: 'Frações e Decimais',
    difficulty: 'medium',
    gradeLevel: '6ano',
    createdAt: Date.now()
  },
  {
    id: '6-hard',
    text: 'Quantas faces tem um cubo?',
    options: ['4', '8', '6', '12'],
    correctOptionIndex: 2,
    category: 'Geometria Plana e Espacial',
    difficulty: 'hard',
    gradeLevel: '6ano',
    createdAt: Date.now()
  },

  // 7º Ano
  {
    id: '7-easy',
    text: 'Qual o resultado de: -5 + 8?',
    options: ['-3', '-13', '3', '13'],
    correctOptionIndex: 2,
    category: 'Números Inteiros',
    difficulty: 'easy',
    gradeLevel: '7ano',
    createdAt: Date.now()
  },
  {
    id: '7-medium',
    text: 'Resolva a equação: 2x + 10 = 20',
    options: ['5', '10', '2', '15'],
    correctOptionIndex: 0,
    category: 'Equações de 1º Grau',
    difficulty: 'medium',
    gradeLevel: '7ano',
    createdAt: Date.now()
  },
  {
    id: '7-hard',
    text: 'Se 3 quilos de ração custam R$ 15,00, quanto custam 7 quilos?',
    options: ['R$ 30,00', 'R$ 45,00', 'R$ 35,00', 'R$ 25,00'],
    correctOptionIndex: 2,
    category: 'Proporcionalidade e Regra de 3',
    difficulty: 'hard',
    gradeLevel: '7ano',
    createdAt: Date.now()
  },

  // 8º Ano
  {
    id: '8-easy',
    text: 'Qual a soma dos ângulos internos de um triângulo?',
    options: ['180°', '360°', '90°', '270°'],
    correctOptionIndex: 0,
    category: 'Geometria e Triângulos',
    difficulty: 'easy',
    gradeLevel: '8ano',
    createdAt: Date.now()
  },
  {
    id: '8-medium',
    text: 'Simplifique a expressão algébrica: 2a + 3b + 5a - b',
    options: ['7a + 2b', '7a + 4b', '10ab', '7a - 2b'],
    correctOptionIndex: 0,
    category: 'Polinômios e Produtos Notáveis',
    difficulty: 'medium',
    gradeLevel: '8ano',
    createdAt: Date.now()
  },
  {
    id: '8-hard',
    text: 'Qual é a área de um círculo com raio de 5cm? (Considere π = 3)',
    options: ['15 cm²', '25 cm²', '75 cm²', '30 cm²'],
    correctOptionIndex: 2,
    category: 'Áreas de Figuras Planas',
    difficulty: 'hard',
    gradeLevel: '8ano',
    createdAt: Date.now()
  },

  // 9º Ano
  {
    id: '9-easy',
    text: 'Como se escreve 0,0004 em notação científica?',
    options: ['4 x 10⁻³', '4 x 10⁻⁴', '4 x 10³', '4 x 10⁴'],
    correctOptionIndex: 1,
    category: 'Números Reais',
    difficulty: 'easy',
    gradeLevel: '9ano',
    createdAt: Date.now()
  },
  {
    id: '9-medium',
    text: 'Em um triângulo retângulo, catetos medem 3 e 4. A hipotenusa mede:',
    options: ['5', '6', '7', '8'],
    correctOptionIndex: 0,
    category: 'Teorema de Pitágoras',
    difficulty: 'medium',
    gradeLevel: '9ano',
    createdAt: Date.now()
  },
  {
    id: '9-hard',
    text: 'Quantas raízes reais tem a equação x² - 4x + 4 = 0?',
    options: ['Nenhuma', 'Duas distintas', 'Uma única (real)', 'Três'],
    correctOptionIndex: 2,
    category: 'Equações de 2º Grau',
    difficulty: 'hard',
    gradeLevel: '9ano',
    createdAt: Date.now()
  }
];

export const getQuestions = (): Question[] => {
  const stored = localStorage.getItem(QUESTIONS_KEY);
  if (!stored) {
    localStorage.setItem(QUESTIONS_KEY, JSON.stringify(INITIAL_QUESTIONS));
    return INITIAL_QUESTIONS;
  }
  return JSON.parse(stored);
};

export const saveQuestion = (question: Question): void => {
  const questions = getQuestions();
  const newQuestions = [question, ...questions];
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(newQuestions));
};

export const deleteQuestion = (id: string): void => {
  const questions = getQuestions();
  const newQuestions = questions.filter(q => q.id !== id);
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(newQuestions));
};

export const getAttempts = (): QuizAttempt[] => {
  const stored = localStorage.getItem(ATTEMPTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveAttempt = (attempt: QuizAttempt): void => {
  const attempts = getAttempts();
  const newAttempts = [attempt, ...attempts];
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(newAttempts));
};

export const clearAllData = () => {
  localStorage.removeItem(QUESTIONS_KEY);
  localStorage.removeItem(ATTEMPTS_KEY);
  window.location.reload();
}