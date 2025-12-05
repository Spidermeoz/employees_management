import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Mock data (sau này sẽ gọi API)
const mockEmployees = [
  {
    id: 1,
    code: "NV001",
    name: "Nguyễn Văn A",
    gender: "male",
    dob: "1995-03-12",
    email: "vana@example.com",
    phone: "0901234567",
    address: "Quận 1, TPHCM",
    department_id: 1,
    position_id: 2,
    salary_grade_id: 1,
    hire_date: "2020-01-15",
    status: "active",
  },
  {
    id: 2,
    code: "NV002",
    name: "Trần Thị B",
    gender: "female",
    dob: "1998-07-20",
    email: "thib@example.com",
    phone: "0934567890",
    address: "Quận 3, TPHCM",
    department_id: 2,
    position_id: 1,
    salary_grade_id: 2,
    hire_date: "2021-05-10",
    status: "active",
  },
];

// Mock dropdown data
const mockDepartments = [
  { id: 1, name: "Phòng Kế Toán" },
  { id: 2, name: "Phòng Nhân Sự" },
  { id: 3, name: "Phòng IT" },
];

const mockPositions = [
  { id: 1, name: "Nhân viên" },
  { id: 2, name: "Kế toán viên" },
  { id: 3, name: "Developer" },
];

const mockGrades = [
  { id: 1, name: "Bậc 1" },
  { id: 2, name: "Bậc 2" },
  { id: 3, name: "Bậc 3" },
];

const EmployeeEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
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

  // Lấy mock data theo ID
  useEffect(() => {
    const emp = mockEmployees.find((e) => e.id === Number(id));

    if (emp) {
      const formattedEmp = {
        name: emp.name,
        code: emp.code,
        gender: emp.gender,
        dob: emp.dob,
        email: emp.email,
        phone: emp.phone,
        address: emp.address,
        department_id: String(emp.department_id),
        position_id: String(emp.position_id),
        salary_grade_id: String(emp.salary_grade_id),
        hire_date: emp.hire_date,
        status: emp.status,
      };
      setForm(formattedEmp);
    }

    setLoading(false);
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Updated Employee:", form);
    alert("Cập nhật nhân viên (mock). API chưa kết nối.");
    navigate("/employees");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

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
              name="name"
              value={form.name}
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
              name="department_id"
              className="form-select"
              value={form.department_id}
              onChange={handleChange}
            >
              {mockDepartments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Chức vụ</label>
            <select
              name="position_id"
              className="form-select"
              value={form.position_id}
              onChange={handleChange}
            >
              {mockPositions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Bậc lương</label>
            <select
              name="salary_grade_id"
              className="form-select"
              value={form.salary_grade_id}
              onChange={handleChange}
            >
              {mockGrades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Trạng thái</label>
            <select
              name="status"
              className="form-select"
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
