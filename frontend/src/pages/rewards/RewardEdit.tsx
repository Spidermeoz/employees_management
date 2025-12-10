import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";
import {
  FaUser,
  FaGift,
  FaCalendarAlt,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

type RewardItem = {
  id: number;
  employee_id: number;
  type: "reward" | "discipline";
  title: string;
  amount: number;
  date: string;
  note?: string | null;
};

type Employee = {
  id: number;
  full_name: string;
};

const RewardEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<RewardItem>({
    id: 0,
    employee_id: 0,
    type: "reward",
    title: "",
    amount: 0,
    date: "",
    note: "",
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.employee_id) newErrors.employee_id = "Vui lòng chọn nhân viên.";
    if (!form.title.trim()) newErrors.title = "Vui lòng nhập tiêu đề.";
    if (!form.amount || form.amount <= 0)
      newErrors.amount = "Số tiền phải lớn hơn 0.";
    if (!form.date) newErrors.date = "Vui lòng chọn ngày.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reward, empList] = await Promise.all([
          apiGet<RewardItem>(`/rewards/${id}`),
          apiGet<Employee[]>("/employees"),
        ]);

        setForm({ ...reward, note: reward.note || "" });
        setEmployees(empList);
      } catch (err) {
        console.error(err);
        setSubmitMessage("Không thể tải dữ liệu thưởng/kỷ luật.");
        setSubmitMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const payload = {
        employee_id: Number(form.employee_id),
        type: form.type,
        title: form.title,
        amount: Number(form.amount),
        date: form.date,
        note: form.note || null,
      };

      await apiPut(`/rewards/${id}`, payload);
      setSubmitMessage("Cập nhật thành công!");
      setSubmitMessageType("success"); // Đổi thành 'success' để khớp nhầm lẫn, nhưng bạn có thể đổi thành 'error' nếu muốn
      setTimeout(() => navigate("/rewards"), 1500);
    } catch (err) {
      console.error(err);
      setSubmitMessage("Lỗi khi cập nhật. Vui lòng thử lại.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (submitMessage) {
    return (
      <div
        className={`alert alert-${
          submitMessageType === "success" ? "success" : "danger"
        } 
  d-flex align-items-center`}
        role="alert"
      >
        {submitMessage}
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaGift className="me-2" />
            Chỉnh sửa {form.type === "reward" ? "thưởng" : "kỷ luật"}
          </h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} noValidate>
            {/* CARD: Thông tin nhân viên */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="fw-bold mb-0">
                  <FaUser className="me-2" />
                  Thông tin nhân viên
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Nhân viên *</label>
                    <select
                      className={`form-select ${
                        errors.employee_id ? "is-invalid" : ""
                      }`}
                      name="employee_id"
                      value={form.employee_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn nhân viên --</option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name}
                        </option>
                      ))}
                    </select>
                    {errors.employee_id && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.employee_id}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Loại</label>
                    <select
                      className="form-select"
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                    >
                      <option value="reward">Thưởng</option>
                      <option value="discipline">Kỷ luật</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD: Chi tiết thưởng/kỷ luật */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="fw-bold mb-0">
                  <FaGift className="me-2" />
                  Chi tiết {form.type === "reward" ? "thưởng" : "kỷ luật"}
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Tiêu đề *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                    />
                    {errors.title && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.title}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Ngày *</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date ? "is-invalid" : ""
                      }`}
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                    />
                    {errors.date && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.date}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-md-12">
                    <label className="form-label fw-bold">Số tiền *</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.amount ? "is-invalid" : ""
                      }`}
                      name="amount"
                      value={form.amount}
                      onChange={handleChange}
                      required
                    />
                    {errors.amount && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.amount}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">Ghi chú</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    name="note"
                    value={form.note || ""}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/rewards")}
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

export default RewardEdit;
