import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPost } from "../../api/client";
import {
  FaBuilding,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

type EmployeeOption = {
  id: number;
  full_name: string;
};

const DepartmentCreate: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loadingEmp, setLoadingEmp] = useState(true);
  const [errorEmp, setErrorEmp] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    phone: "",
    manager_id: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);

  // 🔥 Load danh sách nhân viên
  useEffect(() => {
    apiGet<EmployeeOption[]>("/employees")
      .then((data) => setEmployees(data))
      .catch((err) => {
        console.error("Lỗi khi load nhân viên:", err);
        setErrorEmp("Không thể tải danh sách nhân viên.");
      })
      .finally(() => setLoadingEmp(false));
  }, []);

  // 🔥 Validate giống PositionCreate (không validate mô tả)
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên phòng ban là bắt buộc.";
    }

    // Validate số điện thoại (optional nhưng nếu nhập thì phải đúng)
    if (form.phone && !/^[0-9]{8,15}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (8–15 chữ số).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 🔥 Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await apiPost("/departments", {
        name: form.name,
        description: form.description || null,
        phone: form.phone || null,
        manager_id: form.manager_id ? Number(form.manager_id) : null,
      });

      setSubmitMessage("Tạo phòng ban thành công!");
      setSubmitMessageType("success");

      setTimeout(() => navigate("/departments"), 1500);
    } catch (err: any) {
      console.error("Lỗi tạo phòng ban:", err);
      setSubmitMessage("Không thể tạo phòng ban. Vui lòng thử lại.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingEmp) return <p className="m-3">Đang tải danh sách nhân viên...</p>;

  if (errorEmp) return <div className="alert alert-danger m-3">{errorEmp}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaBuilding className="me-2" />
            Thêm phòng ban mới
          </h3>
        </div>

        <div className="card-body">
          {/* Thông báo */}
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
            {/* TÊN PHÒNG BAN */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tên phòng ban *</label>
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

            {/* MÔ TẢ */}
            <div className="mb-3">
              <label className="form-label fw-bold">Mô tả</label>
              <textarea
                className="form-control"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Nhập mô tả (không bắt buộc)..."
              ></textarea>
            </div>

            {/* PHONE */}
            <div className="mb-3">
              <label className="form-label fw-bold">Số điện thoại</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.phone}
                </div>
              )}
            </div>

            {/* TRƯỞNG PHÒNG */}
            <div className="mb-3">
              <label className="form-label fw-bold">Trưởng phòng</label>
              <select
                name="manager_id"
                className="form-select"
                value={form.manager_id}
                onChange={handleChange}
              >
                <option value="">-- Chọn trưởng phòng --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/departments")}
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

export default DepartmentCreate;
