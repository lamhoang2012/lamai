/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { LandingHero } from './components/LandingHero';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentPortal } from './components/StudentPortal';
import {
  MOCK_TEACHER,
  MOCK_CLASSES,
  MOCK_ASSIGNMENTS,
  MOCK_SUBMISSIONS,
} from './data/mockData';
import { Assignment, Submission } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'teacher' | 'student'>('landing');
  const [teacher, setTeacher] = useState(MOCK_TEACHER);
  const [classes, setClasses] = useState(MOCK_CLASSES);
  const [assignments, setAssignments] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(MOCK_SUBMISSIONS);
  const [studentClassCode, setStudentClassCode] = useState('TOAN9A1');
  const [preselectedSampleId, setPreselectedSampleId] = useState<string | undefined>(undefined);

  const handleLoginTeacher = (email: string) => {
    setTeacher((prev) => ({
      ...prev,
      email: email || prev.email,
    }));
    setCurrentView('teacher');
  };

  const handleEnterAsStudent = (code: string) => {
    setStudentClassCode(code || 'TOAN9A1');
    setPreselectedSampleId(undefined);
    setCurrentView('student');
  };

  const handleSelectSamplePaper = (sampleId: string) => {
    setStudentClassCode('TOAN9A1');
    setPreselectedSampleId(sampleId);
    setCurrentView('student');
  };

  const handleAddAssignment = (newAsg: Assignment) => {
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const handleUpdateSubmission = (updatedSub: Submission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedSub.id ? updatedSub : s))
    );
  };

  const handleAddSubmission = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === newSub.assignmentId
          ? { ...a, totalSubmissions: a.totalSubmissions + 1 }
          : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-sky-500 selection:text-white">
      {currentView === 'landing' && (
        <LandingHero
          onLoginTeacher={handleLoginTeacher}
          onEnterAsStudent={handleEnterAsStudent}
          onSelectSamplePaper={handleSelectSamplePaper}
        />
      )}

      {currentView === 'teacher' && (
        <TeacherDashboard
          teacher={teacher}
          classes={classes}
          assignments={assignments}
          submissions={submissions}
          onLogout={() => setCurrentView('landing')}
          onOpenStudentPortal={(code) => {
            setStudentClassCode(code);
            setPreselectedSampleId(undefined);
            setCurrentView('student');
          }}
          onAddAssignment={handleAddAssignment}
          onUpdateSubmission={handleUpdateSubmission}
          onAddSubmission={handleAddSubmission}
        />
      )}

      {currentView === 'student' && (
        <StudentPortal
          initialClassCode={studentClassCode}
          assignments={assignments}
          onBackToHome={() => setCurrentView('landing')}
          onGradingComplete={handleAddSubmission}
          preselectedSampleId={preselectedSampleId}
        />
      )}
    </div>
  );
}
