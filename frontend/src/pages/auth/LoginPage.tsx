import React, { useState } from "react";
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
} from "react-icons/fa"; // Import thêm các icon HR
import { loginApi } from "../../api/client"; // ✅ gọi API thật

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // State cho form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State cho UI/UX
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginApi({
        email,
        password,
      });

      // Lưu token & thông tin user vào localStorage
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("current_user", JSON.stringify(res.user));

      // Điều hướng về dashboard
      navigate("/", { replace: true });
    } catch (err: any) {
      console.error(err);
      setError("Sai tài khoản hoặc mật khẩu, hoặc server đang gặp sự cố!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Custom CSS cho gradient, icon và glass-morphism */}
      <style>
        {`
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
              'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
              sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
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
          .icon-1 { top: 5%; left: 10%; transform: rotate(-15deg); }
          .icon-2 { bottom: 10%; right: 5%; transform: rotate(20deg); }
          .icon-3 { top: 50%; left: 5%; transform: rotate(10deg); }
          .icon-4 { bottom: 20%; left: 40%; transform: rotate(-25deg); }
          .icon-5 { top: 10%; right: 15%; transform: rotate(30deg); }
          .icon-6 { top: 70%; right: 40%; transform: rotate(-10deg); }

          .login-card {
            border: none;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(50, 50, 93, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
            background-color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .input-icon {
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
            color: #adb5bd;
            z-index: 10;
          }
          .form-control {
            padding-left: 45px;
            height: 55px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
            transition: all 0.3s ease-in-out;
          }
          .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
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
            border-radius: 10px;
            font-weight: 600;
            font-size: 1.1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            transition: all 0.3s ease-in-out;
          }
          .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
          }
          .error-message {
            animation: fadeIn 0.5s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
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

        {/* Login Card */}
        <div className="card p-4 p-md-5 login-card" style={{ width: "450px" }}>
          {/* Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white mb-3"
              style={{ width: "80px", height: "80px" }}
            >
              <FaUser size={35} />
            </div>
            <h2 className="fw-bold mb-1">Chào mừng trở lại!</h2>
            <p className="text-muted">
              Vui lòng đăng nhập vào tài khoản HRM của bạn
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-3 position-relative">
              <FaEnvelope className="input-icon" size={20} />
              <input
                type="email"
                className="form-control"
                placeholder="Địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="mb-3 position-relative">
              <FaLock className="input-icon" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={22} /> : <FaEye size={22} />}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                className="alert alert-danger d-flex align-items-center p-3 mb-3 error-message"
                role="alert"
              >
                <FaExclamationCircle className="me-2" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Button */}
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

          {/* Footer */}
          <p className="text-center text-muted mt-4 mb-0">
            © {new Date().getFullYear()} Your Company. Đã đăng ký bản quyền.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
