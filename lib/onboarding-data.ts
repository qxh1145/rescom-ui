export type QuestionType = 'radio' | 'dropdown' | 'checkbox';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[];
}

export interface Section {
  id: string;
  title: string;
  icon: string;
  questions: Question[];
}

export const onboardingData: Section[] = [
  {
    id: 'demographics',
    title: 'THÔNG TIN NHÂN KHẨU HỌC CƠ BẢN',
    icon: '🌱',
    questions: [
      {
        id: 'q1_age',
        type: 'radio',
        title: '1. Bạn hiện tại bao nhiêu tuổi?',
        options: [
          'Dưới 18 tuổi',
          'Từ 18 - 22 tuổi',
          'Từ 23 - 25 tuổi',
          'Trên 25 tuổi',
        ],
      },
      {
        id: 'q2_gender',
        type: 'radio',
        title: '2. Giới tính của bạn là gì?',
        options: ['Nam', 'Nữ', 'Khác'],
      },
      {
        id: 'q3_location',
        type: 'dropdown',
        title: '3. Bạn hiện đang sinh sống và làm việc/học tập tại Tỉnh/Thành phố nào?',
        options: [
          'Hà Nội',
          'TP. Hồ Chí Minh',
          'Hải Phòng',
          'Đà Nẵng',
          'Cần Thơ',
          'Thanh Hóa',
          'Nghệ An',
          'Hà Tĩnh',
          'Bình Định',
          'Lâm Đồng',
          'Bình Thuận',
          'Đắk Lắk',
          'Thừa Thiên Huế',
          'Quảng Nam',
          'Quảng Ngãi',
          'Bình Dương',
          'Đồng Nai',
          'Bà Rịa - Vũng Tàu',
          'Long An',
          'Tiền Giang',
          'Bến Tre',
          'Trà Vinh',
          'Vĩnh Long',
          'An Giang',
          'Kiên Giang',
          'Hậu Giang',
          'Sóc Trăng',
          'Bạc Liêu',
          'Cà Mau',
          'Tây Ninh',
          'Bắc Giang',
          'Lạng Sơn',
          'Thái Nguyên',
          'Lào Cai',
        ],
      },
    ],
  },
  {
    id: 'education',
    title: 'HỌC VẤN & NGHỀ NGHIỆP',
    icon: '🌿',
    questions: [
      {
        id: 'q4_career',
        type: 'radio',
        title: '4. Nghề nghiệp hiện tại của bạn là gì?',
        options: [
          'Học sinh / Sinh viên',
          'Nhân viên văn phòng (Full-time)',
          'Kinh doanh tự do / Freelancer',
          'Quản lý / Chủ doanh nghiệp',
          'Nghề nghiệp khác...',
        ],
      },
      {
        id: 'q5_industry',
        type: 'radio',
        title: '5. Bạn đang theo học / hoặc đã tốt nghiệp thuộc khối ngành nào?',
        options: [
          'Kinh tế / Quản trị / Marketing',
          'Truyền thông / Đa phương tiện / Báo chí',
          'Công nghệ Thông tin / Kỹ thuật phần mềm',
          'Ngôn ngữ / Văn hóa / Du lịch - Khách sạn',
          'Khối ngành khác...',
        ],
      },
    ],
  },
  {
    id: 'finance',
    title: 'TÀI CHÍNH & THU NHẬP CÁ NHÂN',
    icon: '🍀',
    questions: [
      {
        id: 'q6_income',
        type: 'radio',
        title: '6. Mức thu nhập/Trợ cấp trung bình hàng tháng của bạn khoảng bao nhiêu?',
        options: [
          'Dưới 3.000.000 VNĐ',
          'Từ 3.000.000 - 5.000.000 VNĐ',
          'Từ 5.000.000 - 10.000.000 VNĐ',
          'Trên 10.000.000 VNĐ',
        ],
      },
    ],
  },
  {
    id: 'interests',
    title: 'SỞ THÍCH & PHONG CÁCH SỐNG',
    icon: '🌳',
    questions: [
      {
        id: 'q7_interests',
        type: 'checkbox',
        title: '7. Những lĩnh vực nào dưới đây khiến bạn quan tâm nhất? (Có thể chọn nhiều đáp án)',
        options: [
          'Thời trang & Mua sắm',
          'Mỹ phẩm & Làm đẹp',
          'Ẩm thực & Giao hàng',
          'Công nghệ & Thiết bị số',
          'Trí tuệ nhân tạo (AI)',
          'Mạng xã hội & Giải trí số',
          'Tài chính & Ví điện tử',
          'Giáo dục & Học tập',
          'Kỹ năng & Nghề nghiệp',
          'Sức khỏe tâm lý',
          'Sức khỏe & Thể chất',
          'Du lịch & Trải nghiệm',
          'Thương hiệu & Quảng cáo',
          'Khởi nghiệp & Kinh doanh',
          'Môi trường & Lối sống bền vững',
          'Giao thông & Đô thị',
          'Dịch vụ trường học (Thư viện, CLB...)'
        ],
      },
    ],
  },
];
