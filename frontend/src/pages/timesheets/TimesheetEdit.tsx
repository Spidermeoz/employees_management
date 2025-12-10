import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";
import {
  FaUserClock,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaClock,
} from "react-icons/fa";

type Employee = {
  id: number;
  full_name: string;
};

type Timesheet = {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  working_hours?: number | string | null;
};

// 👉 Chuẩn hóa giờ về dạng HH:mm
const normalizeTime = (time: string | null | undefined) => {
  if (!time) return "";
  return time.length === 8 ? time.slice(0, 5) : time;
};

// 👉 Tạo Date chuẩn để tính giờ
const buildDateTime = (date: string, time: string) => {
  return new Date(`${date}T${time}:00`);
};

const TimesheetEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    working_hours: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 👉 Hàm tính giờ làm CHUẨN, đảm bảo không trả 0 lung tung
  const calculateWorkingHours = (
    date: string,
    check_in: string,
    check_out: string
  ) => {
    if (!date || !check_in || !check_out) return 0;

    const start = buildDateTime(date, check_in);
    const end = buildDateTime(date, check_out);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (end <= start) return 0;

    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return Number(diff.toFixed(2));
  };

  // 👉 Handle update when any field changes
  const updateForm = (name: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      updated.working_hours = calculateWorkingHours(
        updated.date,
        updated.check_in,
        updated.check_out
      );

      return updated;
    });
  };

  // 👉 Lấy thời gian hiện tại
  const getNowTime = () => {
    const now = new Date();
    return (
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0")
    );
  };

  const setCurrentCheckIn = () => updateForm("check_in", getNowTime());
  const setCurrentCheckOut = () => updateForm("check_out", getNowTime());

  // 👉 Load dữ liệu từ API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [empList, ts] = await Promise.all([
          apiGet<Employee[]>("/employees"),
          apiGet<Timesheet>(`/timesheets/${id}`),
        ]);

        setEmployees(empList);

        const normalizedForm = {
          employee_id: String(ts.employee_id),
          date: ts.date,
          check_in: normalizeTime(ts.check_in),
          check_out: normalizeTime(ts.check_out),
          working_hours: 0,
        };

        normalizedForm.working_hours = calculateWorkingHours(
          normalizedForm.date,
          normalizedForm.check_in,
          normalizedForm.check_out
        );

        setForm(normalizedForm);
      } catch (err) {
        console.error(err);
        setSubmitMessage("Không thể tải dữ liệu");
        setSubmitMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.employee_id) newErrors.employee_id = "Vui lòng chọn nhân viên";
    if (!form.date) newErrors.date = "Vui lòng chọn ngày";
    if (!form.check_in && !form.check_out)
      newErrors.check_out = "Phải có ít nhất 1 thời gian";

    if (form.check_in && form.check_out) {
      const start = buildDateTime(form.date, form.check_in);
      const end = buildDateTime(form.date, form.check_out);
      if (end <= start) newErrors.check_out = "Giờ check-out phải sau check-in";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload: any = {
        employee_id: Number(form.employee_id),
        date: form.date,
        check_in: form.check_in || null,
        check_out: form.check_out || null,
        working_hours:
          form.check_in && form.check_out ? form.working_hours : null,
      };

      await apiPut(`/timesheets/${id}`, payload);

      setSubmitMessage("Cập nhật thành công!");
      setSubmitMessageType("success");

      setTimeout(() => navigate("/timesheets"), 1200);
    } catch (err) {
      console.error(err);
      setSubmitMessage("Không thể cập nhật");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h3 className="fw-bold mb-0">
            <FaUserClock className="me-2" />
            Chỉnh sửa chấm công
          </h3>
        </div>

        <div className="card-body">
          {submitMessage && (
            <div
              className={`alert alert-${
                submitMessageType === "success" ? "success" : "danger"
              }`}
            >
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMPLOYEE */}
            <div className="mb-3">
              <label className="fw-bold">Nhân viên *</label>
              <select
                className={`form-select ${
                  errors.employee_id ? "is-invalid" : ""
                }`}
                value={form.employee_id}
                name="employee_id"
                onChange={(e) => updateForm("employee_id", e.target.value)}
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.full_name}
                  </option>
                ))}
              </select>
              {errors.employee_id && (
                <div className="invalid-feedback">{errors.employee_id}</div>
              )}
            </div>

            {/* DATE */}
            <div className="mb-3">
              <label className="fw-bold">Ngày *</label>
              <input
                type="date"
                className={`form-control ${errors.date ? "is-invalid" : ""}`}
                value={form.date}
                onChange={(e) => updateForm("date", e.target.value)}
              />
              {errors.date && (
                <div className="invalid-feedback">{errors.date}</div>
              )}
            </div>

            <div className="row">
              {/* CHECK-IN */}
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Giờ check-in</label>
                <div className="input-group">
                  <input
                    type="time"
                    className="form-control"
                    value={form.check_in}
                    onChange={(e) => updateForm("check_in", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={setCurrentCheckIn}
                  >
                    <FaClock />
                  </button>
                </div>
              </div>

              {/* CHECK-OUT */}
              <div className="col-md-6 mb-3">
                <label className="fw-bold">Giờ check-out</label>
                <div className="input-group">
                  <input
                    type="time"
                    className="form-control"
                    value={form.check_out}
                    onChange={(e) => updateForm("check_out", e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={setCurrentCheckOut}
                  >
                    <FaClock />
                  </button>
                </div>
              </div>
            </div>

            {/* HOURS */}
            <div className="mb-4">
              <label className="fw-bold">Số giờ làm</label>
              <input
                type="number"
                className="form-control"
                readOnly
                value={form.working_hours}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate("/timesheets")}
              >
                <FaTimes /> Hủy
              </button>

              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? <FaSpinner className="fa-spin" /> : <FaSave />}{" "}
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TimesheetEdit;
