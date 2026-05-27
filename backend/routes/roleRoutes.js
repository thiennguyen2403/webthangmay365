import express from "express";
import { protect, allowRoles } from "../middlewares/authMiddleware.js";
import { uploadReportImage } from "../middlewares/uploadMiddleware.js";
import {
  getManagerDashboard, getManagerProjects, getManagerProjectDetail,
  getManagerEmployees, createManagerTask, createManagerReport,
  getManagerPendingEmployeeReports, managerReviewReport, managerReviewIssue, updateManagerStage,
  getEmployeeDashboard, getEmployeeProjectDetail, updateEmployeeTask, createEmployeeReport, createEmployeeIssue, completeMaintenanceVisit,
  getCustomerDashboard, getCustomerProjectDetail,
} from "../controllers/roleController.js";
const router = express.Router();
router.get("/manager/dashboard", protect, allowRoles("manager"), getManagerDashboard);
router.get("/manager/projects", protect, allowRoles("manager"), getManagerProjects);
router.get("/manager/projects/:id", protect, allowRoles("manager"), getManagerProjectDetail);
router.get("/manager/employees", protect, allowRoles("manager"), getManagerEmployees);
router.post("/manager/tasks", protect, allowRoles("manager"), createManagerTask);
router.post("/manager/reports", protect, allowRoles("manager"), uploadReportImage.single("image"), createManagerReport);
router.get("/manager/employee-approvals", protect, allowRoles("manager"), getManagerPendingEmployeeReports);
router.patch("/manager/reports/:id/review", protect, allowRoles("manager"), managerReviewReport);
router.patch("/manager/issues/:id/review", protect, allowRoles("manager"), managerReviewIssue);
router.patch("/manager/stages/:stageId", protect, allowRoles("manager"), updateManagerStage);
router.get("/employee/dashboard", protect, allowRoles("employee_technical","employee_installation","employee_maintenance"), getEmployeeDashboard);
router.get("/employee/projects/:id", protect, allowRoles("employee_technical","employee_installation","employee_maintenance"), getEmployeeProjectDetail);
router.patch("/employee/tasks/:id/status", protect, allowRoles("employee_technical","employee_installation","employee_maintenance"), updateEmployeeTask);
router.post("/employee/reports", protect, allowRoles("employee_technical","employee_installation","employee_maintenance"), uploadReportImage.single("image"), createEmployeeReport);
router.post("/employee/issues", protect, allowRoles("employee_technical","employee_installation","employee_maintenance"), uploadReportImage.single("image"), createEmployeeIssue);
router.patch("/employee/maintenance/:id/done", protect, allowRoles("employee_maintenance"), completeMaintenanceVisit);
router.get("/customer/dashboard", protect, allowRoles("customer_installation","customer_maintenance"), getCustomerDashboard);
router.get("/customer/projects/:id", protect, allowRoles("customer_installation","customer_maintenance"), getCustomerProjectDetail);
export default router;
