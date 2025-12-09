import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/client";

type Department = {
  id: number;
  name: string;
};

type Position = {
  id: number;
  name: string;
};

type SalaryGrade = {
  id: number;
  grade_name: string;
};

const EmployeeCreate: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [grades, setGrades] = useState<SalaryGrade[]>([]);

  const [loading, setLoading] = useState(true);

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
    avatar: null as File | null,
  });

  // Load dữ liệu dropdown từ backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, posData, gradeData] = await Promise.all([
          apiGet<Department[]>("/departments"),
          apiGet<Position[]>("/positions"),
          apiGet<SalaryGrade[]>("/salary-grades"),
        ]);
        setDepartments(deptData);
        setPositions(posData);
        setGrades(gradeData);
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu danh sách phòng ban/chức vụ/bậc lương.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, avatar: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Vì backend chưa có upload avatar → chỉ gửi text fields
      const payload = {
        code: form.code,
        full_name: form.full_name,
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

      await apiPost("/employees", payload);

      alert("Tạo nhân viên thành công!");
      navigate("/employees");
    } catch (err: any) {
      console.error(err);
      alert("Không thể tạo nhân viên!");
    }
  };

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm nhân viên</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        {/* BASIC INFO */}
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

        {/* WORK INFO */}
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

        <hr className="my-4" />

        {/* AVATAR */}
        <h5 className="fw-bold">Ảnh đại diện</h5>
        <div className="mt-3">
          <input
            type="file"
            className="form-control"
            onChange={handleAvatarChange}
          />

          {form.avatar && (
            <img
              src={URL.createObjectURL(form.avatar)}
              alt="avatar preview"
              className="mt-3 rounded"
              width="120"
            />
          )}
        </div>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Lưu
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/employees")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;
