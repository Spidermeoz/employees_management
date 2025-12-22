import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiPost } from "../../api/client";
import {
  FaUserPlus,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const UserCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "admin", // ✔ Mặc định admin
    status: "active",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.full_name.trim()) {
      newErrors.full_name = "Tên người dùng là bắt buộc.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email là bắt buộc.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!form.password || form.password.length < 4) {
      newErrors.password = "Mật khẩu phải từ 4 ký tự trở lên.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await apiPost("/users", {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: "admin", // ✔ role cố định admin
        status: form.status,
      });

      setSubmitMessage("Tạo user thành công!");
      setSubmitMessageType("success");

      setTimeout(() => navigate("/users"), 1500);
    } catch (err) {
      console.error("Lỗi tạo user:", err);
      setSubmitMessage("Không thể tạo user. Vui lòng thử lại.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaUserPlus className="me-2" />
            Thêm User mới
          </h3>
        </div>

        <div className="card-body">
          {/* Alert message */}
          {submitMessage && (
            <div
              className={`alert alert-${
                submitMessageType === "success" ? "success" : "danger"
              } d-flex align-items-center`}
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

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label fw-bold">Mật khẩu *</label>
              <input
                type="password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* ROLE — FIXED ADMIN + DISABLED */}
            <div className="mb-3">
              <label className="form-label fw-bold">Vai trò *</label>
              <input
                type="text"
                className="form-control bg-light"
                value="Admin"
                disabled
              />
              {/* <small className="text-muted">
                Vai trò mặc định: Admin (Phân quyền: đang cập nhật ..)
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
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
