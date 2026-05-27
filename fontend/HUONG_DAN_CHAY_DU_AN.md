# Hướng dẫn chạy Thang Máy 365 - Phase 3

## 1. Tạo lại database sạch

Vào phpMyAdmin, mở tab SQL và chạy:

```sql
DROP DATABASE IF EXISTS thang_may_365;
CREATE DATABASE thang_may_365 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Sau đó chọn database `thang_may_365`, chạy lần lượt:

```txt
backend/database/schema.sql
backend/database/seed.sql
```

## 2. Chạy backend

```bash
cd backend
npm install
npm run dev
```

Nếu mật khẩu test bị sai, chạy:

```bash
node fixAllPasswords.js
```

## 3. Chạy frontend

Mở terminal khác ở thư mục gốc project:

```bash
npm install
npm run dev
```

## 4. Tài khoản test

Tất cả mật khẩu đều là:

```txt
123456
```

```txt
Giám đốc: sep@365.vn
Quản lý 1: quanly@365.vn
Quản lý 2: quanly2@365.vn
Nhân viên kỹ thuật: kythuat@365.vn
Nhân viên lắp đặt: lapdat@365.vn
Nhân viên bảo trì: baotri@365.vn
Khách lắp đặt: khachlapdat@gmail.com
Khách bảo trì: khachbaotri@gmail.com
Khách sửa chữa: khachsuachua@gmail.com
```

## 5. Nội dung phase 3

- Nhân viên xem chi tiết dự án được giao, không thấy dữ liệu tiền.
- Nhân viên bảo trì chỉ thấy dự án/lịch bảo trì.
- Báo cáo nhân viên có 2 dạng: nội bộ hoặc gửi khách hàng sau khi quản lý duyệt.
- Khách hàng chỉ thấy dự án của mình, thông tin phụ trách, tiến độ, báo cáo khách hàng, lịch bảo trì.
- Tất cả trang nhân viên chính có tìm kiếm.
- Giao diện dùng font Be Vietnam Pro và style card mềm hơn.
