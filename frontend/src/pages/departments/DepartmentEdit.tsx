import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";
import {
  FaBuilding,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

type Employee = {
  id: number;
  full_name: string;
};

type Department = {
  id: number;
  name: string;
  description?: string | null;
  phone?: string | null;
  manager_id?: number | null;
};

const DepartmentEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  // 🔥 Load dữ liệu phòng ban + danh sách nhân viên
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) return;

        // 1️⃣ Load department data
        const dept = await apiGet<Department>(`/departments/${id}`);
        setForm({
          name: dept.name,
          description: dept.description || "",
          phone: dept.phone || "",
          manager_id: dept.manager_id ? dept.manager_id.toString() : "",
        });

        // 2️⃣ Load employees
        const emps = await apiGet<Employee[]>("/employees");
        setEmployees(emps);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu phòng ban.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // 🔥 Validate giống create-page
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) {
      newErrors.name = "Tên phòng ban là bắt buộc.";
    }

    if (form.phone && !/^[0-9]{8,15}$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (8–15 chữ số).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 🔥 Submit cập nhật phòng ban
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      await apiPut(`/departments/${id}`, {
        name: form.name,
        description: form.description || null,
        phone: form.phone || null,
        manager_id: form.manager_id ? Number(form.manager_id) : null,
      });

      setSubmitMessage("Cập nhật phòng ban thành công!");
      setSubmitMessageType("success");

      setTimeout(() => navigate("/departments"), 1500);
    } catch (err: any) {
      console.error(err);
      setSubmitMessage("Lỗi cập nhật phòng ban. Vui lòng thử lại.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaBuilding className="me-2" />
            Chỉnh sửa phòng ban
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
            {/* NAME */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tên phòng ban *</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="form-label fw-bold">Mô tả</label>
              <textarea
                className="form-control"
                rows={3}
                name="description"
                value={form.description}
                onChange={handleChange}
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

            {/* MANAGER */}
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

export default DepartmentEdit;
