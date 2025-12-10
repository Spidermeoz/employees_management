import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPost } from "../../api/client";
import {
  FaUserClock,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaClock, // Thêm icon đồng hồ
} from "react-icons/fa";

type Employee = {
  id: number;
  full_name: string;
};

const TimesheetCreate: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    employee_id: "",
    date: new Date().toISOString().split("T")[0], // Mặc định là hôm nay
    check_in: "",
    check_out: "",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper function để tạo đối tượng Date từ date và time string
  const createDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}:00`);
  };

  // 🔥 Hàm xác thực form (đã cập nhật)
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.employee_id) newErrors.employee_id = "Vui lòng chọn nhân viên.";
    if (!form.date) newErrors.date = "Vui lòng chọn ngày.";

    // Yêu cầu ít nhất một trong hai
    if (!form.check_in && !form.check_out) {
      newErrors.check_out = "Vui lòng nhập giờ check-in hoặc check-out.";
    }

    // Nếu cả hai đều có, check-out phải sau check-in
    if (form.check_in && form.check_out) {
      const checkInDateTime = createDateTime(form.date, form.check_in);
      const checkOutDateTime = createDateTime(form.date, form.check_out);
      if (checkOutDateTime <= checkInDateTime) {
        newErrors.check_out = "Giờ check-out phải sau giờ check-in.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 Hàm lấy thời gian hiện tại cho check-in
  const handleSetCurrentTimeIn = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    setForm({ ...form, check_in: currentTime });
    if (errors.check_in || errors.check_out) {
      setErrors({ ...errors, check_in: "", check_out: "" });
    }
  };

  // 🔥 Hàm lấy thời gian hiện tại cho check-out
  const handleSetCurrentTimeOut = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    setForm({ ...form, check_out: currentTime });
    if (errors.check_in || errors.check_out) {
      setErrors({ ...errors, check_in: "", check_out: "" });
    }
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiGet<Employee[]>("/employees");
        setEmployees(data);
      } catch (err) {
        console.error(err);
        setSubmitMessage("Không thể tải danh sách nhân viên.");
        setSubmitMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
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
      let payload: any = {
        employee_id: Number(form.employee_id),
        date: form.date,
        check_in: form.check_in || null,
        check_out: form.check_out || null,
      };

      // Chỉ tính toán số giờ làm việc nếu có đủ cả check-in và check-out
      if (form.check_in && form.check_out) {
        const checkInDateTime = createDateTime(form.date, form.check_in);
        const checkOutDateTime = createDateTime(form.date, form.check_out);
        const working_hours_ms =
          checkOutDateTime.getTime() - checkInDateTime.getTime();
        payload.working_hours = (working_hours_ms / (1000 * 60 * 60)).toFixed(
          2
        );
      } else {
        payload.working_hours = null;
      }

      await apiPost("/timesheets", payload);
      setSubmitMessage("Tạo chấm công thành công!");
      setSubmitMessageType("success");
      setTimeout(() => navigate("/timesheets"), 1500);
    } catch (err: any) {
      console.error("Error creating timesheet:", err);
      setSubmitMessage("Không thể tạo chấm công. Vui lòng thử lại.");
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
            <FaUserClock className="me-2" />
            Thêm chấm công
          </h3>
        </div>
        <div className="card-body">
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
            {/* NHÂN VIÊN */}
            <div className="mb-3">
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

            {/* NGÀY */}
            <div className="mb-3">
              <label className="form-label fw-bold">Ngày *</label>
              <input
                type="date"
                className={`form-control ${errors.date ? "is-invalid" : ""}`}
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

            {/* CHECK-IN / CHECK-OUT */}
            <div className="row">
              {/* CHECK-IN */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Giờ check-in</label>
                <div className="input-group">
                  <input
                    type="time"
                    className={`form-control ${
                      errors.check_in ? "is-invalid" : ""
                    }`}
                    name="check_in"
                    value={form.check_in}
                    onChange={handleChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSetCurrentTimeIn}
                    title="Lấy thời gian hiện tại"
                  >
                    <FaClock />
                  </button>
                </div>
                {errors.check_in && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />
                    {errors.check_in}
                  </div>
                )}
              </div>

              {/* CHECK-OUT */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Giờ check-out</label>
                <div className="input-group">
                  <input
                    type="time"
                    className={`form-control ${
                      errors.check_out ? "is-invalid" : ""
                    }`}
                    name="check_out"
                    value={form.check_out}
                    onChange={handleChange}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={handleSetCurrentTimeOut}
                    title="Lấy thời gian hiện tại"
                  >
                    <FaClock />
                  </button>
                </div>
                {errors.check_out && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />
                    {errors.check_out}
                  </div>
                )}
              </div>
            </div>

            {/* BUTTONS */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/timesheets")}
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

export default TimesheetCreate;
