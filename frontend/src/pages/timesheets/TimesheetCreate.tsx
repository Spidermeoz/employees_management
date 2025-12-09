import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/client";

type Employee = {
  id: number;
  full_name: string;
};

const TimesheetCreate: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [mode, setMode] = useState<"both" | "checkin" | "checkout">("both");

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    working_hours: 0,
  });

  // Get current time HH:MM
  const getNowTime = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  // Calc working hours
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;

    const s = new Date(`2025-01-01T${start}`);
    const e = new Date(`2025-01-01T${end}`);

    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? Number(diff.toFixed(2)) : 0;
  };

  useEffect(() => {
    if (mode === "both") {
      const hours = calculateHours(form.check_in, form.check_out);
      setForm((prev) => ({ ...prev, working_hours: hours }));
    } else {
      setForm((prev) => ({ ...prev, working_hours: 0 }));
    }
  }, [form.check_in, form.check_out, mode]);

  // Load employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiGet<Employee[]>("/employees");
        setEmployees(data);
      } catch (err) {
        console.error(err);
        alert("Không thể tải danh sách nhân viên!");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let payload: any = {
      employee_id: Number(form.employee_id),
      date: form.date,
      check_in: form.check_in || null,
      check_out: form.check_out || null,
      working_hours: mode === "both" ? form.working_hours : 0,
    };

    try {
      await apiPost("/timesheets", payload);
      alert("Tạo chấm công thành công!");
      navigate("/timesheets");
    } catch (err) {
      console.error(err);
      alert("Không thể tạo chấm công.");
    }
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm chấm công</h3>

      <form className="card p-4 shadow-sm border-0" onSubmit={handleSubmit}>
        {/* EMPLOYEE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Nhân viên</label>
          <select
            className="form-select"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* DATE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Ngày</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* MODE SELECT */}
        <div className="mb-3">
          <label className="form-label fw-bold">Loại chấm công</label>
          <select
            className="form-select"
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
          >
            <option value="both">Cả check-in & check-out</option>
            <option value="checkin">Chỉ check-in</option>
            <option value="checkout">Chỉ check-out</option>
          </select>
        </div>

        {/* TIME FIELDS */}
        <div className="row g-3">
          {/* CHECK-IN */}
          {(mode === "checkin" || mode === "both") && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Giờ check-in</label>
              <div className="input-group">
                <input
                  type="time"
                  className="form-control"
                  name="check_in"
                  value={form.check_in}
                  onChange={handleChange}
                  required={mode === "checkin" || mode === "both"}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, check_in: getNowTime() }))
                  }
                >
                  Hiện tại
                </button>
              </div>
            </div>
          )}

          {/* CHECK-OUT */}
          {(mode === "checkout" || mode === "both") && (
            <div className="col-md-6">
              <label className="form-label fw-bold">Giờ check-out</label>
              <div className="input-group">
                <input
                  type="time"
                  className="form-control"
                  name="check_out"
                  value={form.check_out}
                  onChange={handleChange}
                  required={mode === "checkout" || mode === "both"}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    setForm((prev) => ({ ...prev, check_out: getNowTime() }))
                  }
                >
                  Hiện tại
                </button>
              </div>
            </div>
          )}
        </div>

        {/* HOURS (only for both mode) */}
        {mode === "both" && (
          <div className="mt-3">
            <label className="form-label fw-bold">Số giờ làm</label>
            <input
              type="number"
              className="form-control"
              value={form.working_hours}
              readOnly
            />
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Lưu
          </button>
          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/timesheets")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default TimesheetCreate;
