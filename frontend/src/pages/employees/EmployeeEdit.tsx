import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";

type Department = { id: number; name: string };
type Position = { id: number; name: string };
type SalaryGrade = { id: number; grade_name: string };
type Employee = {
  full_name: string;
  code: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  address: string;
  department_id: number;
  position_id: number;
  salary_grade_id: number;
  hire_date: string;
  status: string;
};

const EmployeeEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [grades, setGrades] = useState<SalaryGrade[]>([]);

  const [form, setForm] = useState({
    full_name: "",
    code: "",
    gender: "male",
    dob: "",
    email: "",
    phone: "",
    address: "",
    department_id: "",
    position_id: "",
    salary_grade_id: "",
    hire_date: "",
    status: "active",
  });

  // 🔥 Fetch data thật
  useEffect(() => {
    const loadData = async () => {
      try {
        const [emp, deps, pos, grads] = await Promise.all([
          apiGet<Employee>(`/employees/${id}`),
          apiGet<Department[]>("/departments"),
          apiGet<Position[]>("/positions"),
          apiGet<SalaryGrade[]>("/salary-grades"),
        ]);

        // Fill form bằng dữ liệu từ backend
        setForm({
          full_name: emp.full_name,
          code: emp.code,
          gender: emp.gender,
          dob: emp.dob || "",
          email: emp.email || "",
          phone: emp.phone || "",
          address: emp.address || "",
          department_id: emp.department_id ? String(emp.department_id) : "",
          position_id: emp.position_id ? String(emp.position_id) : "",
          salary_grade_id: emp.salary_grade_id
            ? String(emp.salary_grade_id)
            : "",
          hire_date: emp.hire_date || "",
          status: emp.status,
        });

        setDepartments(deps);
        setPositions(pos);
        setGrades(grads);
      } catch (err) {
        console.error(err);
        setError("Không thể tải dữ liệu nhân viên.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // handle change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        full_name: form.full_name,
        code: form.code,
        gender: form.gender,
        dob: form.dob || null,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
        department_id: form.department_id ? Number(form.department_id) : null,
        position_id: form.position_id ? Number(form.position_id) : null,
        salary_grade_id: form.salary_grade_id
          ? Number(form.salary_grade_id)
          : null,
        hire_date: form.hire_date || null,
        status: form.status,
      };

      await apiPut(`/employees/${id}`, payload);

      alert("Cập nhật thành công!");
      navigate(`/employees/${id}`);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi cập nhật nhân viên!");
    }
  };

  if (loading) return <p className="m-3">Đang tải...</p>;
  if (error)
    return (
      <div className="alert alert-danger m-3">
        {error}
        <button
          className="btn btn-secondary mt-2"
          onClick={() => navigate("/employees")}
        >
          Quay lại
        </button>
      </div>
    );

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa nhân viên</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        <h5 className="fw-bold">Thông tin cơ bản</h5>

        <div className="row mt-3 g-3">
          <div className="col-md-6">
            <label className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Mã nhân viên</label>
            <input
              type="text"
              className="form-control"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Giới tính</label>
            <select
              className="form-select"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Ngày sinh</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={form.dob}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Ngày vào làm</label>
            <input
              type="date"
              className="form-control"
              name="hire_date"
              value={form.hire_date}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Địa chỉ</label>
            <textarea
              className="form-control"
              name="address"
              rows={2}
              value={form.address}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        <hr className="my-4" />

        <h5 className="fw-bold">Thông tin công việc</h5>

        <div className="row mt-3 g-3">
          <div className="col-md-4">
            <label className="form-label">Phòng ban</label>
            <select
              className="form-select"
              name="department_id"
              value={form.department_id}
              onChange={handleChange}
            >
              <option value="">-- Chọn phòng ban --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Chức vụ</label>
            <select
              className="form-select"
              name="position_id"
              value={form.position_id}
              onChange={handleChange}
            >
              <option value="">-- Chọn chức vụ --</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Bậc lương</label>
            <select
              className="form-select"
              name="salary_grade_id"
              value={form.salary_grade_id}
              onChange={handleChange}
            >
              <option value="">-- Chọn bậc lương --</option>
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.grade_name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Trạng thái</label>
            <select
              className="form-select"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">Đang làm</option>
              <option value="inactive">Ngừng làm</option>
              <option value="leave">Nghỉ phép dài hạn</option>
            </select>
          </div>
        </div>

        <div className="mt-4 d-flex gap-3">
          <button className="btn btn-primary px-4" type="submit">
            Cập nhật
          </button>

          <button
            className="btn btn-secondary px-4"
            type="button"
            onClick={() => navigate("/employees")}
          >
            Huỷ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeEdit;
