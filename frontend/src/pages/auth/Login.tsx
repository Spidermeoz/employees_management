import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useUserStore } from "../../store/userStore";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useUserStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.");
      return;
    }

    // Mock user (sau này thay bằng API JWT)
    if (username === "admin" && password === "123456") {
      const mockUser = {
        username: "admin",
        full_name: "Administrator",
        email: "admin@example.com",
        role: "Admin",
      };
      login(mockUser);
      navigate("/app/dashboard");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-block rounded-xl bg-slate-900 px-4 py-1 text-sm font-semibold text-white shadow">
            EMP MANAGER
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Đăng nhập hệ thống
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Vui lòng nhập thông tin để truy cập
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 font-medium">{error}</p>
          )}

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-slate-800 transition-all"
          >
            <LogIn className="h-4 w-4" />
            Đăng nhập
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Employee Management System
        </p>
      </div>
    </div>
  );
}
