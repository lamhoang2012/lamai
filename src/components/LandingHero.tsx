import React, { useState } from 'react';
import { OwlLogo } from './OwlLogo';
import { ShieldCheck, Eye, EyeOff, Sparkles, BookOpen, CheckCircle2, ArrowRight, UserCheck, Smartphone } from 'lucide-react';

interface LandingHeroProps {
  onLoginTeacher: (email: string) => void;
  onEnterAsStudent: (classCode: string) => void;
  onSelectSamplePaper: (sampleId: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onLoginTeacher,
  onEnterAsStudent,
  onSelectSamplePaper,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('thuha.teacher@tuonghoctap.edu.vn');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [studentCodeInput, setStudentCodeInput] = useState('TOAN9A1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginTeacher(email);
  };

  const handleQuickDemoTeacher = () => {
    onLoginTeacher('thuha.teacher@tuonghoctap.edu.vn');
  };

  const handleStudentJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentCodeInput.trim()) {
      onEnterAsStudent(studentCodeInput.trim().toUpperCase());
    }
  };

  return (
    <div className="relative min-h-screen bg-doodle-pattern flex flex-col justify-between overflow-x-hidden">
      {/* Subtle top subtle floating elements */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8 pb-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Brand & Hero messaging */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block">
              <OwlLogo size="lg" showSubtitle={true} />
            </div>

            <div className="space-y-4">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-500">
                MỖI Ý TƯỞNG ĐỀU CÓ MỘT CHỖ
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                Chụp bài, nộp bài,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">
                  AI chấm ngay.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Giáo viên chụp bài làm hoặc học sinh nộp bằng điện thoại. AI đọc cả chữ viết tay,
                cho điểm từng bước, <strong className="text-slate-800 font-semibold">chỉ đúng chỗ sai</strong>,
                truy tận gốc rễ lỗ hổng kiến thức và gợi ý bài luyện tập khắc phục tức thì.
              </p>
            </div>

            {/* Feature badges */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
                <div className="p-1.5 rounded-lg bg-sky-100 text-sky-700">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Đọc chữ viết tay AI</h4>
                  <p className="text-[11px] text-slate-500">Nhận diện công thức & lời giải</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Barem điểm từng bước</h4>
                  <p className="text-[11px] text-slate-500">Chấm chi tiết thang điểm 10</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Truy gốc lỗi sai</h4>
                  <p className="text-[11px] text-slate-500">Chỉ ra nguyên nhân hổng cốt lõi</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs backdrop-blur-xs">
                <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Học sinh không cần nick</h4>
                  <p className="text-[11px] text-slate-500">Vào lớp qua mã hoặc liên kết</p>
                </div>
              </div>
            </div>

            {/* Quick Experience Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
              <span className="font-semibold text-slate-700">Trải nghiệm bài mẫu ngay:</span>
              <button
                type="button"
                onClick={() => onSelectSamplePaper('sample-1')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-sky-800 font-medium shadow-xs hover:border-sky-300 transition-all flex items-center gap-1.5"
              >
                <span>Toán 9 (Lỗi mẫu số 2a)</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
              </button>
              <button
                type="button"
                onClick={() => onSelectSamplePaper('sample-2')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-sky-800 font-medium shadow-xs hover:border-sky-300 transition-all flex items-center gap-1.5"
              >
                <span>Hệ PT (Lỗi dấu âm)</span>
                <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
              </button>
            </div>
          </div>

          {/* Right Column: Exact Auth & Entry Box matching Screenshot */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/90 p-6 sm:p-8 relative transition-all">
              
              {/* Tab Selector [Đăng nhập] | [Đăng ký] */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className={`py-2 text-sm font-semibold rounded-lg transition-all ${
                    activeTab === 'register'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              {/* Notice text */}
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Dành cho giáo viên. Học sinh vào lớp bằng{' '}
                <strong className="text-slate-700 font-semibold">đường link thầy cô gửi</strong>, không cần tài khoản.
              </p>

              {/* Login / Register Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Họ và tên giáo viên
                    </label>
                    <input
                      type="text"
                      placeholder="Thầy/Cô Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email đã đăng ký"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mật khẩu của bạn"
                      className="w-full px-3.5 py-2.5 pr-14 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-900"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" /> Ẩn
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" /> Hiện
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!')}
                    className="text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>

                {/* Primary Teal/Blue Button */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-600 via-sky-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 shadow-md shadow-sky-600/20 active:scale-[0.99] transition-all cursor-pointer text-sm"
                >
                  {activeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản Giáo viên'}
                </button>
              </form>

              {/* Quick demo teacher shortcut */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleQuickDemoTeacher}
                  className="w-full py-2 px-3 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <UserCheck className="w-4 h-4 text-sky-600" />
                  <span>Dùng thử nhanh tài khoản Giáo viên (Cô Thu Hà)</span>
                </button>

                {/* Direct Student Entry Section */}
                <form onSubmit={handleStudentJoin} className="mt-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <span>Dành cho học sinh nộp bài:</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                      Không cần đăng ký
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={studentCodeInput}
                      onChange={(e) => setStudentCodeInput(e.target.value.toUpperCase())}
                      placeholder="Nhập mã lớp (VD: TOAN9A1)"
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg uppercase font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Vào lớp</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Privacy badge */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p className="leading-tight">
                  Dữ liệu lưu an toàn trên máy chủ Tường học tập AI. Mỗi giáo viên chỉ thấy bảng và
                  bài của mình; học sinh chỉ thấy bài của em.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer bar exactly matching screenshot footer */}
      <footer className="w-full bg-[#112239] text-slate-300 py-3.5 px-4 text-center text-xs border-t border-slate-800">
        <p className="tracking-wide">
          Bản quyền tuonghoctapAI@2026 • Nền tảng Chấm bài Thông minh &amp; Truy gốc lỗi Sư phạm
        </p>
      </footer>
    </div>
  );
};
