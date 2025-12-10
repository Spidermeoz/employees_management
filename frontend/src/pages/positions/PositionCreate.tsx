import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiPost } from "../../api/client";
import {
  FaBriefcase,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const PositionCreate: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    level: 1,
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 🔥 Hàm xác thực form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) {
      newErrors.name = "Tên chức vụ là bắt buộc.";
    }
    if (!form.level || form.level <= 0) {
      newErrors.level = "Level phải là số lớn hơn 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "level" ? Number(value) : value,
    });

    // Xóa lỗi khi người dùng bắt đầu sửa
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await apiPost("/positions", {
        name: form.name,
        level: form.level,
        description: form.description || null,
      });

      setSubmitMessage("Tạo chức vụ thành công!");
      setSubmitMessageType("success");
      setTimeout(() => navigate("/positions"), 1500); // Chuyển trang sau 1.5s
    } catch (err: any) {
      console.error("Lỗi tạo chức vụ:", err);
      setSubmitMessage("Không thể tạo chức vụ. Vui lòng thử lại.");
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
            <FaBriefcase className="me-2" />
            Thêm chức vụ mới
          </h3>
        </div>
        <div className="card-body">
          {/* Thông báo thành công/lỗi */}
          {submitMessage && (
            <div
              className={`alert alert-${
                submitMessageType === "success" ? "success" : "danger"
              } d-flex align-items-center`}
              role="alert"
            >
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* TÊN CHỨC VỤ */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tên chức vụ *</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* LEVEL */}
            <div className="mb-3">
              <label className="form-label fw-bold">Level *</label>
              <input
                type="number"
                min={1}
                className={`form-control ${errors.level ? "is-invalid" : ""}`}
                name="level"
                value={form.level}
                onChange={handleChange}
                required
              />
              {errors.level && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.level}
                </div>
              )}
            </div>

            {/* MÔ TẢ */}
            <div className="mb-4">
              <label className="form-label fw-bold">Mô tả</label>
              <textarea
                className="form-control"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả cho chức vụ (không bắt buộc)..."
              ></textarea>
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/positions")}
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

export default PositionCreate;
