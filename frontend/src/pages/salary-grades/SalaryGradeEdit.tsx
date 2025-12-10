import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";
import {
  FaMoneyBillWave,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

const SalaryGradeEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState({
    grade_name: "",
    base_salary: "",
    coefficient: "",
  });

  // 🔥 Hàm xác thực form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.grade_name.trim()) {
      newErrors.grade_name = "Tên bậc lương là bắt buộc.";
    }
    if (!form.base_salary || Number(form.base_salary) <= 0) {
      newErrors.base_salary = "Lương cơ bản phải là số lớn hơn 0.";
    }
    if (!form.coefficient || Number(form.coefficient) <= 0) {
      newErrors.coefficient = "Hệ số phải là số lớn hơn 0.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<any>(`/salary-grades/${id}`);
        setForm({
          grade_name: data.grade_name,
          base_salary: String(Number(data.base_salary)),
          coefficient: String(Number(data.coefficient)),
        });
      } catch (err) {
        console.error(err);
        setSubmitMessage("Không thể tải thông tin bậc lương.");
        setSubmitMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Xóa lỗi khi người dùng bắt đầu sửa
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const payload = {
        grade_name: form.grade_name,
        base_salary: Number(form.base_salary),
        coefficient: Number(form.coefficient),
      };

      await apiPut(`/salary-grades/${id}`, payload);
      setSubmitMessage("Cập nhật bậc lương thành công!");
      setSubmitMessageType("success");
      setTimeout(() => navigate("/salary-grades"), 1500); // Chuyển trang sau 1.5s
    } catch (err) {
      console.error(err);
      setSubmitMessage("Không thể cập nhật bậc lương. Vui lòng thử lại.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaMoneyBillWave className="me-2" />
            Chỉnh sửa bậc lương
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
            {/* TÊN BẬC LƯƠNG */}
            <div className="mb-3">
              <label className="form-label fw-bold">Tên bậc lương *</label>
              <input
                type="text"
                className={`form-control ${
                  errors.grade_name ? "is-invalid" : ""
                }`}
                name="grade_name"
                value={form.grade_name}
                onChange={handleChange}
                required
              />
              {errors.grade_name && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.grade_name}
                </div>
              )}
            </div>

            {/* LƯƠNG CƠ BẢN */}
            <div className="mb-3">
              <label className="form-label fw-bold">Lương cơ bản (VNĐ) *</label>
              <input
                type="number"
                className={`form-control ${
                  errors.base_salary ? "is-invalid" : ""
                }`}
                name="base_salary"
                value={form.base_salary}
                onChange={handleChange}
                min={0}
                required
              />
              {errors.base_salary && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.base_salary}
                </div>
              )}
            </div>

            {/* HỆ SỐ */}
            <div className="mb-4">
              <label className="form-label fw-bold">Hệ số *</label>
              <input
                type="number"
                step="0.01"
                className={`form-control ${
                  errors.coefficient ? "is-invalid" : ""
                }`}
                name="coefficient"
                value={form.coefficient}
                onChange={handleChange}
                min={0}
                required
              />
              {errors.coefficient && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.coefficient}
                </div>
              )}
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/salary-grades")}
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
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalaryGradeEdit;
