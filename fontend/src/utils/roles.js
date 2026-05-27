export const roleLabels = {
  director: "Giám đốc",
  manager: "Quản lý",
  employee_technical: "Nhân viên kỹ thuật",
  employee_installation: "Nhân viên lắp đặt",
  employee_maintenance: "Nhân viên bảo trì",
  customer_installation: "Khách hàng lắp đặt",
  customer_maintenance: "Khách hàng bảo trì",
};

export const roleHome = {
  director: "/director",
  manager: "/manager",
  employee_technical: "/employee",
  employee_installation: "/employee",
  employee_maintenance: "/employee",
  customer_installation: "/customer",
  customer_maintenance: "/customer",
};

export const projectStatusLabels = {
  new: "Mới tạo",
  survey: "Khảo sát",
  design: "Thiết kế",
  manufacturing: "Sản xuất",
  installing: "Lắp đặt",
  repairing: "Sửa chữa",
  maintenance: "Bảo trì",
  inspection: "Kiểm định",
  handover: "Bàn giao",
  completed: "Hoàn thành",
  paused: "Tạm dừng",
  late: "Chậm tiến độ",
};

export const projectTypeLabels = {
  installation: "Lắp đặt",
  maintenance: "Bảo trì",
  repair: "Sửa chữa",
};

export function money(value) {
  return Number(value || 0).toLocaleString("vi-VN") + " đ";
}
