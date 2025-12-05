import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// MOCK EMPLOYEE
const mockEmployee = {
  id: 1,
  code: "NV001",
  name: "Nguyễn Văn A",
  gender: "male",
  dob: "1995-03-12",
  email: "vana@example.com",
  phone: "0901234567",
  address: "Quận 1, TPHCM",
  avatar: "",
  department: "Phòng IT",
  position: "Developer",
  salary_grade: "Bậc 2",
  hire_date: "2020-01-15",
  status: "active",
};

// MOCK CONTRACTS
const mockContracts = [
  {
    id: 1,
    type: "HĐ Lao động 1 năm",
    start: "2023-01-01",
    end: "2024-01-01",
  },
];

// MOCK TIMESHEETS
const mockTimesheets = [
  { date: "2025-02-01", check_in: "08:00", check_out: "17:00", hours: 8 },
  { date: "2025-02-02", check_in: "08:30", check_out: "17:30", hours: 8 },
];

// MOCK REWARDS
const mockRewards = [
  { id: 1, type: "reward", title: "Thưởng Tết", amount: 2000000, date: "2024-12-28" },
  { id: 2, type: "discipline", title: "Đi trễ", amount: -200000, date: "2024-11-20" },
];

// MOCK PAYROLL
const mockPayroll = [
  {
    id: 1,
    month: 1,
    year: 2025,
    base_salary: 8000000,
    allowance: 1500000,
    bonus: 2000000,
    penalty: 200000,
    total: 11300000,
  },
];

const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");

  return (
    <div className="container-fluid">
      {/* TOP INFO */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <div className="d-flex align-items-center gap-4">
          <img
            src={
              mockEmployee.avatar ||
              "https://via.placeholder.com/120x120.png?text=Avatar"
            }
            alt="avatar"
            width="120"
            className="rounded-circle border"
          />

          <div>
            <h3 className="fw-bold mb-1">
              {mockEmployee.name} ({mockEmployee.code})
            </h3>
            <p className="mb-1 text-muted">
              {mockEmployee.department} - {mockEmployee.position}
            </p>

            <span
              className={
                mockEmployee.status === "active"
                  ? "badge bg-success"
                  : "badge bg-secondary"
              }
            >
              {mockEmployee.status === "active" ? "Đang làm" : "Nghỉ việc"}
            </span>
          </div>

          <div className="ms-auto">
            <button
              className="btn btn-warning me-2"
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              ✏ Sửa
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/employees")}>
              ↩ Quay lại
            </button>
          </div>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            Tổng quan
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "contracts" ? "active" : ""}`}
            onClick={() => setTab("contracts")}
          >
            Hợp đồng
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "timesheets" ? "active" : ""}`}
            onClick={() => setTab("timesheets")}
          >
            Chấm công
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "rewards" ? "active" : ""}`}
            onClick={() => setTab("rewards")}
          >
            Thưởng / phạt
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${tab === "payroll" ? "active" : ""}`}
            onClick={() => setTab("payroll")}
          >
            Bảng lương
          </button>
        </li>
      </ul>

      <div className="card border-0 shadow-sm p-4 mt-3">
        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <>
            <h5 className="fw-bold mb-3">Thông tin cá nhân</h5>

            <div className="row mb-4">
              <div className="col-md-4">
                <p><strong>Họ tên:</strong> {mockEmployee.name}</p>
                <p><strong>Giới tính:</strong> {mockEmployee.gender}</p>
                <p><strong>Ngày sinh:</strong> {mockEmployee.dob}</p>
              </div>

              <div className="col-md-4">
                <p><strong>Số điện thoại:</strong> {mockEmployee.phone}</p>
                <p><strong>Email:</strong> {mockEmployee.email}</p>
              </div>

              <div className="col-md-4">
                <p><strong>Địa chỉ:</strong> {mockEmployee.address}</p>
              </div>
            </div>

            <h5 className="fw-bold mb-3">Thông tin công việc</h5>

            <div className="row">
              <div className="col-md-4">
                <p><strong>Phòng ban:</strong> {mockEmployee.department}</p>
                <p><strong>Chức vụ:</strong> {mockEmployee.position}</p>
              </div>
              <div className="col-md-4">
                <p><strong>Bậc lương:</strong> {mockEmployee.salary_grade}</p>
              </div>
              <div className="col-md-4">
                <p><strong>Ngày vào làm:</strong> {mockEmployee.hire_date}</p>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CONTRACTS */}
        {tab === "contracts" && (
          <>
            <h5 className="fw-bold mb-3">Hợp đồng lao động</h5>

            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Loại hợp đồng</th>
                  <th>Bắt đầu</th>
                  <th>Kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {mockContracts.map((c) => (
                  <tr key={c.id}>
                    <td>{c.type}</td>
                    <td>{c.start}</td>
                    <td className="text-danger fw-bold">{c.end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* TAB 3: TIMESHEETS */}
        {tab === "timesheets" && (
          <>
            <h5 className="fw-bold mb-3">Chấm công</h5>

            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>Ngày</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Số giờ</th>
                </tr>
              </thead>
              <tbody>
                {mockTimesheets.map((t, index) => (
                  <tr key={index}>
                    <td>{t.date}</td>
                    <td>{t.check_in}</td>
                    <td>{t.check_out}</td>
                    <td>{t.hours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* TAB 4: REWARDS */}
        {tab === "rewards" && (
          <>
            <h5 className="fw-bold mb-3">Thưởng / Kỷ luật</h5>

            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Loại</th>
                  <th>Tiêu đề</th>
                  <th>Số tiền</th>
                  <th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                {mockRewards.map((r) => (
                  <tr key={r.id}>
                    <td>
                      {r.type === "reward" ? (
                        <span className="badge bg-success">Thưởng</span>
                      ) : (
                        <span className="badge bg-danger">Kỷ luật</span>
                      )}
                    </td>
                    <td>{r.title}</td>
                    <td>{r.amount.toLocaleString("vi-VN")}₫</td>
                    <td>{r.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* TAB 5: PAYROLL */}
        {tab === "payroll" && (
          <>
            <h5 className="fw-bold mb-3">Bảng lương</h5>

            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Tháng</th>
                  <th>Lương cơ bản</th>
                  <th>Phụ cấp</th>
                  <th>Thưởng</th>
                  <th>Phạt</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {mockPayroll.map((p) => (
                  <tr key={p.id}>
                    <td>{p.month}/{p.year}</td>
                    <td>{p.base_salary.toLocaleString("vi-VN")}₫</td>
                    <td>{p.allowance.toLocaleString("vi-VN")}₫</td>
                    <td>{p.bonus.toLocaleString("vi-VN")}₫</td>
                    <td>{p.penalty.toLocaleString("vi-VN")}₫</td>
                    <td className="fw-bold text-primary">{p.total.toLocaleString("vi-VN")}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
};

export default EmployeeDetail;
