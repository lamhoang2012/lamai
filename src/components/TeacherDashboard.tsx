import React, { useState } from 'react';
import { OwlLogo } from './OwlLogo';
import { Assignment, Classroom, Submission, TeacherUser } from '../types';
import { CameraCaptureModal } from './CameraCaptureModal';
import {
  Users,
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  ArrowRight,
  LogOut,
  Camera,
  Upload,
  BarChart3,
  ExternalLink,
  Edit3,
  Share2,
  Check,
  ChevronDown,
  FileText,
  Clock,
  Layers,
} from 'lucide-react';

interface TeacherDashboardProps {
  teacher: TeacherUser;
  classes: Classroom[];
  assignments: Assignment[];
  submissions: Submission[];
  onLogout: () => void;
  onOpenStudentPortal: (classCode: string) => void;
  onAddAssignment: (assignment: Assignment) => void;
  onUpdateSubmission: (updatedSub: Submission) => void;
  onAddSubmission: (newSub: Submission) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  teacher,
  classes,
  assignments,
  submissions,
  onLogout,
  onOpenStudentPortal,
  onAddAssignment,
  onUpdateSubmission,
  onAddSubmission,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cls-1');
  const [activeTab, setActiveTab] = useState<'wall' | 'analytics' | 'assignments' | 'grade'>('wall');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState<'all' | 'high' | 'mid' | 'low'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // New Assignment Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGeneratingWithAi, setIsGeneratingWithAi] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Toán học');
  const [newGradeLevel, setNewGradeLevel] = useState('Lớp 9');
  const [newPrompt, setNewPrompt] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newRubric, setNewRubric] = useState('');

  // Direct Teacher Grading state
  const [isTeacherCameraOpen, setIsTeacherCameraOpen] = useState(false);
  const [directGradingImage, setDirectGradingImage] = useState<string | null>(null);
  const [directStudentName, setDirectStudentName] = useState('');
  const [directStudentCode, setDirectStudentCode] = useState('');
  const [directAssignmentId, setDirectAssignmentId] = useState(assignments[0]?.id || '');
  const [isDirectGradingLoading, setIsDirectGradingLoading] = useState(false);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Filter submissions by class and search
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesScore = true;
    if (filterScore === 'high') matchesScore = sub.score >= 8.0;
    if (filterScore === 'mid') matchesScore = sub.score >= 6.5 && sub.score < 8.0;
    if (filterScore === 'low') matchesScore = sub.score < 6.5;

    return matchesSearch && matchesScore;
  });

  // Calculate statistics
  const totalSubmissionsCount = filteredSubmissions.length;
  const averageScore =
    totalSubmissionsCount > 0
      ? (
          filteredSubmissions.reduce((acc, curr) => acc + curr.score, 0) /
          totalSubmissionsCount
        ).toFixed(1)
      : '0.0';
  const needAttentionCount = filteredSubmissions.filter((s) => s.score < 6.5).length;

  // Handle AI Generate Assignment
  const handleAiGenerateAssignment = async () => {
    setIsGeneratingWithAi(true);
    try {
      const response = await fetch('/api/generate-assignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: newTitle || 'Phương trình bậc hai & hệ thức Vi-ét',
          subject: newSubject,
          gradeLevel: newGradeLevel,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setNewTitle(data.data.title || newTitle);
        setNewPrompt(data.data.prompt || '');
        setNewSolution(data.data.standardSolution || '');
        setNewRubric(data.data.rubric || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingWithAi(false);
    }
  };

  const handleSaveAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrompt.trim()) {
      alert('Vui lòng điền tiêu đề và đề bài!');
      return;
    }
    const newAsg: Assignment = {
      id: 'asg-' + Date.now(),
      title: newTitle.trim(),
      subject: newSubject,
      gradeLevel: newGradeLevel,
      prompt: newPrompt,
      standardSolution: newSolution,
      rubric: newRubric,
      classCode: selectedClass.code,
      className: selectedClass.name,
      totalSubmissions: 0,
      averageScore: 0,
      createdAt: new Date().toISOString().split('T')[0],
      deadline: '2026-10-31',
    };
    onAddAssignment(newAsg);
    setIsCreateModalOpen(false);
    // Reset form
    setNewTitle('');
    setNewPrompt('');
    setNewSolution('');
    setNewRubric('');
  };

  // Direct Teacher Grading Action
  const handleTeacherGradeNow = async () => {
    if (!directGradingImage) {
      alert('Vui lòng chụp ảnh hoặc tải ảnh bài thi lên!');
      return;
    }
    const targetAssignment =
      assignments.find((a) => a.id === directAssignmentId) || assignments[0];

    setIsDirectGradingLoading(true);
    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: directGradingImage,
          assignmentPrompt: targetAssignment.prompt,
          standardSolution: targetAssignment.standardSolution,
          subject: targetAssignment.subject,
          gradeLevel: targetAssignment.gradeLevel,
          studentName: directStudentName.trim() || 'Học sinh mới',
          rubricRules: targetAssignment.rubric,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        const newSub: Submission = {
          id: 'sub-' + Date.now(),
          assignmentId: targetAssignment.id,
          assignmentTitle: targetAssignment.title,
          studentName: directStudentName.trim() || 'Học sinh mới',
          studentCode: directStudentCode.trim() || 'HS-' + Math.floor(1000 + Math.random() * 9000),
          submittedAt: new Date().toLocaleString('vi-VN'),
          imageUrl: directGradingImage,
          score: data.data.studentScore,
          status: 'graded',
          result: data.data,
        };
        onAddSubmission(newSub);
        setSelectedSubmission(newSub);
        setDirectGradingImage(null);
        setDirectStudentName('');
        setDirectStudentCode('');
        setActiveTab('wall');
      } else {
        throw new Error(data.error || 'Lỗi chấm bài');
      }
    } catch (err: any) {
      alert('Lỗi chấm bài: ' + err.message);
    } finally {
      setIsDirectGradingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <OwlLogo size="sm" showSubtitle={false} />
            <span className="hidden md:inline text-xs font-semibold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
              Bảng Giáo Viên
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Class Switcher */}
            <div className="relative">
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Student View quick link */}
            <button
              type="button"
              onClick={() => onOpenStudentPortal(selectedClass.code)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold transition-colors"
              title="Mở link nộp bài mà học sinh nhìn thấy"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem link học sinh nộp bài</span>
            </button>

            {/* Teacher Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                TH
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">{teacher.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight truncate max-w-[150px]">
                  {teacher.school}
                </div>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        
        {/* Navigation Tabs & Primary Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('wall')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'wall'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tường chấm bài ({filteredSubmissions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Ma trận lỗi cả lớp</span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'assignments'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Quản lý Đề bài</span>
            </button>

            <button
              onClick={() => setActiveTab('grade')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                activeTab === 'grade'
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5 text-sky-600" />
              <span>Chụp bài chấm ngay</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tạo đề thi mới (AI Soạn)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Wall of Submissions */}
        {activeTab === 'wall' && (
          <div className="space-y-6">
            {/* Quick KPI stats banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Tổng bài đã nộp</span>
                  <div className="text-2xl font-black text-slate-900">{totalSubmissionsCount} bài</div>
                </div>
                <div className="p-3 bg-sky-50 text-sky-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Điểm trung bình lớp</span>
                  <div className="text-2xl font-black text-slate-900">{averageScore} / 10</div>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 font-medium">Học sinh cần lưu ý</span>
                  <div className="text-2xl font-black text-rose-600">{needAttentionCount} em</div>
                </div>
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên học sinh, mã số, hoặc bài tập..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Lọc điểm:</span>
                <select
                  value={filterScore}
                  onChange={(e) => setFilterScore(e.target.value as any)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="all">Tất cả bài</option>
                  <option value="high">Giỏi / Xuất sắc (≥ 8.0)</option>
                  <option value="mid">Khá (6.5 - 7.9)</option>
                  <option value="low">Cần cố gắng (&lt; 6.5)</option>
                </select>
              </div>
            </div>

            {/* Submission Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300 transition-all p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {sub.studentName}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {sub.studentCode} • {sub.submittedAt}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-xl text-center font-black ${
                          sub.score >= 8.5
                            ? 'bg-emerald-100 text-emerald-800'
                            : sub.score >= 6.5
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <div className="text-base leading-none">{sub.score}</div>
                        <div className="text-[9px] uppercase font-bold">/ 10đ</div>
                      </div>
                    </div>

                    {/* Assignment title */}
                    <div className="text-xs font-semibold text-slate-700 mb-2 truncate">
                      {sub.assignmentTitle}
                    </div>

                    {/* Paper thumbnail preview */}
                    <div
                      onClick={() => setSelectedSubmission(sub)}
                      className="group relative h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center cursor-pointer mb-3"
                    >
                      <img
                        src={sub.imageUrl}
                        alt="Bài làm"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-150"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                        Xem chi tiết bài chấm
                      </div>
                    </div>

                    {/* Root errors tags */}
                    {sub.result?.rootErrors && sub.result.rootErrors.length > 0 ? (
                      <div className="space-y-1 mb-3">
                        <div className="text-[10px] uppercase font-bold text-rose-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Gốc lỗi phát hiện:</span>
                        </div>
                        {sub.result.rootErrors.slice(0, 1).map((err, eIdx) => (
                          <div
                            key={eIdx}
                            className="text-xs font-medium text-rose-900 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200 truncate"
                          >
                            {err.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mb-3 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Bài làm hoàn hảo, không có lỗi</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmission(sub)}
                      className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                    >
                      <span>Xem &amp; Chấm sửa</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSubmission(sub);
                        setTimeout(() => window.print(), 300);
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
                      title="In phiếu nhận xét"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Class Error Root Analytics ("Ma trận gốc lỗi cả lớp") */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 p-6 rounded-3xl text-white shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="w-6 h-6" />
                <h3 className="text-xl font-black">
                  Bản đồ Truy gốc lỗi - Lớp {selectedClass.name}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-amber-50 max-w-2xl leading-relaxed">
                Hệ thống tổng hợp tất cả các lỗi sai từ chữ viết tay của học sinh, phân loại nguồn gốc
                sư phạm giúp thầy/cô lên giáo án ôn tập đúng trọng tâm mà không cần tự cộng tay từng bài.
              </p>
            </div>

            {/* Error distribution cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    Lỗi phổ biến nhất (42%)
                  </span>
                  <span className="text-xs font-black text-slate-800">16 / 38 học sinh</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Nhầm mẫu số công thức nghiệm (chia a thay vì 2a)
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Học sinh nhớ vế tử số (-b ± √Δ) nhưng khi chia lại quên nhân hệ số 2 vào mẫu. Khi a = 2 thì mẫu số phải là 4.
                </p>
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium">
                  💡 <strong>Gợi ý sư phạm:</strong> Đầu buổi sau cho cả lớp hô đồng thanh quy tắc "Mẫu là HAI A" và làm 3 bài tập nhẩm nhanh.
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Lỗi thứ hai (29%)
                  </span>
                  <span className="text-xs font-black text-slate-800">11 / 38 học sinh</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Sai dấu khi nhân phân phối số âm vào ngoặc
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khi nhân (-3) với (-2x), học sinh viết ra -6x thay vì +6x. Đây là lỗi hổng nền tảng số học cấp dưới.
                </p>
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-medium">
                  💡 <strong>Gợi ý sư phạm:</strong> Giao bài tập bù đắp chuyên sâu về quy tắc dấu số âm cho nhóm 11 học sinh này.
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Lỗi trình bày (18%)
                  </span>
                  <span className="text-xs font-black text-slate-800">7 / 38 học sinh</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Quên kiểm tra điều kiện nghiệm &amp; Thử lại bằng Vi-ét
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tìm ra nghiệm nhưng không kết luận tập nghiệm S hoặc quên thử lại tổng/tích.
                </p>
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-medium">
                  💡 <strong>Gợi ý sư phạm:</strong> Nhắc học sinh dành 2 phút cuối mỗi bài kiểm tra để dùng hệ thức Vi-ét nhẩm lại nghiệm.
                </div>
              </div>
            </div>

            {/* Error distribution progress bars */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <h4 className="font-bold text-slate-900 text-sm">
                Biểu đồ tỷ lệ vấp lỗi của lớp {selectedClass.name}
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Lỗi công thức nghiệm mẫu số 2a</span>
                    <span className="font-bold text-rose-600">42%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Lỗi chuyển vế đổi dấu &amp; nhân số âm</span>
                    <span className="font-bold text-amber-600">29%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '29%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Lỗi thiếu điều kiện / kết luận tập nghiệm</span>
                    <span className="font-bold text-indigo-600">18%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-slate-700">Lỗi tính nhẩm sai số học đơn giản</span>
                    <span className="font-bold text-slate-500">11%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5">
                    <div className="bg-slate-400 h-2.5 rounded-full" style={{ width: '11%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Assignments Manager */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Danh sách bài tập &amp; Đề thi</h3>
                <p className="text-xs text-slate-500">
                  Mỗi bài thi đi kèm đề bài, lời giải mẫu và barem chia điểm chuẩn từng bước
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" /> Tạo đề thi mới
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {assignments.map((asg) => (
                <div
                  key={asg.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {asg.subject} • {asg.gradeLevel}
                      </span>
                      <h4 className="font-bold text-slate-900 text-base mt-1.5">{asg.title}</h4>
                      <div className="text-xs text-slate-500 font-mono mt-0.5">
                        Mã nộp bài: <strong className="text-sky-700">{asg.classCode}</strong>
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="font-bold text-slate-800">{asg.totalSubmissions} bài nộp</span>
                      <div className="text-slate-400 text-[10px]">ĐTB: {asg.averageScore}/10</div>
                    </div>
                  </div>

                  {/* Prompt preview */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs font-mono text-slate-700 whitespace-pre-line max-h-24 overflow-y-auto">
                    {asg.prompt}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => onOpenStudentPortal(asg.classCode)}
                      className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Chia sẻ link cho học sinh</span>
                    </button>
                    <span className="text-slate-400">Tạo ngày: {asg.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Direct Teacher Camera Grading */}
        {activeTab === 'grade' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-3xl mx-auto w-full space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Chụp ảnh bài thi và Chấm ngay tại chỗ
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Thầy/cô có thể dùng webcam hoặc camera điện thoại chụp bài làm giấy của học sinh để AI chấm ngay và lưu vào sổ điểm.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chọn bài tập đối chiếu:
                </label>
                <select
                  value={directAssignmentId}
                  onChange={(e) => setDirectAssignmentId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  {assignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên học sinh được chấm:
                </label>
                <input
                  type="text"
                  value={directStudentName}
                  onChange={(e) => setDirectStudentName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Đức Anh"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Photo capture section */}
            {!directGradingImage ? (
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center bg-slate-50 space-y-4">
                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsTeacherCameraOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md transition-all"
                  >
                    <Camera className="w-4 h-4" /> Bật Camera chụp bài
                  </button>
                  <label className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer shadow-xs transition-all">
                    <Upload className="w-4 h-4 text-slate-500" /> Tải ảnh từ thư viện
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) setDirectGradingImage(ev.target.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-slate-400">
                  Hỗ trợ chụp bài làm chữ viết tay, bài giải toán, phương trình hóa học, văn tự luận...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-80 bg-slate-900 flex items-center justify-center">
                  <img
                    src={directGradingImage}
                    alt="Captured Paper"
                    className="max-h-80 w-auto object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setDirectGradingImage(null)}
                    className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-rose-600/90 text-white text-xs font-bold"
                  >
                    Chụp lại
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleTeacherGradeNow}
                  disabled={isDirectGradingLoading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 via-sky-600 to-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  {isDirectGradingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      <span>AI đang đọc &amp; chấm điểm từng bước...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Tiến hành Chấm bài ngay</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Submission Inspector (Side-by-side Graded paper) */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto">
          <div
            className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            id="printable-report"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white font-black flex items-center justify-center text-sm">
                  {selectedSubmission.score}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Phiếu chấm bài: {selectedSubmission.studentName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mã: {selectedSubmission.studentCode} • Nộp: {selectedSubmission.submittedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" /> In phiếu
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Left: Original Paper */}
                <div className="md:col-span-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Ảnh bài nộp gốc của học sinh
                  </h4>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-[460px] flex items-center justify-center">
                    <img
                      src={selectedSubmission.imageUrl}
                      alt="Paper"
                      className="w-full h-auto object-contain max-h-[460px]"
                    />
                  </div>
                </div>

                {/* Right: AI Graded Breakdown & Override */}
                <div className="md:col-span-7 space-y-5">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-800">
                        Nhận xét chung:
                      </span>
                      <span className="text-xs font-bold text-slate-700">
                        Xếp loại: {selectedSubmission.result?.gradeLabel}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedSubmission.result?.overallEvaluation}
                    </p>
                  </div>

                  {/* Root errors */}
                  {selectedSubmission.result?.rootErrors &&
                    selectedSubmission.result.rootErrors.length > 0 && (
                      <div className="bg-rose-50 rounded-2xl p-4 border border-rose-200 space-y-2">
                        <div className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Gốc rễ lỗi sai sư phạm phát hiện:</span>
                        </div>
                        {selectedSubmission.result.rootErrors.map((re, rIdx) => (
                          <div key={rIdx} className="text-xs space-y-1">
                            <div className="font-bold text-slate-900">{re.title}</div>
                            <p className="text-slate-600">{re.whyWrong}</p>
                            <p className="text-emerald-800 font-semibold">{re.howToFix}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* Steps */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Chi tiết từng bước giải:
                    </h4>
                    {selectedSubmission.result?.steps.map((st) => (
                      <div
                        key={st.stepNumber}
                        className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Bước {st.stepNumber}</span>
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                              st.status === 'correct'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            +{st.score} / {st.maxScore}đ
                          </span>
                        </div>
                        <div className="font-mono text-slate-600 bg-slate-50 p-1.5 rounded">
                          {st.text}
                        </div>
                        <p
                          className={
                            st.status === 'correct' ? 'text-emerald-700 font-medium' : 'text-rose-600 font-medium'
                          }
                        >
                          {st.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Assignment with AI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-base">Soạn đề thi &amp; Barem bằng AI</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Môn học</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  >
                    <option value="Toán học">Toán học</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Ngữ văn">Ngữ văn</option>
                    <option value="Tiếng Anh">Tiếng Anh</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={newGradeLevel}
                    onChange={(e) => setNewGradeLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  >
                    <option value="Lớp 9">Lớp 9</option>
                    <option value="Lớp 10">Lớp 10</option>
                    <option value="Lớp 11">Lớp 11</option>
                    <option value="Lớp 12">Lớp 12</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chủ đề / Tiêu đề bài tập
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ví dụ: Phương trình quy về bậc hai, Giải toán bằng lập hệ..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-sky-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleAiGenerateAssignment}
                    disabled={isGeneratingWithAi}
                    className="px-3 py-2 bg-gradient-to-r from-teal-600 to-sky-600 text-white rounded-xl font-bold flex items-center gap-1 shrink-0 hover:from-teal-700 hover:to-sky-700 transition-all shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingWithAi ? 'Đang tạo...' : 'AI Tự Soạn'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đề bài chi tiết</label>
                <textarea
                  rows={4}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Nội dung câu hỏi đề thi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-xs focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Đáp án / Lời giải mẫu
                </label>
                <textarea
                  rows={4}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="Lời giải chuẩn mực từng bước để đối chiếu..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Barem điểm (Thang 10)
                </label>
                <textarea
                  rows={3}
                  value={newRubric}
                  onChange={(e) => setNewRubric(e.target.value)}
                  placeholder="Barem chia điểm theo từng bước..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-mono text-xs focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Lưu &amp; Xuất bản cho học sinh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Teacher Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isTeacherCameraOpen}
        onClose={() => setIsTeacherCameraOpen(false)}
        onCapture={(img) => setDirectGradingImage(img)}
      />
    </div>
  );
};
