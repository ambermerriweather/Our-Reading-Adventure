import type { ReadingLogEntry, User, ClassSettings } from './types';
import { ReflectionType, DeepDiveFocus } from './types';

export const GENRES = [
  'Realistic fiction',
  'Fantasy',
  'Sci fi',
  'Mystery',
  'Historical fiction',
  'Poetry',
  'Informational',
  'Biography',
  'Memoir',
  'Graphic novel',
];

export const DEEP_DIVE_FOCI = Object.values(DeepDiveFocus);

export const POINTS_CONFIG = {
  PER_LOG: 10,
  FINISH_BOOK: 50,
  DEEP_DIVE: 25,
  GOAL_ACHIEVED: 100,
};

export const TEACHER_PASSWORD = 'teach123';

export const INITIAL_CLASS_SETTINGS: ClassSettings = {
  classCode: 'READERS',
};

export const STUDENT_ROSTER: User[] = [
  { id: 's1', name: 'Alice Johnson', role: 'student', avatar: 'avatar1', password: 'password1', goalAchievedWeeks: ['2024-29'] },
  { id: 's2', name: 'Bob Williams', role: 'student', avatar: 'avatar2', password: 'password2', goalAchievedWeeks: [] },
  { id: 's3', name: 'Charlie Brown', role: 'student', avatar: 'avatar3', password: 'password3', goalAchievedWeeks: [] },
];

export const INITIAL_LOG_DATA: ReadingLogEntry[] = [
  {
    timestamp: '2024-07-21T10:00:00Z',
    studentId: 's1',
    studentName: 'Alice Johnson',
    bookTitle: 'The Giver',
    author: 'Lois Lowry',
    rating: 5,
    format: 'Print',
    genre: 'Sci fi',
    reflectionType: ReflectionType.DEEP_DIVE,
    finishedBook: true,
    teacherFeedback: 'Excellent analysis of the theme. You clearly explained the trade-offs the community made.',
    deepDiveFocus: DeepDiveFocus.THEME,
    deepDiveAnalysis: 'The theme of memory is central. The community sacrifices true emotion for stability, which makes you question the cost of a perfect society.'
  },
  {
    timestamp: '2024-07-22T11:30:00Z',
    studentId: 's2',
    studentName: 'Bob Williams',
    bookTitle: 'Percy Jackson & The Lightning Thief',
    author: 'Rick Riordan',
    rating: 4,
    format: 'Audiobook',
    genre: 'Fantasy',
    reflectionType: ReflectionType.QUICK_THOUGHT,
    finishedBook: false,
    quickThought: 'The way the author mixes Greek mythology with modern-day America is really cool. The minotaur fight was epic!',
    minutesRead: 45
  },
  {
    timestamp: '2024-07-23T09:00:00Z',
    studentId: 's1',
    studentName: 'Alice Johnson',
    bookTitle: 'Hatchet',
    author: 'Gary Paulsen',
    rating: 5,
    format: 'Print',
    genre: 'Realistic fiction',
    reflectionType: ReflectionType.QUICK_THOUGHT,
    finishedBook: false,
    quickThought: 'I can\'t believe Brian survived the plane crash. His struggle to make a fire feels so real and intense.',
    minutesRead: 30
  },
  {
    timestamp: '2024-07-23T14:00:00Z',
    studentId: 's3',
    studentName: 'Charlie Brown',
    bookTitle: 'Wonder',
    author: 'R.J. Palacio',
    rating: 5,
    format: 'eBook',
    genre: 'Realistic fiction',
    reflectionType: ReflectionType.DEEP_DIVE,
    finishedBook: true,
    teacherFeedback: 'Great point about how the different perspectives show Auggie\'s impact on others!',
    deepDiveFocus: DeepDiveFocus.CHARACTER_CHANGE,
    deepDiveAnalysis: 'Auggie starts out very shy and afraid of how people see him, but by the end, he gains confidence and learns to value his true friends. The perspectives of other characters really show his impact.'
  },
    {
    timestamp: '2024-07-24T16:00:00Z',
    studentId: 's2',
    studentName: 'Bob Williams',
    bookTitle: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    rating: 5,
    format: 'Print',
    genre: 'Fantasy',
    reflectionType: ReflectionType.QUICK_THOUGHT,
    finishedBook: false,
    quickThought: 'The adventure is getting so exciting! Meeting Gollum and the riddle game in the dark was my favorite part so far.',
    minutesRead: 60
  }
];