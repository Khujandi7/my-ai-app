export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
}

export const quizQuestions: Question[] = [
  // Easy
  { id: 'e1', text: 'Как сказать "Здравствуйте" по-английски?', options: ['Goodbye', 'Hello', 'Please', 'Sorry'], correctAnswer: 1, explanation: '"Hello" - универсальное приветствие.', difficulty: 'easy' },
  { id: 'e2', text: 'Переведите слово "Cat"', options: ['Собака', 'Птица', 'Кот', 'Мышь'], correctAnswer: 2, explanation: '"Cat" переводится как кот или кошка.', difficulty: 'easy' },
  { id: 'e3', text: 'Выберите правильный глагол: "I ___ a student."', options: ['is', 'are', 'am', 'be'], correctAnswer: 2, explanation: 'С местоимением "I" используется форма глагола to be - "am".', difficulty: 'easy' },
  { id: 'e4', text: 'Что значит "Thank you"?', options: ['Извините', 'Пожалуйста', 'Спасибо', 'До свидания'], correctAnswer: 2, explanation: '"Thank you" - выражение благодарности.', difficulty: 'easy' },
  { id: 'e5', text: 'Как будет "Красное яблоко"?', options: ['Red apple', 'Blue apple', 'Green apple', 'Yellow apple'], correctAnswer: 0, explanation: 'Red - красный, apple - яблоко.', difficulty: 'easy' },
  
  // Medium
  { id: 'm1', text: 'Выберите правильное время: "He ___ to school every day."', options: ['go', 'going', 'goes', 'went'], correctAnswer: 2, explanation: 'Present Simple для третьего лица единственного числа требует окончания -s/-es.', difficulty: 'medium' },
  { id: 'm2', text: 'Что означает фразеологизм "Piece of cake"?', options: ['Кусок торта', 'Очень легко', 'Сложная задача', 'Сладкоежка'], correctAnswer: 1, explanation: 'Идиома "Piece of cake" означает что-то очень простое в выполнении.', difficulty: 'medium' },
  { id: 'm3', text: 'Найдите антоним к слову "Beautiful"', options: ['Pretty', 'Ugly', 'Nice', 'Smart'], correctAnswer: 1, explanation: '"Ugly" (уродливый) - противоположность "Beautiful" (красивый).', difficulty: 'medium' },
  { id: 'm4', text: 'Вставьте предлог: "I am interested ___ learning English."', options: ['on', 'at', 'in', 'with'], correctAnswer: 2, explanation: 'После прилагательного "interested" используется предлог "in".', difficulty: 'medium' },
  { id: 'm5', text: 'Что такое "Vocabulary"?', options: ['Грамматика', 'Словарный запас', 'Произношение', 'Чтение'], correctAnswer: 1, explanation: '"Vocabulary" переводится как словарный запас.', difficulty: 'medium' },

  // Hard
  { id: 'h1', text: 'Выберите правильный вариант: "If I ___ you, I would study harder."', options: ['am', 'was', 'were', 'will be'], correctAnswer: 2, explanation: 'В условных предложениях второго типа (Second Conditional) используется "were" для всех лиц.', difficulty: 'hard' },
  { id: 'h2', text: 'Что означает слово "Procrastination"?', options: ['Ускорение', 'Откладывание на потом', 'Эффективность', 'Концентрация'], correctAnswer: 1, explanation: 'Прокрастинация - это склонность к постоянному откладыванию дел.', difficulty: 'hard' },
  { id: 'h3', text: 'Закончите пословицу: "Don’t judge a book by its ___"', options: ['pages', 'author', 'title', 'cover'], correctAnswer: 3, explanation: '"Don’t judge a book by its cover" - Не суди книгу по обложке (не суди по внешности).', difficulty: 'hard' },
  { id: 'h4', text: 'Какое из слов является синонимом к "Enormous"?', options: ['Tiny', 'Average', 'Huge', 'Small'], correctAnswer: 2, explanation: '"Enormous" и "Huge" означают "огромный".', difficulty: 'hard' },
  { id: 'h5', text: 'Вставьте нужное слово: "She is used to ___ early."', options: ['get up', 'getting up', 'got up', 'gets up'], correctAnswer: 1, explanation: 'После конструкции "be used to" используется герундий (глагол + -ing).', difficulty: 'hard' },
];

export interface DailyWord {
  id: string;
  word: string;
  translation: string;
  example: string;
  learned: boolean;
}

export const dailyVocabulary: DailyWord[] = [
  { id: 'd1', word: 'Achieve', translation: 'Достигать', example: 'You can achieve anything if you try.', learned: false },
  { id: 'd2', word: 'Challenge', translation: 'Вызов, испытание', example: 'Learning a new language is a great challenge.', learned: false },
  { id: 'd3', word: 'Improve', translation: 'Улучшать', example: 'I want to improve my English speaking skills.', learned: false },
  { id: 'd4', word: 'Knowledge', translation: 'Знание', example: 'Knowledge is power.', learned: false },
  { id: 'd5', word: 'Confidence', translation: 'Уверенность', example: 'Speak English with confidence!', learned: false },
];

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  avatar: string;
  isUser?: boolean;
}

export const initialLeaderboard: LeaderboardEntry[] = [
  { id: 'l1', name: 'Анна С.', score: 2500, avatar: '👩' },
  { id: 'l2', name: 'Иван П.', score: 2150, avatar: '👨' },
  { id: 'l4', name: 'Елена В.', score: 1640, avatar: '👱‍♀️' },
  { id: 'l5', name: 'Дмитрий К.', score: 1200, avatar: '🧔' },
  { id: 'l6', name: 'Ольга М.', score: 950, avatar: '👩‍🦰' },
];
