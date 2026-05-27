export const accounts = [
  {
    id: 1,
    name: "Nguyễn Văn Thiên",
    email: "sep@365.vn",
    role: "Giám đốc",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Minh Quân",
    email: "quanly@365.vn",
    role: "Quản lý",
    status: "Hoạt động",
  },
  {
    id: 3,
    name: "Lê Anh Khoa",
    email: "nhanvien@365.vn",
    role: "Nhân viên",
    status: "Hoạt động",
  },
  {
    id: 4,
    name: "Công ty ABC",
    email: "abc@gmail.com",
    role: "Khách hàng",
    status: "Hoạt động",
  },
];

export const projects = [
  {
    id: 1,
    name: "Thang máy biệt thự An Phú",
    customer: "Phạm Gia Hưng",
    address: "An Phú, TP. Thủ Đức",
    manager: "Trần Minh Quân",
    employee: "Lê Anh Khoa",
    elevatorType: "Thang máy gia đình",
    status: "Lắp đặt",
    progress: 68,
    deadline: "2026-06-18",
    contractValue: 820000000,
    expense: 315000000,
    debt: 250000000,
  },
  {
    id: 2,
    name: "Thang tải hàng Nhà máy Bình Dương",
    customer: "Công ty Nam Việt",
    address: "KCN VSIP 2, Bình Dương",
    manager: "Trần Minh Quân",
    employee: "Nguyễn Văn Hòa",
    elevatorType: "Thang tải hàng",
    status: "Sản xuất thiết bị",
    progress: 42,
    deadline: "2026-07-05",
    contractValue: 1250000000,
    expense: 480000000,
    debt: 500000000,
  },
  {
    id: 3,
    name: "Thang máy khách sạn Central",
    customer: "Khách sạn Central",
    address: "Quận 1, TP.HCM",
    manager: "Mai Quốc Bảo",
    employee: "Lê Anh Khoa",
    elevatorType: "Thang máy tải khách",
    status: "Kiểm định",
    progress: 88,
    deadline: "2026-05-30",
    contractValue: 1680000000,
    expense: 760000000,
    debt: 300000000,
  },
];

export const managerReports = [
  {
    id: 1,
    title: "Báo cáo tiến độ công trình An Phú",
    sender: "Trần Minh Quân",
    project: "Thang máy biệt thự An Phú",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    title: "Báo cáo tài chính tháng 5",
    sender: "Mai Quốc Bảo",
    project: "Thang máy khách sạn Central",
    status: "Chờ duyệt",
  },
];

export const employeeIssues = [
  {
    id: 1,
    title: "Phát sinh thay đổi vị trí cửa tầng",
    sender: "Lê Anh Khoa",
    project: "Thang máy biệt thự An Phú",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    title: "Nhà máy chậm xác nhận linh kiện",
    sender: "Nguyễn Văn Hòa",
    project: "Thang tải hàng Bình Dương",
    status: "Chờ duyệt",
  },
];

export const companyFinance = {
  openingBalance: 3200000000,

  incomes: [
    {
      id: 1,
      title: "Thanh toán đợt 1 - Thang máy biệt thự An Phú",
      project: "Thang máy biệt thự An Phú",
      amount: 350000000,
      date: "2026-05-10",
      type: "Tiền khách chuyển",
    },
    {
      id: 2,
      title: "Thanh toán hợp đồng khách sạn Central",
      project: "Thang máy khách sạn Central",
      amount: 500000000,
      date: "2026-05-15",
      type: "Tiền khách chuyển",
    },
  ],

  expenses: [
    {
      id: 1,
      title: "Đặt cọc sản xuất cabin",
      project: "Thang máy biệt thự An Phú",
      amount: 180000000,
      date: "2026-05-12",
      type: "Chi sản xuất",
    },
    {
      id: 2,
      title: "Mua ray dẫn hướng",
      project: "Thang tải hàng Nhà máy Bình Dương",
      amount: 95000000,
      date: "2026-05-18",
      type: "Chi vật tư",
    },
  ],

  extraExpenses: [
    {
      id: 1,
      title: "Phát sinh thay đổi vị trí cửa tầng",
      project: "Thang máy biệt thự An Phú",
      amount: 25000000,
      date: "2026-05-20",
      type: "Phát sinh công trình",
    },
    {
      id: 2,
      title: "Chi phí vận chuyển bổ sung",
      project: "Thang tải hàng Nhà máy Bình Dương",
      amount: 12000000,
      date: "2026-05-21",
      type: "Phát sinh vận chuyển",
    },
  ],
};
