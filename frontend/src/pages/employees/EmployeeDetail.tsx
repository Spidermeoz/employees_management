import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

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

  // 🔥 Fetch tất cả dữ liệu liên quan đến nhân viên
  useEffect(() => {
    const load = async () => {
      try {
        const empData = await apiGet<any>(`/employees/${id}`);
        const contractData = await apiGet<any[]>(`/contracts?employee_id=${id}`);
        const timesheetData = await apiGet<any[]>(`/timesheets?employee_id=${id}`);
        const rewardData = await apiGet<any[]>(`/rewards?employee_id=${id}`);
        const payrollData = await apiGet<any[]>(`/payrolls?employee_id=${id}`);

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

  if (loading) return <p className="m-3">Đang tải...</p>;
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

  return (
    <div className="container-fluid">
      {/* TOP INFO */}
      <div className="card p-4 shadow-sm border-0 mb-4">
        <div className="d-flex align-items-center gap-4">
          <img
            src={
              employee.avatar ||
              "https://via.placeholder.com/120x120.png?text=Avatar"
            }
            alt="avatar"
            width="120"
            className="rounded-circle border"
          />

          <div>
            <h3 className="fw-bold mb-1">
              {employee.full_name} ({employee.code})
            </h3>
            <p className="mb-1 text-muted">
              {employee.department?.name || "—"} -{" "}
              {employee.position?.name || "—"}
            </p>

            <span
              className={
                employee.status === "active"
                  ? "badge bg-success"
                  : "badge bg-secondary"
              }
            >
              {employee.status === "active" ? "Đang làm" : "Nghỉ việc"}
            </span>
          </div>

          <div className="ms-auto">
            <button
              className="btn btn-warning me-2"
              onClick={() => navigate(`/employees/${id}/edit`)}
            >
              ✏ Sửa
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/employees")}
            >
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
                <p>
                  <strong>Họ tên:</strong> {employee.full_name}
                </p>
                <p>
                  <strong>Giới tính:</strong> {employee.gender}
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {employee.dob || "—"}
                </p>
              </div>

              <div className="col-md-4">
                <p>
                  <strong>Số điện thoại:</strong> {employee.phone || "—"}
                </p>
                <p>
                  <strong>Email:</strong> {employee.email || "—"}
                </p>
              </div>

              <div className="col-md-4">
                <p>
                  <strong>Địa chỉ:</strong> {employee.address || "—"}
                </p>
              </div>
            </div>

            <h5 className="fw-bold mb-3">Thông tin công việc</h5>
            <div className="row">
              <div className="col-md-4">
                <p>
                  <strong>Phòng ban:</strong> {employee.department?.name || "—"}
                </p>
                <p>
                  <strong>Chức vụ:</strong> {employee.position?.name || "—"}
                </p>
              </div>
              <div className="col-md-4">
                <p>
                  <strong>Bậc lương:</strong>{" "}
                  {employee.salary_grade?.grade_name || "—"}
                </p>
              </div>
              <div className="col-md-4">
                <p>
                  <strong>Ngày vào làm:</strong> {employee.hire_date || "—"}
                </p>
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
                    <td colSpan={3} className="text-center text-muted">
                      Chưa có hợp đồng nào.
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
                    <td colSpan={4} className="text-center text-muted">
                      Chưa có dữ liệu chấm công.
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
                    <td colSpan={4} className="text-center text-muted">
                      Chưa có thưởng / phạt.
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
                    <td colSpan={6} className="text-center text-muted">
                      Chưa có bảng lương.
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
