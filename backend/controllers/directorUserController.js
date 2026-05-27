import bcrypt from "bcryptjs";
import db from "../config/db.js";

export const getUsers = async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, full_name, email, role, status, created_at
      FROM users
      ORDER BY id DESC
    `);

    res.json(users);
  } catch {
    res.status(500).json({ message: "Lỗi lấy danh sách tài khoản" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }

    if (!["manager", "employee", "customer"].includes(role)) {
      return res.status(400).json({ message: "Chức vụ không hợp lệ" });
    }

    const [exists] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (exists.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `
      INSERT INTO users (full_name, email, password, role, status)
      VALUES (?, ?, ?, ?, 'active')
      `,
      [full_name, email, hashedPassword, role]
    );

    res.json({ message: "Tạo tài khoản thành công" });
  } catch {
    res.status(500).json({ message: "Lỗi tạo tài khoản" });
  }
};

export const lockUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE users SET status = 'locked' WHERE id = ? AND role != 'director'",
      [id]
    );

    res.json({ message: "Đã khóa tài khoản" });
  } catch {
    res.status(500).json({ message: "Lỗi khóa tài khoản" });
  }
};

export const unlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE users SET status = 'active' WHERE id = ? AND role != 'director'",
      [id]
    );

    res.json({ message: "Đã mở khóa tài khoản" });
  } catch {
    res.status(500).json({ message: "Lỗi mở khóa tài khoản" });
  }
};