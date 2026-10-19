import React, { useState } from 'react';
import { Assignment, GradingResult } from '../types';
import { SAMPLE_PAPERS } from '../data/mockData';
import { CameraCaptureModal } from './CameraCaptureModal';
import confetti from 'canvas-confetti';
import {
  Camera,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Award,
  Sparkles,
  BookOpen,
  Send,
  Printer,
  RotateCcw,
  ZoomIn,
  Check,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';

interface StudentPortalProps {
  initialClassCode: string;
  assignments: Assignment[];
  onBackToHome: () => void;
  onGradingComplete?: (submissionData: any) => void;
  preselectedSampleId?: string;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  initialClassCode,
  assignments,
  onBackToHome,
  onGradingComplete,
  preselectedSampleId,
}) => {
  const [classCode, setClassCode] = useState(initialClassCode || 'TOAN9A1');
  const [studentName, setStudentName] = useState('Nguyễn Minh Khôi');
  const [studentCode, setStudentCode] = useState('HS-0901');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignments[0]?.id || 'asg-1'
  );
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingStage, setGradingStage] = useState<string>('');
  const [result, setResult] = useState<GradingResult | null>(null);
  const [showOriginalPaperZoom, setShowOriginalPaperZoom] = useState(false);
  const [drillAnswers, setDrillAnswers] = useState<{ [index: number]: string }>({});
  const [drillFeedback, setDrillFeedback] = useState<{ [index: number]: boolean }>({});
  const [showDrillHints, setShowDrillHints] = useState<{ [index: number]: boolean }>({});

  const currentAssignment =
    assignments.find((a) => a.id === selectedAssignmentId) || assignments[0];

  // Auto-load preselected sample paper if provided
  React.useEffect(() => {
    if (preselectedSampleId) {
      const sample = SAMPLE_PAPERS.find((s) => s.id === preselectedSampleId);
      if (sample) {
        setStudentName(sample.studentName);
        setPreviewImage(sample.imageUrl);
      }
    }
  }, [preselectedSampleId]);

  const handleSelectSample = (sample: (typeof SAMPLE_PAPERS)[0]) => {
    setStudentName(sample.studentName);
    setPreviewImage(sample.imageUrl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setPreviewImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmitAndGrade = async () => {
    if (!previewImage) {
      alert('Vui lòng chụp ảnh bài làm hoặc tải ảnh lên trước khi nộp bài!');
      return;
    }
    if (!studentName.trim()) {
      alert('Vui lòng nhập Họ và tên của em!');
      return;
    }

    setIsGrading(true);
    setResult(null);

    // Multi-stage simulated status
    setGradingStage('Đang đọc ảnh & nhận dạng chữ viết tay (OCR AI)...');
    await new Promise((r) => setTimeout(r, 600));

    setGradingStage('Đang phân tích cấu trúc từng bước giải toán...');
    await new Promise((r) => setTimeout(r, 600));

    setGradingStage('Đang đối chiếu barem điểm & TRUY GỐC LỖI SAI...');

    try {
      const response = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: previewImage,
          assignmentPrompt: currentAssignment?.prompt,
          standardSolution: currentAssignment?.standardSolution,
          subject: currentAssignment?.subject,
          gradeLevel: currentAssignment?.gradeLevel,
          studentName: studentName.trim(),
          rubricRules: currentAssignment?.rubric,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setResult(data.data);
        if (data.data.studentScore >= 8) {
          setTimeout(triggerConfetti, 400);
        }
        if (onGradingComplete) {
          onGradingComplete({
            id: 'sub-' + Date.now(),
            assignmentId: currentAssignment.id,
            assignmentTitle: currentAssignment.title,
            studentName: studentName.trim(),
            studentCode: studentCode.trim() || 'HS-VN',
            submittedAt: new Date().toLocaleString('vi-VN'),
            imageUrl: previewImage,
            score: data.data.studentScore,
            status: 'graded',
            result: data.data,
          });
        }
      } else {
        throw new Error(data.error || 'Không nhận được kết quả chấm.');
      }
    } catch (err: any) {
      console.error('Grading error:', err);
      alert('Đã có lỗi xảy ra khi chấm bài: ' + err.message);
    } finally {
      setIsGrading(false);
    }
  };

  const handleCheckDrill = (index: number) => {
    setDrillFeedback((prev) => ({ ...prev, [index]: true }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
            <div className="h-5 w-px bg-slate-200 mx-1" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mã phòng:</span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 font-mono font-bold text-xs border border-sky-200">
                {classCode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">Học sinh:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
              {studentName || 'Chưa nhập tên'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {!result ? (
          /* Submission Screen */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Assignment Details & Student Info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>Bài tập được giao</span>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Chọn bài tập nộp:
                  </label>
                  <select
                    value={selectedAssignmentId}
                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {assignments.map((asg) => (
                      <option key={asg.id} value={asg.id}>
                        {asg.title} ({asg.subject})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">
                    {currentAssignment.title}
                  </h3>
                  <div className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-mono bg-white p-3 rounded-lg border border-slate-200/60">
                    {currentAssignment.prompt}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và tên của em <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Minh Khôi"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mã số học sinh (hoặc số báo danh)
                    </label>
                    <input
                      type="text"
                      value={studentCode}
                      onChange={(e) => setStudentCode(e.target.value)}
                      placeholder="Ví dụ: HS-0901"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sample Papers Shortcut */}
              <div className="bg-gradient-to-br from-sky-50 to-indigo-50/50 rounded-2xl p-5 border border-sky-100">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  <span>Chưa có bài sẵn? Thử ngay bài mẫu:</span>
                </div>
                <p className="text-xs text-slate-600 mb-3">
                  Chọn 1 bài viết tay mẫu để trải nghiệm công nghệ AI đọc chữ và truy gốc lỗi tức thì:
                </p>
                <div className="space-y-2">
                  {SAMPLE_PAPERS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSample(sample)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        previewImage === sample.imageUrl
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-white hover:bg-white/80 text-slate-700 border-slate-200 hover:border-sky-300'
                      }`}
                    >
                      <div>
                        <div className="font-bold">{sample.studentName}</div>
                        <div
                          className={`text-[11px] truncate max-w-xs ${
                            previewImage === sample.imageUrl ? 'text-sky-100' : 'text-slate-500'
                          }`}
                        >
                          {sample.description}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Camera / File Upload & Submission */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-1">Chụp hoặc Tải ảnh bài làm</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Chụp rõ nét trang giấy viết tay của em, đảm bảo đủ ánh sáng để AI đọc chính xác nhất.
                </p>

                {/* Upload or Viewfinder Box */}
                {!previewImage ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-sky-400 rounded-2xl p-8 text-center transition-colors bg-slate-50/50">
                    <div className="max-w-sm mx-auto space-y-4">
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsCameraOpen(true)}
                          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-md shadow-sky-600/20 active:scale-95 transition-all"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Chụp bằng Camera</span>
                        </button>

                        <label className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm cursor-pointer shadow-xs active:scale-95 transition-all">
                          <Upload className="w-4 h-4 text-slate-500" />
                          <span>Tải ảnh từ máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <p className="text-xs text-slate-400">
                        Hỗ trợ ảnh định dạng JPG, PNG, WEBP (chụp vở bài tập, giấy nháp, đề thi)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 flex items-center justify-center max-h-[460px]">
                      <img
                        src={previewImage}
                        alt="Bài làm học sinh"
                        className="w-full h-auto max-h-[460px] object-contain"
                      />
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowOriginalPaperZoom(true)}
                          className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-lg backdrop-blur-xs transition-colors"
                          title="Phóng to xem rõ nét"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewImage(null)}
                          className="p-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg backdrop-blur-xs transition-colors text-xs font-semibold flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Chụp lại
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                      <span>✓ Đã nhận dạng ảnh bài thi</span>
                      <button
                        type="button"
                        onClick={() => setIsCameraOpen(true)}
                        className="text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Chụp lại bằng camera
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleSubmitAndGrade}
                    disabled={!previewImage || isGrading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 via-sky-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 shadow-lg shadow-sky-600/25 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base"
                  >
                    {isGrading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        <span>{gradingStage || 'AI đang chấm bài...'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Nộp bài &amp; AI Chấm ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Graded Result View */
          <div className="space-y-8" id="printable-report">
            {/* Top Score Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div
                  className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center font-black text-white shadow-lg ${
                    result.studentScore >= 8.5
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-700 shadow-emerald-500/30'
                      : result.studentScore >= 6.5
                      ? 'bg-gradient-to-br from-sky-500 to-blue-700 shadow-blue-500/30'
                      : 'bg-gradient-to-br from-amber-500 to-rose-600 shadow-amber-500/30'
                  }`}
                >
                  <span className="text-3xl tracking-tight">{result.studentScore}</span>
                  <span className="text-[11px] font-semibold uppercase opacity-90">
                    / {result.maxScore} điểm
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        result.studentScore >= 8.5
                          ? 'bg-emerald-100 text-emerald-800'
                          : result.studentScore >= 6.5
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Xếp loại: {result.gradeLabel}
                    </span>
                    <span className="text-xs text-slate-400">• Đã chấm tự động</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Kết quả bài làm của {studentName}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bài thi: {currentAssignment.title} • Thời gian:{' '}
                    {new Date().toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 no-print">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>In phiếu điểm</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Nộp bài khác</span>
                </button>
              </div>
            </div>

            {/* Teacher's Pedagogical Encouragement Box */}
            <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200/80 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  🦉
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1">
                    Nhận xét sư phạm từ Giáo viên AI:
                  </h4>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    "{result.teacherPedagogicalRemark || result.overallEvaluation}"
                  </p>
                </div>
              </div>
            </div>

            {/* ROOT ERROR TRACER SECTION - "TRUY GỐC LỖI" */}
            {result.rootErrors && result.rootErrors.length > 0 ? (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-200 shadow-md relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600" />
                
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                      <span>TRUY GỐC LỖI SAI</span>
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        Tính năng độc quyền
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hệ thống tự động phát hiện lỗ hổng kiến thức căn bản đã khiến em giải sai bài này
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {result.rootErrors.map((err, idx) => (
                    <div
                      key={idx}
                      className="bg-rose-50/60 rounded-2xl p-5 border border-rose-200/80 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-200/70 px-2 py-0.5 rounded">
                            {err.category}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {err.title}
                          </h4>
                          <span className="text-xs text-slate-500">
                            Vị trí phát hiện: <strong className="text-slate-700">{err.location}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                        <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-2xs">
                          <span className="font-bold text-rose-700 block mb-1">
                            ⚠️ Vì sao chỗ này sai?
                          </span>
                          <p className="text-slate-700 leading-relaxed">{err.whyWrong}</p>
                        </div>

                        <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-2xs">
                          <span className="font-bold text-emerald-700 block mb-1">
                            💡 Cách khắc phục &amp; Sửa đúng:
                          </span>
                          <p className="text-slate-700 leading-relaxed font-medium">
                            {err.howToFix}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Chúc mừng em! Không phát hiện lỗi sai kiến thức gốc rễ nào!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Bài làm chuẩn xác, phương pháp và tính toán hoàn hảo. Em hãy tiếp tục giữ vững phong độ này nhé!
                  </p>
                </div>
              </div>
            )}

            {/* Step-by-Step Breakdown vs Original Paper */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Steps breakdown */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>Barem điểm chi tiết từng bước</span>
                    <span className="text-xs font-normal text-slate-500">
                      ({result.steps.length} bước giải)
                    </span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {result.steps.map((st) => (
                    <div
                      key={st.stepNumber}
                      className={`p-4 rounded-2xl border transition-all ${
                        st.status === 'correct'
                          ? 'bg-white border-emerald-200/90 shadow-2xs'
                          : st.status === 'minor_mistake'
                          ? 'bg-white border-amber-200/90 shadow-2xs'
                          : 'bg-white border-rose-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                              st.status === 'correct'
                                ? 'bg-emerald-600'
                                : st.status === 'minor_mistake'
                                ? 'bg-amber-500'
                                : 'bg-rose-600'
                            }`}
                          >
                            {st.stepNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            Bước {st.stepNumber}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              st.status === 'correct'
                                ? 'bg-emerald-50 text-emerald-700'
                                : st.status === 'minor_mistake'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            +{st.score} / {st.maxScore}đ
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-800 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 mb-2">
                        {st.text}
                      </div>

                      <p
                        className={`text-xs font-medium ${
                          st.status === 'correct'
                            ? 'text-emerald-700'
                            : st.status === 'minor_mistake'
                            ? 'text-amber-800'
                            : 'text-rose-700'
                        }`}
                      >
                        {st.status === 'correct' ? '✓ ' : '✕ '}
                        {st.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Original Paper Photo Thumbnail */}
              <div className="lg:col-span-5 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center justify-between">
                  <span>Ảnh bài nộp gốc</span>
                  <button
                    onClick={() => setShowOriginalPaperZoom(true)}
                    className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1 font-semibold"
                  >
                    <ZoomIn className="w-3.5 h-3.5" /> Phóng to
                  </button>
                </h3>

                <div
                  onClick={() => setShowOriginalPaperZoom(true)}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs cursor-pointer bg-slate-900 max-h-[380px] flex items-center justify-center"
                >
                  <img
                    src={previewImage || ''}
                    alt="Bài thi của học sinh"
                    className="w-full h-auto object-contain max-h-[380px] group-hover:scale-[1.02] transition-transform duration-200"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1.5 transition-opacity">
                    <ZoomIn className="w-4 h-4" /> Bấm để phóng to xem rõ nét
                  </div>
                </div>

                {/* AI Transcription preview */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">
                    Chữ viết tay AI nhận diện được (OCR):
                  </span>
                  <div className="text-slate-600 whitespace-pre-line font-mono bg-slate-50 p-3 rounded-lg border border-slate-200/70 max-h-48 overflow-y-auto">
                    {result.transcription}
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE REMEDIAL DRILLS ("LUYỆN TẬP BÙ ĐẮP KIẾN THỨC") */}
            {result.remedialDrills && result.remedialDrills.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      Bài tập luyện tập khắc phục tức thì
                    </h3>
                    <p className="text-xs text-slate-500">
                      Làm ngay 2 câu hỏi sau để khắc phục triệt để lỗ hổng kiến thức vừa rồi!
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {result.remedialDrills.map((drill, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
                          Câu rèn luyện {idx + 1}:
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setShowDrillHints((prev) => ({ ...prev, [idx]: !prev[idx] }))
                          }
                          className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{showDrillHints[idx] ? 'Ẩn gợi ý' : 'Xem gợi ý'}</span>
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                        {drill.question}
                      </p>

                      {showDrillHints[idx] && (
                        <div className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span>Gợi ý: {drill.hint}</span>
                        </div>
                      )}

                      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <input
                          type="text"
                          value={drillAnswers[idx] || ''}
                          onChange={(e) =>
                            setDrillAnswers((prev) => ({ ...prev, [idx]: e.target.value }))
                          }
                          placeholder="Nhập câu trả lời hoặc đáp số của em..."
                          className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleCheckDrill(idx)}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Kiểm tra đáp án</span>
                        </button>
                      </div>

                      {drillFeedback[idx] && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Đáp án chuẩn &amp; Lời giải chi tiết:</span>
                          </div>
                          <p className="font-mono text-emerald-950 font-semibold pl-5">
                            {drill.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(img) => setPreviewImage(img)}
      />

      {/* Fullscreen Paper Zoom Modal */}
      {showOriginalPaperZoom && previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center backdrop-blur-xs cursor-pointer"
          onClick={() => setShowOriginalPaperZoom(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="Zoomed"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
            <p className="text-center text-xs text-slate-400 mt-2">Bấm bất kỳ đâu để đóng</p>
          </div>
        </div>
      )}
    </div>
  );
};
