import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaExclamationCircle,
  FaUsers,
  FaUserTie,
  FaBriefcase,
  FaChartLine,
  FaHandshake,
  FaUsersCog,
} from "react-icons/fa";
import { loginApi } from "../../api/client";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  /* =======================
     REDIRECT IF LOGGED IN
  ======================= */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     HANDLE LOGIN
  ======================= */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({ email, password });

      // Save auth
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("current_user", JSON.stringify(res.user));

      // Redirect dashboard
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Sai tài khoản hoặc mật khẩu, hoặc server đang gặp sự cố!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ===== Custom CSS ===== */}
      <style>
        {`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
          }
          .login-container {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            position: relative;
            overflow: hidden;
          }
          .bg-icon {
            position: absolute;
            color: rgba(255, 255, 255, 0.04);
            font-size: 10rem;
            pointer-events: none;
          }
          .icon-1 { top: 5%; left: 10%; }
          .icon-2 { bottom: 10%; right: 5%; }
          .icon-3 { top: 50%; left: 5%; }
          .icon-4 { bottom: 20%; left: 40%; }
          .icon-5 { top: 10%; right: 15%; }
          .icon-6 { top: 70%; right: 40%; }

          .login-card {
            border-radius: 20px;
            background-color: rgba(255,255,255,0.9);
            backdrop-filter: blur(10px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.15);
          }
          .input-icon {
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            color: #adb5bd;
          }
          .form-control {
            padding-left: 45px;
            height: 55px;
            border-radius: 10px;
          }
          .password-toggle-icon {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            cursor: pointer;
            color: #adb5bd;
          }
          .btn-login {
            height: 55px;
            font-weight: 600;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border: none;
          }
        `}
      </style>

      <div className="login-container d-flex justify-content-center align-items-center">
        {/* Background Icons */}
        <FaUsersCog className="bg-icon icon-1" />
        <FaChartLine className="bg-icon icon-2" />
        <FaHandshake className="bg-icon icon-3" />
        <FaUserTie className="bg-icon icon-4" />
        <FaBriefcase className="bg-icon icon-5" />
        <FaUsers className="bg-icon icon-6" />

        {/* Card */}
        <div className="card p-4 p-md-5 login-card" style={{ width: 450 }}>
          <div className="text-center mb-4">
            <div
              className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: 80, height: 80 }}
            >
              <FaUser size={35} />
            </div>
            <h2 className="fw-bold">Chào mừng trở lại!</h2>
            <p className="text-muted">Đăng nhập hệ thống HRM</p>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-3 position-relative">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3 position-relative">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <FaExclamationCircle className="me-2" />
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="btn btn-primary btn-login w-100 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="fa-spin me-2" />
                  Đang xử lý...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>

          <p className="text-center text-muted mt-4 mb-0">
            © {new Date().getFullYear()} Your Company
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
