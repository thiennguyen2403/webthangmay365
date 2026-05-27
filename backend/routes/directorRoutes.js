import express from "express";
import { protect, allowRoles } from "../middlewares/authMiddleware.js";
import { uploadContract } from "../middlewares/uploadMiddleware.js";
import {
  getDashboard, getUsers, createUser, updateUserStatus, deleteUser,
  getProjects, getProjectDetail, createProject, updateProjectStage,
  getFinanceSummary, createFinanceTransaction, createTask,
  getPendingApprovals, reviewReport, reviewIssue, getSelectableUsers,
} from "../controllers/directorController.js";
const router = express.Router();
router.use(protect, allowRoles("director"));
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.post("/users", createUser);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/select-users", getSelectableUsers);
router.get("/projects", getProjects);
router.post("/projects", uploadContract.single("contract_file"), createProject);
router.get("/projects/:id", getProjectDetail);
router.patch("/stages/:stageId", updateProjectStage);
router.post("/tasks", createTask);
router.get("/finance", getFinanceSummary);
router.post("/finance", createFinanceTransaction);
router.get("/approvals", getPendingApprovals);
router.patch("/reports/:id/review", reviewReport);
router.patch("/issues/:id/review", reviewIssue);
export default router;
