import bcrypt from "bcryptjs";
import db from "./config/db.js";

const newPassword = "123456";

const run = async () => {
  try {
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ?", [hash]);
    console.log("Đã cập nhật mật khẩu cho tất cả tài khoản test.");
    console.log("Mật khẩu chung:", newPassword);
    process.exit(0);
  } catch (error) {
    console.log("Lỗi cập nhật mật khẩu:", error);
    process.exit(1);
  }
};

run();
