import express from "express";
import {
  getUsers,
  createUser,
  lockUser,
  unlockUser,
} from "../controllers/directorUserController.js";

import { protect, allowRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(allowRoles("director"));

router.get("/users", getUsers);
router.post("/users", createUser);
router.patch("/users/:id/lock", lockUser);
router.patch("/users/:id/unlock", unlockUser);

export default router;