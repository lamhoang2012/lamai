import { Assignment, Classroom, Submission, TeacherUser } from '../types';

export const MOCK_TEACHER: TeacherUser = {
  id: 't-101',
  name: 'Cô Nguyễn Thị Thu Hà',
  email: 'thuha.teacher@tuonghoctap.edu.vn',
  school: 'Trường THPT Chuyên & THCS Chu Văn An',
};

export const MOCK_CLASSES: Classroom[] = [
  {
    id: 'cls-1',
    name: 'Lớp 9A1 - Toán Đại số',
    code: 'TOAN9A1',
    studentCount: 38,
    subject: 'Toán học',
    gradeLevel: 'Lớp 9',
    teacherName: 'Cô Nguyễn Thị Thu Hà',
  },
  {
    id: 'cls-2',
    name: 'Lớp 9A2 - Toán Cơ bản',
    code: 'TOAN9A2',
    studentCount: 36,
    subject: 'Toán học',
    gradeLevel: 'Lớp 9',
    teacherName: 'Cô Nguyễn Thị Thu Hà',
  },
  {
    id: 'cls-3',
    name: 'Lớp 10A3 - Hóa học',
    code: 'HOA10A3',
    studentCount: 40,
    subject: 'Hóa học',
    gradeLevel: 'Lớp 10',
    teacherName: 'Thầy Trần Văn Minh',
  },
];

// Helper to create an SVG data URL mimicking handwritten student papers
function createHandwrittenSvg(studentName: string, title: string, handwritingLines: string[]): string {
  const linesSvg = handwritingLines
    .map(
      (line, idx) =>
        `<text x="45" y="${140 + idx * 34}" font-family="'Comic Sans MS', 'Caveat', cursive, sans-serif" font-size="16" fill="#1e3a8a" letter-spacing="0.5">${line}</text>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
    <defs>
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" stroke-width="0.75"/>
      </pattern>
      <filter id="paper-texture">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
        <feDiffuseLighting in="noise" lighting-color="#fff" surfaceScale="1" result="light">
          <feDistantLight azimuth="45" elevation="60" />
        </feDiffuseLighting>
        <feBlend mode="multiply" in="SourceGraphic" in2="light" />
      </filter>
    </defs>
    <!-- Paper base -->
    <rect width="600" height="750" fill="#fdfbf7" filter="url(#paper-texture)"/>
    <rect width="600" height="750" fill="url(#grid)" opacity="0.6"/>
    <!-- Red margin line -->
    <line x1="85" y1="0" x2="85" y2="750" stroke="#f87171" stroke-width="1.5" opacity="0.8"/>
    
    <!-- Header Stamp -->
    <rect x="25" y="25" width="550" height="65" fill="#f8fafc" stroke="#94a3b8" stroke-dasharray="3 3" rx="4"/>
    <text x="40" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">Họ và tên: <tspan fill="#1e40af">${studentName}</tspan></text>
    <text x="380" y="48" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">Lớp: <tspan fill="#1e40af">9A1</tspan></text>
    <text x="40" y="74" font-family="sans-serif" font-size="13" font-weight="bold" fill="#334155">Bài làm: <tspan fill="#0f766e">${title}</tspan></text>
    <text x="380" y="74" font-family="sans-serif" font-size="12" fill="#64748b">Ngày nộp: 19/10/2026</text>

    <!-- Student Handwritten Body -->
    ${linesSvg}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_PAPERS = [
  {
    id: 'sample-1',
    studentName: 'Nguyễn Minh Khôi',
    title: 'Giải phương trình 2x² - 5x + 2 = 0',
    subject: 'Toán học',
    gradeLevel: 'Lớp 9',
    imageUrl: createHandwrittenSvg('Nguyễn Minh Khôi', 'Giải PT bậc hai', [
      'Bài làm:',
      'Phương trình đã cho: 2x² - 5x + 2 = 0',
      'Hệ số: a = 2, b = -5, c = 2',
      'Ta tính Δ = b² - 4ac = (-5)² - 4.2.2',
      '       Δ = 25 - 16 = 9 > 0',
      'Vì Δ > 0 nên PT có 2 nghiệm phân biệt:',
      'x₁ = (-b + √Δ) / a = (5 + 3) / 2 = 8 / 2 = 4',
      'x₂ = (-b - √Δ) / a = (5 - 3) / 2 = 2 / 2 = 1',
      'Vậy tập nghiệm của PT là S = { 4; 1 }',
      '--- Hết ---'
    ]),
    prompt: 'Giải phương trình bậc hai: 2x² - 5x + 2 = 0 bằng công thức nghiệm.',
    description: 'Học sinh tính đúng Delta = 9 nhưng nhầm công thức mẫu số (chia cho a thay vì 2a).',
  },
  {
    id: 'sample-2',
    studentName: 'Trần Phương Linh',
    title: 'Giải hệ phương trình { 2x + y = 7 ; x - 3y = -7 }',
    subject: 'Toán học',
    gradeLevel: 'Lớp 9',
    imageUrl: createHandwrittenSvg('Trần Phương Linh', 'Hệ PT bậc nhất hai ẩn', [
      'Giải hệ phương trình:',
      '{ 2x + y = 7 (1)',
      '{ x - 3y = -7 (2)',
      'Từ (1) => y = 7 - 2x (*)',
      'Thế y vào (2) ta được:',
      'x - 3(7 - 2x) = -7',
      '<=> x - 21 - 6x = -7   (Lỗi: -3 . -2x = +6x mà viết -6x)',
      '<=> -5x = 14',
      '<=> x = -14/5',
      'Thế vào (*) => y = 7 - 2(-14/5) = 63/5',
      'Vậy nghiệm của hệ là (-14/5; 63/5)'
    ]),
    prompt: 'Giải hệ phương trình bằng phương pháp thế: 2x + y = 7 và x - 3y = -7.',
    description: 'Học sinh sai dấu khi nhân phân phối số âm (-3 nhân với -2x phải ra +6x).',
  },
  {
    id: 'sample-3',
    studentName: 'Lê Hoàng Nam',
    title: 'Giải phương trình 2x² - 5x + 2 = 0 (Bài mẫu đạt điểm 10)',
    subject: 'Toán học',
    gradeLevel: 'Lớp 9',
    imageUrl: createHandwrittenSvg('Lê Hoàng Nam', 'Giải PT bậc hai chuẩn mực', [
      'Bài làm chi tiết:',
      'Xét phương trình: 2x² - 5x + 2 = 0',
      'Xác định hệ số: a = 2 (a ≠ 0), b = -5, c = 2',
      'Biệt thức Δ = b² - 4ac',
      '          = (-5)² - 4 . 2 . 2',
      '          = 25 - 16 = 9 > 0',
      'Do Δ > 0 nên phương trình có hai nghiệm phân biệt:',
      'x₁ = (-b + √Δ) / (2a) = (5 + √9) / (2.2) = 8 / 4 = 2',
      'x₂ = (-b - √Δ) / (2a) = (5 - √9) / (2.2) = 2 / 4 = 1/2',
      'Thử lại: 2.(2)² - 5.(2) + 2 = 8 - 10 + 2 = 0 (Thỏa mãn)',
      'Kết luận: Tập nghiệm của phương trình là S = { 2; 1/2 }'
    ]),
    prompt: 'Giải phương trình bậc hai: 2x² - 5x + 2 = 0 bằng công thức nghiệm.',
    description: 'Bài làm xuất sắc, trình bày khoa học, kiểm tra điều kiện nghiệm chuẩn chỉ.',
  },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Kiểm tra 15p: Phương trình bậc hai & Định lý Vi-ét',
    subject: 'Toán học',
    gradeLevel: 'Lớp 9',
    classCode: 'TOAN9A1',
    className: 'Lớp 9A1 - Toán Đại số',
    totalSubmissions: 28,
    averageScore: 7.8,
    createdAt: '2026-10-18',
    deadline: '2026-10-25',
    prompt: `Giải phương trình sau và biện luận nghiệm:\n2x² - 5x + 2 = 0\nÁp dụng hệ thức Vi-ét để tính tổng và tích các nghiệm x₁ + x₂ và x₁.x₂.`,
    standardSolution: `1. Xác định a=2, b=-5, c=2.
2. Biệt thức Δ = b² - 4ac = (-5)² - 4(2)(2) = 25 - 16 = 9 > 0.
3. Vì Δ > 0, phương trình có 2 nghiệm phân biệt:
   x₁ = (-b + √Δ) / (2a) = (5 + 3) / 4 = 2
   x₂ = (-b - √Δ) / (2a) = (5 - 3) / 4 = 1/2.
4. Theo hệ thức Vi-ét:
   S = x₁ + x₂ = -b/a = 5/2 = 2 + 1/2 (đúng)
   P = x₁.x₂ = c/a = 2/2 = 1 = 2 . (1/2) (đúng).
5. Kết luận tập nghiệm S = { 2; 1/2 }.`,
    rubric: `- Xác định hệ số: 1.0 điểm
- Tính biệt thức Delta = 9 > 0: 3.0 điểm
- Áp dụng công thức nghiệm tìm x1, x2: 3.0 điểm
- Áp dụng hệ thức Vi-ét kiểm tra: 2.0 điểm
- Kết luận tập nghiệm rõ ràng: 1.0 điểm`,
  },
  {
    id: 'asg-2',
    title: 'Giải hệ phương trình bậc nhất hai ẩn',
    subject: 'Toán học',
    gradeLevel: 'Lớp 9',
    classCode: 'TOAN9A1',
    className: 'Lớp 9A1 - Toán Đại số',
    totalSubmissions: 24,
    averageScore: 7.2,
    createdAt: '2026-10-15',
    deadline: '2026-10-22',
    prompt: 'Giải hệ phương trình sau bằng phương pháp thế hoặc cộng đại số: \n{ 2x + y = 7 \n{ x - 3y = -7',
    standardSolution: `Cách 1 (Phương pháp thế):
Từ (1) rút y = 7 - 2x. Thế vào (2):
x - 3(7 - 2x) = -7
<=> x - 21 + 6x = -7
<=> 7x = 14 <=> x = 2.
Thay x = 2 vào y = 7 - 2(2) = 3.
Vậy hệ có nghiệm duy nhất (x; y) = (2; 3).`,
    rubric: `- Biểu diễn một ẩn theo ẩn kia đúng: 2.5đ
- Thế vào phương trình thứ hai & nhân phân phối đúng dấu: 3.5đ
- Tìm ra x = 2: 2.0đ
- Tìm ra y = 3 và kết luận cặp nghiệm: 2.0đ`,
  },
  {
    id: 'asg-3',
    title: 'Cân bằng phản ứng Oxi hóa - Khử bằng thăng bằng e',
    subject: 'Hóa học',
    gradeLevel: 'Lớp 10',
    classCode: 'HOA10A3',
    className: 'Lớp 10A3 - Hóa học',
    totalSubmissions: 19,
    averageScore: 8.1,
    createdAt: '2026-10-12',
    deadline: '2026-10-20',
    prompt: 'Cân bằng phản ứng oxi hóa khử sau bằng phương pháp thăng bằng electron, chỉ rõ chất khử, chất oxi hóa:\nCu + HNO₃ (loãng) -> Cu(NO₃)₂ + NO↑ + H₂O',
    standardSolution: `1. Xác định số oxi hóa:
   Cu(0) -> Cu(+2) + 2e  (Quá trình oxi hóa, Cu là chất khử)
   N(+5) + 3e -> N(+2)  (Quá trình khử, HNO3 là chất oxi hóa)
2. Thăng bằng electron:
   Nhân 3 vào Cu: 3Cu -> 3Cu²⁺ + 6e
   Nhân 2 vào N: 2N⁺⁵ + 6e -> 2N⁺²
3. Điền hệ số:
   3Cu + 8HNO₃ -> 3Cu(NO₃)₂ + 2NO + 4H₂O
4. Kiểm tra nguyên tố: Cu(3), H(8), N(8), O(24) - Bằng nhau.`,
    rubric: `- Xác định đúng số oxi hóa và chất khử/chất oxh: 2.5đ
- Viết đúng 2 bán phản ứng nhường/nhận e: 3.0đ
- Tìm bội chung nhỏ nhất để thăng bằng e: 2.0đ
- Đặt hệ số và cân bằng nguyên tố H, O: 2.5đ`,
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-001',
    assignmentId: 'asg-1',
    assignmentTitle: 'Kiểm tra 15p: Phương trình bậc hai & Định lý Vi-ét',
    studentName: 'Nguyễn Minh Khôi',
    studentCode: 'HS-0901',
    submittedAt: '2026-10-19 08:35',
    imageUrl: SAMPLE_PAPERS[0].imageUrl,
    score: 7.5,
    status: 'graded',
    result: {
      studentScore: 7.5,
      maxScore: 10,
      gradeLabel: 'Khá',
      transcription: `2x² - 5x + 2 = 0\na = 2, b = -5, c = 2\nΔ = (-5)² - 4.2.2 = 25 - 16 = 9 > 0\nx₁ = (-b + √Δ) / a = (5 + 3) / 2 = 4\nx₂ = (-b - √Δ) / a = (5 - 3) / 2 = 1\nS = { 4; 1 }`,
      overallEvaluation: `Học sinh tính toán Delta rất nhanh và chính xác. Tuy nhiên mắc lỗi kinh điển ở mẫu số của công thức nghiệm (quên nhân đôi hệ số a ở mẫu).`,
      steps: [
        {
          stepNumber: 1,
          text: 'Xác định hệ số a = 2, b = -5, c = 2',
          status: 'correct',
          score: 1.0,
          maxScore: 1.0,
          feedback: 'Xác định đúng và đầy đủ dấu của hệ số b = -5.',
        },
        {
          stepNumber: 2,
          text: 'Tính biệt thức Δ = b² - 4ac = (-5)² - 4.2.2 = 9 > 0',
          status: 'correct',
          score: 3.0,
          maxScore: 3.0,
          feedback: 'Bình phương số âm (-5)² ra dương 25 chuẩn, tính Delta = 9 chính xác.',
        },
        {
          stepNumber: 3,
          text: 'Tính nghiệm x₁ = (5+3)/2 = 4, x₂ = (5-3)/2 = 1',
          status: 'error',
          score: 1.5,
          maxScore: 3.0,
          feedback: 'Mẫu số công thức nghiệm là 2a = 2(2) = 4 chứ không phải chỉ là a = 2.',
        },
        {
          stepNumber: 4,
          text: 'Kết luận tập nghiệm S = {4; 1}',
          status: 'minor_mistake',
          score: 2.0,
          maxScore: 3.0,
          feedback: 'Kết luận logic theo nghiệm sai ở bước 3, chưa đối chiếu lại bằng hệ thức Vi-ét.',
        },
      ],
      rootErrors: [
        {
          category: 'Kiến thức nền tảng: Công thức nghiệm Đại số 9',
          title: 'Nhầm mẫu số công thức nghiệm thành `a` thay vì `2a`',
          location: 'Dòng thứ 7 trong bài nộp',
          whyWrong: 'Công thức nghiệm chuẩn là x = (-b ± √Δ)/(2a). Do bạn Khôi chỉ chia cho a = 2 nên nghiệm bị gấp đôi so với thực tế.',
          howToFix: 'Khắc ghi câu thần chú: Mẫu số luôn luôn là 2a! Khi a > 1 cần đặt bút viết rõ (2 x a) trước khi rút gọn.',
          severity: 'high',
        },
      ],
      remedialDrills: [
        {
          question: 'Phương trình 3x² - 5x + 2 = 0 có hệ số a = 3. Mẫu số 2a trong công thức nghiệm bằng bao nhiêu?',
          hint: '2a = 2 nhân với hệ số đứng trước x².',
          answer: '2a = 2 . 3 = 6',
        },
        {
          question: 'Tìm nghiệm của x² - 6x + 5 = 0 bằng công thức nghiệm thu gọn hoặc Delta.',
          hint: 'Ở đây a = 1, nên 2a = 2.',
          answer: 'Δ\' = 9 - 5 = 4 => x₁ = 5, x₂ = 1',
        },
      ],
      teacherPedagogicalRemark: `Em làm bài rất mạch lạc và sáng nước. Lỗi quên nhân 2 ở mẫu số 2a là lỗi sơ ý rất hay gặp ở các bạn học sinh lớp 9. Chỉ cần chú ý cẩn thận khi gặp hệ số a khác 1 là em sẽ đạt 10 điểm tròn trịa nhé!`,
    },
  },
  {
    id: 'sub-002',
    assignmentId: 'asg-1',
    assignmentTitle: 'Kiểm tra 15p: Phương trình bậc hai & Định lý Vi-ét',
    studentName: 'Lê Hoàng Nam',
    studentCode: 'HS-0902',
    submittedAt: '2026-10-19 08:40',
    imageUrl: SAMPLE_PAPERS[2].imageUrl,
    score: 10.0,
    status: 'graded',
    result: {
      studentScore: 10.0,
      maxScore: 10,
      gradeLabel: 'Xuất sắc',
      transcription: `2x² - 5x + 2 = 0\na = 2 (a ≠ 0), b = -5, c = 2\nΔ = (-5)² - 4.2.2 = 9 > 0\nx₁ = (5 + 3)/(2.2) = 2\nx₂ = (5 - 3)/(2.2) = 1/2\nThử lại Vi-ét: S = 5/2, P = 1 (Đúng)\nS = { 2; 1/2 }`,
      overallEvaluation: `Bài làm mẫu mực, tư duy toán học sắc sảo. Học sinh có thêm bước thử lại bằng hệ thức Vi-ét cực kỳ cẩn thận.`,
      steps: [
        {
          stepNumber: 1,
          text: 'Xác định hệ số a=2, b=-5, c=2',
          status: 'correct',
          score: 1.0,
          maxScore: 1.0,
          feedback: 'Có ghi chú điều kiện a ≠ 0 rất chặt chẽ.',
        },
        {
          stepNumber: 2,
          text: 'Tính biệt thức Δ = 9 > 0',
          status: 'correct',
          score: 3.0,
          maxScore: 3.0,
          feedback: 'Tính toán chính xác.',
        },
        {
          stepNumber: 3,
          text: 'Tính x₁ = 2, x₂ = 1/2',
          status: 'correct',
          score: 3.0,
          maxScore: 3.0,
          feedback: 'Áp dụng chuẩn công thức 2a ở mẫu.',
        },
        {
          stepNumber: 4,
          text: 'Thử lại bằng Vi-ét và kết luận S = { 2; 1/2 }',
          status: 'correct',
          score: 3.0,
          maxScore: 3.0,
          feedback: 'Lập luận tròn trịa, kết luận chuẩn mực.',
        },
      ],
      rootErrors: [],
      remedialDrills: [
        {
          question: 'Bài tập nâng cao: Không giải phương trình 2x² - 5x + 2 = 0, hãy tính giá trị biểu thức A = x₁² + x₂².',
          hint: 'Biến đổi A = (x₁ + x₂)² - 2x₁x₂ và dùng Vi-ét.',
          answer: 'A = (5/2)² - 2(1) = 25/4 - 2 = 17/4',
        },
      ],
      teacherPedagogicalRemark: `Thầy/Cô rất khen ngợi tinh thần học tập và kỹ năng trình bày hoàn hảo của em Nam!`,
    },
  },
  {
    id: 'sub-003',
    assignmentId: 'asg-2',
    assignmentTitle: 'Giải hệ phương trình bậc nhất hai ẩn',
    studentName: 'Trần Phương Linh',
    studentCode: 'HS-0903',
    submittedAt: '2026-10-18 16:15',
    imageUrl: SAMPLE_PAPERS[1].imageUrl,
    score: 6.0,
    status: 'graded',
    result: {
      studentScore: 6.0,
      maxScore: 10,
      gradeLabel: 'Trung bình',
      transcription: `2x + y = 7 (1)\nx - 3y = -7 (2)\ny = 7 - 2x\nx - 3(7 - 2x) = -7\nx - 21 - 6x = -7 (Sai dấu khi nhân -3 . -2x)\n-5x = 14 => x = -14/5`,
      overallEvaluation: `Phương pháp giải phương trình thế hoàn toàn đúng hướng. Tuy nhiên bị hổng quy tắc nhân dấu của số học lớp 6-7 (-3 nhân -2x phải ra +6x).`,
      steps: [
        {
          stepNumber: 1,
          text: 'Rút y = 7 - 2x từ phương trình (1)',
          status: 'correct',
          score: 2.5,
          maxScore: 2.5,
          feedback: 'Rút ẩn đúng.',
        },
        {
          stepNumber: 2,
          text: 'Thế vào (2): x - 3(7 - 2x) = -7 <=> x - 21 - 6x = -7',
          status: 'error',
          score: 1.0,
          maxScore: 3.5,
          feedback: 'Sai dấu: (-3) * (-2x) = +6x, em viết thành -6x.',
        },
        {
          stepNumber: 3,
          text: 'Giải ra x = -14/5',
          status: 'error',
          score: 1.0,
          maxScore: 2.0,
          feedback: 'Nghiệm x bị sai do bước biến đổi dấu ở trên.',
        },
        {
          stepNumber: 4,
          text: 'Tính y = 63/5 và kết luận nghiệm',
          status: 'minor_mistake',
          score: 1.5,
          maxScore: 2.0,
          feedback: 'Tính toán theo x sai.',
        },
      ],
      rootErrors: [
        {
          category: 'Quy tắc dấu & Nhân đa thức (Kiến thức lớp 6-7)',
          title: 'Nhân hai số âm không đổi thành số dương',
          location: 'Dòng thứ 7: x - 3(7 - 2x) = -7',
          whyWrong: 'Quy tắc nhân dấu: (-) nhân (-) phải ra (+). Ở đây: (-3) * (-2x) = +6x. Học sinh nhân ra -6x nên phương trình dẫn tới -5x = 14.',
          howToFix: 'Khi có dấu trừ trước dấu ngoặc, hãy cẩn thận nhân từng số hạng: (-3) * (7) = -21; (-3) * (-2x) = +6x.',
          severity: 'high',
        },
      ],
      remedialDrills: [
        {
          question: 'Phá ngoặc và rút gọn: -4(2 - 3x)',
          hint: '(-4) * 2 = -8 và (-4) * (-3x) = +12x',
          answer: '-8 + 12x',
        },
        {
          question: 'Rút gọn biểu thức: 5 - 2(3 - 4x)',
          hint: '5 - 6 + 8x',
          answer: '-1 + 8x',
        },
      ],
      teacherPedagogicalRemark: `Linh nắm phương pháp giải hệ rất tốt! Lỗi nhân dấu là lỗi thường gặp, em chú ý cẩn thận hơn khi nhân phân phối số âm vào trong ngoặc nhé.`,
    },
  },
];
