import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";
import {
  FaUser,
  FaBriefcase,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEdit,
  FaArrowLeft,
  FaInfoCircle,
  FaFileContract,
  FaClock,
  FaGift,
  FaInbox,
} from "react-icons/fa";

// Lưu ý: Trong một dự án thực tế, bạn nên định nghĩa các interface TypeScript
// để thay thế cho kiểu `any`, giúp mã nguồn dễ bảo trì và ít lỗi hơn.
// type Employee = { ... };
// type Contract = { ... };
// ...

const EmployeeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");

  const [employee, setEmployee] = useState<any>(null);
  const [contracts, setContracts] = useState<any[]>([]);
  const [timesheets, setTimesheets] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [payroll, setPayroll] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [empData, contractData, timesheetData, rewardData, payrollData] =
          await Promise.all([
            apiGet<any>(`/employees/${id}`),
            apiGet<any[]>(`/contracts?employee_id=${id}`),
            apiGet<any[]>(`/timesheets?employee_id=${id}`),
            apiGet<any[]>(`/rewards?employee_id=${id}`),
            apiGet<any[]>(`/payrolls?employee_id=${id}`),
          ]);

        setEmployee(empData);
        setContracts(contractData);
        setTimesheets(timesheetData);
        setRewards(rewardData);
        setPayroll(payrollData);
      } catch (e) {
        console.error(e);
        setErr("Không thể tải dữ liệu nhân viên.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) return <p className="m-3 text-center">Đang tải...</p>;
  if (err)
    return (
      <div className="alert alert-danger m-3">
        {err}
        <br />
        <button
          className="btn btn-secondary mt-2"
          onClick={() => navigate("/employees")}
        >
          Quay lại danh sách
        </button>
      </div>
    );

  const defaultAvatar = "https://via.placeholder.com/150x150.png?text=Avatar";

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      {/* TOP INFO CARD */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-auto">
              <img
                src={employee.avatar || defaultAvatar}
                alt="avatar"
                className="rounded-circle border"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            </div>
            <div className="col">
              <h3 className="fw-bold mb-1">
                {employee.full_name} ({employee.code})
              </h3>
              <p className="mb-1 text-muted">
                {employee.department?.name || "—"} -{" "}
                {employee.position?.name || "—"}
              </p>
              <span
                className={`badge ${
                  employee.status === "active" ? "bg-success" : "bg-secondary"
                }`}
              >
                {employee.status === "active" ? "Đang làm" : "Nghỉ việc"}
              </span>
            </div>
            <div className="col-auto">
              <button
                className="btn btn-warning me-2"
                onClick={() => navigate(`/employees/${id}/edit`)}
              >
                <FaEdit className="me-1" /> Sửa
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/employees")}
              >
                <FaArrowLeft className="me-1" /> Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs shadow-sm">
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "overview" ? "active" : ""}`}
            onClick={() => setTab("overview")}
          >
            <FaInfoCircle className="me-1" /> Tổng quan
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "contracts" ? "active" : ""}`}
            onClick={() => setTab("contracts")}
          >
            <FaFileContract className="me-1" /> Hợp đồng
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "timesheets" ? "active" : ""}`}
            onClick={() => setTab("timesheets")}
          >
            <FaClock className="me-1" /> Chấm công
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "rewards" ? "active" : ""}`}
            onClick={() => setTab("rewards")}
          >
            <FaGift className="me-1" /> Thưởng / phạt
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${tab === "payroll" ? "active" : ""}`}
            onClick={() => setTab("payroll")}
          >
            <FaMoneyBillWave className="me-1" /> Bảng lương
          </button>
        </li>
      </ul>

      <div className="card border-0 shadow-sm p-4 mt-3">
        {/* TAB 1: OVERVIEW */}
        {tab === "overview" && (
          <>
            <div className="row">
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h5 className="fw-bold mb-0">
                      <FaUser className="me-2" />
                      Thông tin cá nhân
                    </h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Họ tên:</strong> {employee.full_name}
                    </p>
                    <p>
                      <strong>Giới tính:</strong> {employee.gender}
                    </p>
                    <p>
                      <strong>Ngày sinh:</strong> {employee.dob || "—"}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {employee.phone || "—"}
                    </p>
                    <p>
                      <strong>Email:</strong> {employee.email || "—"}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {employee.address || "—"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card mb-3">
                  <div className="card-header bg-light">
                    <h5 className="fw-bold mb-0">
                      <FaBriefcase className="me-2" />
                      Thông tin công việc
                    </h5>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Phòng ban:</strong>{" "}
                      {employee.department?.name || "—"}
                    </p>
                    <p>
                      <strong>Chức vụ:</strong> {employee.position?.name || "—"}
                    </p>
                    <p>
                      <strong>Bậc lương:</strong>{" "}
                      {employee.salary_grade?.grade_name || "—"}
                    </p>
                    <p>
                      <strong>Ngày vào làm:</strong> {employee.hire_date || "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: CONTRACTS */}
        {tab === "contracts" && (
          <>
            <h5 className="fw-bold mb-3">Hợp đồng lao động</h5>
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Loại hợp đồng</th>
                  <th>Bắt đầu</th>
                  <th>Kết thúc</th>
                </tr>
              </thead>
              <tbody>
                {contracts.length > 0 ? (
                  contracts.map((c: any) => (
                    <tr key={c.id}>
                      <td>{c.contract_type}</td>
                      <td>{c.start_date}</td>
                      <td className="text-danger fw-bold">
                        {c.end_date || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center text-muted py-4">
                      <FaInbox className="me-2" /> Chưa có hợp đồng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* TAB 3: TIMESHEETS */}
        {tab === "timesheets" && (
          <>
            <h5 className="fw-bold mb-3">Chấm công</h5>
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Ngày</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Số giờ</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.length > 0 ? (
                  timesheets.map((t: any) => (
                    <tr key={t.id}>
                      <td>{t.date}</td>
                      <td>{t.check_in || "—"}</td>
                      <td>{t.check_out || "—"}</td>
                      <td>{t.working_hours || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      <FaInbox className="me-2" /> Chưa có dữ liệu chấm công.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* TAB 4: REWARDS */}
        {tab === "rewards" && (
          <>
            <h5 className="fw-bold mb-3">Thưởng / Kỷ luật</h5>
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Loại</th>
                  <th>Tiêu đề</th>
                  <th>Số tiền</th>
                  <th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                {rewards.length > 0 ? (
                  rewards.map((r: any) => (
                    <tr key={r.id}>
                      <td>
                        {r.type === "reward" ? (
                          <span className="badge bg-success">Thưởng</span>
                        ) : (
                          <span className="badge bg-danger">Kỷ luật</span>
                        )}
                      </td>
                      <td>{r.title}</td>
                      <td>{Number(r.amount).toLocaleString("vi-VN")}₫</td>
                      <td>{r.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center text-muted py-4">
                      <FaInbox className="me-2" /> Chưa có thưởng / phạt.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {/* TAB 5: PAYROLL */}
        {tab === "payroll" && (
          <>
            <h5 className="fw-bold mb-3">Bảng lương</h5>
            <table className="table table-hover table-bordered">
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
                {payroll.length > 0 ? (
                  payroll.map((p: any) => (
                    <tr key={p.id}>
                      <td>
                        {p.month}/{p.year}
                      </td>
                      <td>{Number(p.base_salary).toLocaleString("vi-VN")}₫</td>
                      <td>{Number(p.allowance).toLocaleString("vi-VN")}₫</td>
                      <td>{Number(p.bonus).toLocaleString("vi-VN")}₫</td>
                      <td>{Number(p.penalty).toLocaleString("vi-VN")}₫</td>
                      <td className="fw-bold text-primary">
                        {Number(p.total_salary).toLocaleString("vi-VN")}₫
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      <FaInbox className="me-2" /> Chưa có bảng lương.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;
