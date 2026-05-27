import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

const publicUserFields = "id, full_name, email, phone, address, experience_years, role, status, created_at";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });

    const [users] = await db.query(`SELECT * FROM users WHERE email = ?`, [email]);
    if (users.length === 0) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const user = users[0];
    if (user.status === "blocked") return res.status(403).json({ message: "Tài khoản đã bị chặn" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        experience_years: user.experience_years,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR", error);
    res.status(500).json({ message: "Lỗi server", error: String(error) });
  }
};

export const me = async (req, res) => {
  try {
    const [rows] = await db.query(`SELECT ${publicUserFields} FROM users WHERE id = ?`, [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy thông tin tài khoản" });
  }
};
