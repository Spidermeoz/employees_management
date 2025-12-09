import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";

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

const TimesheetEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employee_id: "",
    date: "",
    check_in: "",
    check_out: "",
    working_hours: 0,
  });

  // 🔥 Hàm lấy giờ hiện tại
  const getNowTime = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  // 🔥 Tính số giờ làm
  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;

    const s = new Date(`2020-01-01T${start}`);
    const e = new Date(`2020-01-01T${end}`);

    const diff = (e.getTime() - s.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? Number(diff.toFixed(2)) : 0;
  };

  // 🎯 Load timesheet + employee list từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeesData = await apiGet<Employee[]>("/employees");
        setEmployees(employeesData);

        const ts = await apiGet<Timesheet>(`/timesheets/${id}`);

        setForm({
          employee_id: String(ts.employee_id),
          date: ts.date,
          check_in: ts.check_in || "",
          check_out: ts.check_out || "",
          working_hours: ts.working_hours ? Number(ts.working_hours) : 0,
        });
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu chấm công.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🎯 Tự tính lại số giờ khi sửa check_in / check_out
  useEffect(() => {
    const hours = calculateHours(form.check_in, form.check_out);
    setForm((prev) => ({ ...prev, working_hours: hours }));
  }, [form.check_in, form.check_out]);

  // 🎯 Auto-update form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 Gửi API cập nhật timesheet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      employee_id: Number(form.employee_id),
      date: form.date,
      check_in: form.check_in || null,
      check_out: form.check_out || null,
      working_hours: form.working_hours,
    };

    try {
      await apiPut(`/timesheets/${id}`, payload);

      alert("Cập nhật chấm công thành công!");
      navigate("/timesheets");
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật chấm công.");
    }
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa chấm công</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
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

        {/* TIME INPUTS */}
        <div className="row g-3">
          {/* CHECK-IN */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Giờ check-in</label>
            <div className="input-group">
              <input
                type="time"
                className="form-control"
                name="check_in"
                value={form.check_in}
                onChange={handleChange}
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

          {/* CHECK-OUT */}
          <div className="col-md-6">
            <label className="form-label fw-bold">Giờ check-out</label>
            <div className="input-group">
              <input
                type="time"
                className="form-control"
                name="check_out"
                value={form.check_out}
                onChange={handleChange}
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
        </div>

        {/* HOURS */}
        <div className="mt-3">
          <label className="form-label fw-bold">Số giờ làm</label>
          <input
            type="number"
            className="form-control"
            value={form.working_hours}
            readOnly
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Cập nhật
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

export default TimesheetEdit;
