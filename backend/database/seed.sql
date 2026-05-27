USE thang_may_365;

INSERT INTO users (id, full_name, email, password, phone, address, experience_years, role, status) VALUES
(1,'Nguyễn Văn Thiên','sep@365.vn','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0901000001','Hà Nội',8,'director','active'),
(2,'Trần Minh Quân','quanly@365.vn','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0901000002','TP.HCM',6,'manager','active'),
(3,'Mai Quốc Bảo','quanly2@365.vn','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0901000003','Đà Nẵng',5,'manager','active'),
(4,'Lê Anh Khoa','kythuat@365.vn','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0901000004','TP.HCM',4,'employee_technical','active'),
(5,'Nguyễn Văn Hòa','lapdat@365.vn','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0901000005','Bình Dương',3,'employee_installation','active'),
(6,'Phạm Quốc Long','baotri@365.vn','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0901000006','TP.HCM',7,'employee_maintenance','active'),
(7,'Phạm Gia Hưng','khachlapdat@gmail.com','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0902000001','An Phú, TP. Thủ Đức',0,'customer_installation','active'),
(8,'Công ty Nam Việt','khachbaotri@gmail.com','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0902000002','KCN VSIP 2, Bình Dương',0,'customer_maintenance','active'),
(9,'Khách sạn Central','khachsuachua@gmail.com','$2b$10$WneTCXp5.kSLmZP7/dhhG.K.RLIXPmJYdeogzCBU07k/iSSy7iz3a','0902000003','Quận 1, TP.HCM',0,'customer_installation','active');

INSERT INTO projects (id,name,project_type,customer_id,manager_id,address,elevator_type,contract_code,contract_date,start_date,expected_end_date,contract_file,maintenance_total_times,maintenance_cycle_months,maintenance_done_times,status,progress,contract_value,note,created_by) VALUES
(1,'Thang máy biệt thự An Phú','installation',7,2,'An Phú, TP. Thủ Đức','Thang máy gia đình','HD-AP-001','2026-05-01','2026-05-05','2026-07-30',NULL,0,1,0,'installing',60,820000000,'Dự án lắp đặt thang máy gia đình.',1),
(2,'Bảo trì thang tải hàng Nhà máy Bình Dương','maintenance',8,2,'KCN VSIP 2, Bình Dương','Thang tải hàng','HD-BT-002','2026-04-20','2026-05-01','2026-12-31',NULL,8,1,2,'maintenance',25,240000000,'Hợp đồng bảo trì 8 lần.',1),
(3,'Sửa chữa thang máy khách sạn Central','repair',9,3,'Quận 1, TP.HCM','Thang tải khách','HD-SC-003','2026-05-12','2026-05-15','2026-06-15',NULL,0,1,0,'repairing',35,180000000,'Sửa chữa bộ điều khiển và cảm biến.',1),
(4,'Thang máy văn phòng 365 Tower','installation',7,2,'Cầu Giấy, Hà Nội','Thang tải khách','HD-365-004','2026-04-01','2026-04-10','2026-09-30',NULL,0,1,0,'completed',100,1500000000,'Đã bàn giao.',1),
(5,'Bảo trì chung cư Green Home','maintenance',8,3,'Đà Nẵng','Thang chung cư','HD-BT-005','2026-03-10','2026-04-01','2027-03-31',NULL,6,2,1,'maintenance',16,300000000,'Bảo trì 2 tháng/lần.',1),
(6,'Thang máy khách sạn Sunrise','installation',9,3,'Nha Trang','Thang tải khách','HD-SR-006','2026-05-20','2026-06-01','2026-10-20',NULL,0,1,0,'manufacturing',30,1680000000,'Đang sản xuất thiết bị.',1);

INSERT INTO project_members (project_id,user_id,role_in_project) VALUES
(1,7,'customer'),(1,2,'manager'),(1,4,'employee_technical'),(1,5,'employee_installation'),
(2,8,'customer'),(2,2,'manager'),(2,6,'employee_maintenance'),
(3,9,'customer'),(3,3,'manager'),(3,4,'employee_technical'),(3,5,'employee_installation'),
(4,7,'customer'),(4,2,'manager'),(4,4,'employee_technical'),(4,5,'employee_installation'),
(5,8,'customer'),(5,3,'manager'),(5,6,'employee_maintenance'),
(6,9,'customer'),(6,3,'manager'),(6,4,'employee_technical'),(6,5,'employee_installation');

INSERT INTO project_stages (project_id,stage_key,stage_name,stage_order,status,completed_by,completed_at) VALUES
(1,'survey','Khảo sát',1,'done',4,'2026-05-06 09:00:00'),(1,'design','Thiết kế',2,'done',4,'2026-05-12 09:00:00'),(1,'manufacturing','Sản xuất thiết bị',3,'done',2,'2026-06-01 09:00:00'),(1,'installing','Lắp đặt',4,'doing',NULL,NULL),(1,'inspection','Kiểm định',5,'pending',NULL,NULL),(1,'handover','Bàn giao',6,'pending',NULL,NULL),
(2,'maintenance','Bảo trì định kỳ',1,'doing',NULL,NULL),
(3,'repairing','Sửa chữa',1,'doing',NULL,NULL),(3,'inspection','Kiểm tra sau sửa chữa',2,'pending',NULL,NULL),(3,'handover','Bàn giao',3,'pending',NULL,NULL),
(4,'survey','Khảo sát',1,'done',4,'2026-04-12 09:00:00'),(4,'design','Thiết kế',2,'done',4,'2026-04-18 09:00:00'),(4,'manufacturing','Sản xuất thiết bị',3,'done',2,'2026-05-20 09:00:00'),(4,'installing','Lắp đặt',4,'done',5,'2026-08-15 09:00:00'),(4,'inspection','Kiểm định',5,'done',2,'2026-09-01 09:00:00'),(4,'handover','Bàn giao',6,'done',2,'2026-09-20 09:00:00'),
(5,'maintenance','Bảo trì định kỳ',1,'doing',NULL,NULL),
(6,'survey','Khảo sát',1,'done',4,'2026-06-02 09:00:00'),(6,'design','Thiết kế',2,'done',4,'2026-06-08 09:00:00'),(6,'manufacturing','Sản xuất thiết bị',3,'doing',NULL,NULL),(6,'installing','Lắp đặt',4,'pending',NULL,NULL),(6,'inspection','Kiểm định',5,'pending',NULL,NULL),(6,'handover','Bàn giao',6,'pending',NULL,NULL);

INSERT INTO tasks (title,description,project_id,stage_id,assigned_by,assigned_to,task_scope,priority,status,start_date,deadline) VALUES
('Kiểm tra bản vẽ kỹ thuật','Rà soát bản vẽ trước khi lắp đặt',1,2,2,4,'project','high','done','2026-05-06','2026-05-12'),
('Lắp đặt ray dẫn hướng','Lắp ray tầng 1-4',1,4,2,5,'project','high','doing','2026-06-05','2026-06-30'),
('Bảo trì lần 3','Chuẩn bị bảo trì định kỳ',2,NULL,2,6,'project','medium','pending','2026-07-01','2026-07-05'),
('Kiểm tra lỗi điều khiển','Test tủ điều khiển khách sạn Central',3,1,3,4,'project','high','doing','2026-05-16','2026-05-28');

INSERT INTO reports (title,content,project_id,task_id,sender_id,receiver_id,report_type,report_visibility,progress_percent,manager_status,manager_comment,status,director_comment) VALUES
('Báo cáo tuần 1 An Phú','Đã hoàn thành bản vẽ kỹ thuật và bàn giao đội lắp đặt.',1,1,4,2,'weekly','customer',25,'approved','OK, tiếp tục triển khai.','pending',NULL),
('Báo cáo lắp đặt ray','Đã lắp được 50% ray dẫn hướng, cần bổ sung vật tư.',1,2,5,2,'installation','internal',60,'pending',NULL,'pending',NULL),
('Báo cáo bảo trì lần 2','Đã kiểm tra cửa tầng và tra dầu hệ thống.',2,NULL,6,2,'maintenance','customer',NULL,'approved','Đã nhận báo cáo bảo trì.','approved','Đã duyệt.'),
('Báo cáo sửa chữa Central','Đã phát hiện lỗi cảm biến cửa.',3,4,4,3,'repair','customer',35,'pending',NULL,'pending',NULL);

INSERT INTO issues (title,description,project_id,sender_id,severity,manager_status,status) VALUES
('Thiếu ray dẫn hướng','Vật tư ray tầng 5 chưa đủ.',1,5,'high','pending','pending'),
('Khách yêu cầu đổi lịch bảo trì','Khách hàng muốn chuyển lịch sang cuối tuần.',2,6,'medium','approved','pending'),
('Cảm biến cửa hỏng','Cần thay cảm biến mới.',3,4,'critical','pending','pending');

INSERT INTO finance_transactions (project_id,type,title,amount,payment_date,note,created_by) VALUES
(1,'income','Khách thanh toán đợt 1',350000000,'2026-05-10','Tiền vào dự án An Phú',1),
(1,'expense','Đặt cọc sản xuất cabin',180000000,'2026-05-12','Chi sản xuất',1),
(1,'extra_expense','Mua thêm ray dẫn hướng',25000000,'2026-06-10','Phát sinh vật tư',1),
(2,'income','Thu phí bảo trì đợt 1',120000000,'2026-04-22','Tiền bảo trì',1),
(2,'expense','Chi nhân công bảo trì',30000000,'2026-05-05','Chi nhân công',1),
(3,'income','Đặt cọc sửa chữa',90000000,'2026-05-13','Tiền sửa chữa',1),
(3,'extra_expense','Thay cảm biến cửa',12000000,'2026-05-19','Phát sinh thiết bị',1);

INSERT INTO maintenance_schedules (project_id,maintenance_no,scheduled_date,completed_date,assigned_employee_id,status,note) VALUES
(2,1,'2026-05-01','2026-05-02',6,'done','Bảo trì lần 1'),
(2,2,'2026-06-01','2026-06-02',6,'done','Bảo trì lần 2'),
(2,3,'2026-07-01',NULL,6,'pending','Bảo trì lần 3'),
(2,4,'2026-08-01',NULL,6,'pending','Bảo trì lần 4'),
(2,5,'2026-09-01',NULL,6,'pending','Bảo trì lần 5'),
(2,6,'2026-10-01',NULL,6,'pending','Bảo trì lần 6'),
(2,7,'2026-11-01',NULL,6,'pending','Bảo trì lần 7'),
(2,8,'2026-12-01',NULL,6,'pending','Bảo trì lần 8'),
(5,1,'2026-04-01','2026-04-02',6,'done','Bảo trì lần 1'),
(5,2,'2026-06-01',NULL,6,'pending','Bảo trì lần 2'),
(5,3,'2026-08-01',NULL,6,'pending','Bảo trì lần 3'),
(5,4,'2026-10-01',NULL,6,'pending','Bảo trì lần 4'),
(5,5,'2026-12-01',NULL,6,'pending','Bảo trì lần 5'),
(5,6,'2027-02-01',NULL,6,'pending','Bảo trì lần 6');

INSERT INTO notifications (user_id,title,content,related_project_id) VALUES
(1,'Có báo cáo mới cần duyệt','Báo cáo lắp đặt ray đang chờ duyệt.',1),
(2,'Lịch bảo trì sắp tới','Dự án Bình Dương có lịch bảo trì lần 3.',2),
(8,'Lịch bảo trì sắp tới','Nhà máy Bình Dương có lịch bảo trì ngày 2026-07-01.',2),
(6,'Bạn có lịch bảo trì','Bảo trì lần 3 dự án Bình Dương.',2);
