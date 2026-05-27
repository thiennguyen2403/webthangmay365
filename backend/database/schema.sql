CREATE DATABASE IF NOT EXISTS thang_may_365 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE thang_may_365;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS project_images;
DROP TABLE IF EXISTS maintenance_schedules;
DROP TABLE IF EXISTS finance_transactions;
DROP TABLE IF EXISTS issues;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_stages;
DROP TABLE IF EXISTS project_members;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  address VARCHAR(255),
  experience_years INT DEFAULT 0,
  role ENUM('director','manager','employee_technical','employee_installation','employee_maintenance','customer_installation','customer_maintenance') NOT NULL,
  status ENUM('active','blocked') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  project_type ENUM('installation','maintenance','repair') NOT NULL,
  customer_id INT NOT NULL,
  manager_id INT,
  address VARCHAR(255) NOT NULL,
  elevator_type VARCHAR(255),
  contract_code VARCHAR(100),
  contract_date DATE NOT NULL,
  start_date DATE NOT NULL,
  expected_end_date DATE NOT NULL,
  actual_end_date DATE,
  contract_file VARCHAR(500),
  maintenance_total_times INT DEFAULT 0,
  maintenance_cycle_months INT DEFAULT 1,
  maintenance_done_times INT DEFAULT 0,
  status ENUM('new','survey','design','manufacturing','installing','repairing','maintenance','inspection','handover','completed','paused','late') DEFAULT 'new',
  progress INT DEFAULT 0,
  contract_value DECIMAL(15,2) DEFAULT 0,
  note TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (manager_id) REFERENCES users(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE project_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role_in_project ENUM('manager','employee_technical','employee_installation','employee_maintenance','customer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE project_stages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  stage_key VARCHAR(100) NOT NULL,
  stage_name VARCHAR(255) NOT NULL,
  stage_order INT NOT NULL,
  status ENUM('pending','doing','done') DEFAULT 'pending',
  completed_by INT,
  completed_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  project_id INT,
  stage_id INT,
  assigned_by INT NOT NULL,
  assigned_to INT NOT NULL,
  task_scope ENUM('company','project') DEFAULT 'project',
  priority ENUM('low','medium','high') DEFAULT 'medium',
  status ENUM('pending','doing','done','late','cancelled') DEFAULT 'pending',
  start_date DATE,
  deadline DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (stage_id) REFERENCES project_stages(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_by) REFERENCES users(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  project_id INT,
  task_id INT,
  sender_id INT NOT NULL,
  receiver_id INT,
  report_type ENUM('weekly','progress','finance','maintenance','installation','repair','other') DEFAULT 'progress',
  report_visibility ENUM('internal','customer') DEFAULT 'internal',
  progress_percent INT,
  manager_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  manager_comment TEXT,
  manager_reviewed_by INT,
  manager_reviewed_at DATETIME,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  director_comment TEXT,
  reviewed_by INT,
  reviewed_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (manager_reviewed_by) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE TABLE issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  project_id INT,
  sender_id INT NOT NULL,
  severity ENUM('low','medium','high','critical') DEFAULT 'medium',
  manager_status ENUM('pending','approved','rejected') DEFAULT 'pending',
  manager_comment TEXT,
  manager_reviewed_by INT,
  manager_reviewed_at DATETIME,
  status ENUM('pending','approved','rejected','resolved') DEFAULT 'pending',
  director_comment TEXT,
  reviewed_by INT,
  reviewed_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (manager_reviewed_by) REFERENCES users(id),
  FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE TABLE finance_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  type ENUM('income','expense','extra_expense') NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  payment_date DATE NOT NULL,
  note TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE maintenance_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  maintenance_no INT NOT NULL,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  assigned_employee_id INT,
  status ENUM('pending','done','late','cancelled') DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_employee_id) REFERENCES users(id)
);

CREATE TABLE project_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  uploaded_by INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  related_project_id INT,
  is_read TINYINT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_project_id) REFERENCES projects(id) ON DELETE SET NULL
);

CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
