export interface GradingStep {
  stepNumber: number;
  text: string;
  status: 'correct' | 'minor_mistake' | 'error';
  score: number;
  maxScore: number;
  feedback: string;
  teacherNote?: string;
}

export interface RootError {
  category: string;
  title: string;
  location: string;
  whyWrong: string;
  howToFix: string;
  severity: 'high' | 'medium' | 'low';
}

export interface RemedialDrill {
  question: string;
  hint: string;
  answer: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface GradingResult {
  studentScore: number;
  maxScore: number;
  gradeLabel: 'Xuất sắc' | 'Giỏi' | 'Khá' | 'Trung bình' | 'Cần cố gắng';
  transcription: string;
  overallEvaluation: string;
  steps: GradingStep[];
  rootErrors: RootError[];
  remedialDrills: RemedialDrill[];
  teacherPedagogicalRemark: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentName: string;
  studentCode: string;
  submittedAt: string;
  imageUrl: string;
  score: number;
  status: 'graded' | 'pending' | 'review_needed';
  result: GradingResult;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  prompt: string;
  standardSolution: string;
  rubric: string;
  classCode: string;
  className: string;
  totalSubmissions: number;
  averageScore: number;
  createdAt: string;
  deadline?: string;
}

export interface Classroom {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  subject: string;
  gradeLevel: string;
  teacherName: string;
}

export interface TeacherUser {
  id: string;
  name: string;
  email: string;
  school: string;
  avatarUrl?: string;
}
