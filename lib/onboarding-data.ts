export type QuestionType = 'radio' | 'dropdown' | 'checkbox';

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  options: string[];
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
    title: 'THÔNG TIN NHÂN KHẨU HỌC',
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
          'Đà Nẵng',
          'Hải Phòng',
          'Cần Thơ',
          'Khác' // Simplified for demo purposes
        ],
      },
      {
        id: 'q4_marital',
        type: 'radio',
        title: '4. Tình trạng hôn nhân hiện tại của bạn là gì?',
        options: [
          'Độc thân',
          'Đang trong mối quan hệ (Đang hẹn hò)',
          'Đã kết hôn',
          'Khác',
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
        id: 'q5_education',
        type: 'radio',
        title: '5. Trình độ học vấn cao nhất của bạn hiện tại là gì?',
        options: [
          'Học sinh phổ thông',
          'Sinh viên (Cao đẳng/Đại học)',
          'Cử nhân / Kỹ sư (Đã tốt nghiệp Đại học/Cao đẳng)',
          'Sau Đại học (Thạc sĩ, Tiến sĩ)',
          'Khác',
        ],
      },
      {
        id: 'q6_career',
        type: 'radio',
        title: '6. Nghề nghiệp hiện tại của bạn là gì?',
        options: [
          'Học sinh / Sinh viên',
          'Nhân viên văn phòng (Full-time)',
          'Kinh doanh tự do / Freelancer',
          'Quản lý / Chủ doanh nghiệp',
          'Nghề nghiệp khác',
        ],
      },
      {
        id: 'q7_industry',
        type: 'radio',
        title: '7. Bạn đang theo học / hoặc đã tốt nghiệp thuộc khối ngành nào?',
        options: [
          'Kinh tế / Quản trị / Marketing',
          'Truyền thông / Đa phương tiện / Báo chí',
          'Công nghệ Thông tin / Kỹ thuật phần mềm',
          'Ngôn ngữ / Văn hóa / Du lịch - Khách sạn',
          'Khối ngành khác',
        ],
      },
    ],
  },
  {
    id: 'finance',
    title: 'TÀI CHÍNH & THU NHẬP',
    icon: '🍀',
    questions: [
      {
        id: 'q8_income',
        type: 'radio',
        title: '8. Mức thu nhập/Trợ cấp trung bình hàng tháng của bạn khoảng bao nhiêu?',
        options: [
          'Dưới 3.000.000 VNĐ',
          'Từ 3.000.000 - 5.000.000 VNĐ',
          'Từ 5.000.000 - 10.000.000 VNĐ',
          'Trên 10.000.000 VNĐ',
        ],
      },
      {
        id: 'q9_source',
        type: 'radio',
        title: '9. Nguồn thu nhập/trợ cấp chính của bạn đến từ đâu?',
        options: [
          'Chu cấp từ gia đình',
          'Đi làm thêm (Part-time / Thực tập có lương)',
          'Kinh doanh tự do / Freelancer',
          'Nguồn khác',
        ],
      },
    ],
  },
  {
    id: 'shopping',
    title: 'HÀNH VI MUA SẮM ONLINE',
    icon: '🌳',
    questions: [
      {
        id: 'q10_platform',
        type: 'radio',
        title: '10. Bạn thường xuyên sử dụng nền tảng nào nhất để mua sắm online?',
        options: [
          'Shopee',
          'TikTok Shop',
          'Lazada',
          'Tiki',
          'Mạng xã hội (Facebook, Instagram)',
        ],
      },
      {
        id: 'q11_category',
        type: 'radio', // It uses radio in the md file, though checkboxes might be better. I'll stick to radio for now.
        title: '11. Ngành hàng nào bạn chi tiêu nhiều nhất khi mua sắm online?',
        options: [
          'Thời trang & Phụ kiện',
          'Mỹ phẩm & Làm đẹp',
          'Đồ công nghệ',
          'Đồ ăn uống (Food Delivery)',
        ],
      },
    ],
  },
];
