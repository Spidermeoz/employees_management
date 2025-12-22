import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";
import {
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaKey,
  FaUserCog,
} from "react-icons/fa";

type User = {
  id: number;
  full_name: string;
  email: string;
  role: string;
  status: string;
};

const UserEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "admin", // cố định
    status: "active",
  });

  const [passwords, setPasswords] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passErrors, setPassErrors] = useState<{ [key: string]: string }>({});

  // ---------------------------
  // LOAD USER
  // ---------------------------
  const loadUser = async () => {
    try {
      const data = await apiGet<User>(`/users/${id}`);

      setForm({
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        status: data.status,
      });
    } catch (err) {
      console.error("Lỗi tải user:", err);
      setSubmitMessage("Không thể tải dữ liệu người dùng.");
      setSubmitMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ---------------------------
  // VALIDATION
  // ---------------------------
  const validateForm = () => {
    const newErrors: any = {};

    if (!form.full_name.trim()) newErrors.full_name = "Họ và tên là bắt buộc.";
    if (!form.email.trim()) newErrors.email = "Email là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email không hợp lệ.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswords = () => {
    const newErrors: any = {};

    // Nếu nhập mật khẩu mới → bắt buộc nhập xác nhận
    if (passwords.new_password || passwords.confirm_password) {
      if (passwords.new_password.length < 4) {
        newErrors.new_password = "Mật khẩu phải từ 4 ký tự trở lên.";
      }

      if (passwords.new_password !== passwords.confirm_password) {
        newErrors.confirm_password = "Mật khẩu nhập lại không trùng khớp.";
      }
    }

    setPassErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------
  // HANDLE CHANGE
  // ---------------------------
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handlePasswordChange = (e: any) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    if (passErrors[e.target.name])
      setPassErrors({ ...passErrors, [e.target.name]: "" });
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!validatePasswords()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // 1️⃣ Update thông tin user
      await apiPut(`/users/${id}`, {
        full_name: form.full_name,
        email: form.email,
        status: form.status,
        role: form.role,
      });

      // 2️⃣ Nếu có mật khẩu → gọi API đổi mật khẩu
      if (passwords.new_password.trim() !== "") {
        await apiPut(
          `/users/${id}/password?new_pass=${passwords.new_password}`,
          {}
        );
      }

      setSubmitMessage("Cập nhật User thành công!");
      setSubmitMessageType("success");

      setTimeout(() => navigate("/users"), 1500);
    } catch (err) {
      console.error("Lỗi cập nhật user:", err);
      setSubmitMessage("Không thể cập nhật User.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return <p className="m-3 text-center">Đang tải dữ liệu người dùng...</p>;

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaUserCog className="me-2" />
            Chỉnh sửa User
          </h3>
        </div>

        <div className="card-body">
          {/* Alerts */}
          {submitMessage && (
            <div
              className={`alert alert-${
                submitMessageType === "success" ? "success" : "danger"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* FULL NAME */}
            <div className="mb-3">
              <label className="form-label fw-bold">Họ và tên *</label>
              <input
                type="text"
                className={`form-control ${
                  errors.full_name ? "is-invalid" : ""
                }`}
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
              />
              {errors.full_name && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.full_name}
                </div>
              )}
            </div>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label fw-bold">Email *</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* ROLE */}
            <div className="mb-3">
              <label className="form-label fw-bold">Vai trò *</label>
              <input
                type="text"
                className="form-control bg-light"
                value="Admin"
                disabled
              />
              {/* <small className="text-muted">
                Vai trò mặc định: Admin (không thể thay đổi)
              </small> */}
            </div>

            {/* STATUS */}
            <div className="mb-4">
              <label className="form-label fw-bold">Trạng thái *</label>
              <select
                className="form-select"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </div>

            {/* ---------------- PASSWORD UPDATE ---------------- */}
            <h5 className="fw-bold mb-3">
              <FaKey className="me-2" />
              Đổi mật khẩu
            </h5>

            {/* NEW PASSWORD */}
            <div className="mb-3">
              <label className="form-label fw-bold">Mật khẩu mới</label>
              <input
                type="password"
                className={`form-control ${
                  passErrors.new_password ? "is-invalid" : ""
                }`}
                name="new_password"
                value={passwords.new_password}
                onChange={handlePasswordChange}
                placeholder="Để trống nếu không muốn đổi mật khẩu"
              />
              {passErrors.new_password && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {passErrors.new_password}
                </div>
              )}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-4">
              <label className="form-label fw-bold">
                Nhập lại mật khẩu mới
              </label>
              <input
                type="password"
                className={`form-control ${
                  passErrors.confirm_password ? "is-invalid" : ""
                }`}
                name="confirm_password"
                value={passwords.confirm_password}
                onChange={handlePasswordChange}
              />
              {passErrors.confirm_password && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {passErrors.confirm_password}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/users")}
              >
                <FaTimes className="me-1" /> Hủy
              </button>

              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <FaSpinner className="fa-spin me-1" />
                ) : (
                  <FaSave className="me-1" />
                )}
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEdit;
