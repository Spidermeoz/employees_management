import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";
import {
  FaMoneyBillWave,
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaGift,
  FaExclamationTriangle,
  FaCalculator,
} from "react-icons/fa";

// Kiểu dữ liệu theo PayrollResponse
type Payroll = {
  id: number;
  employee_id: number;
  month: number;
  year: number;
  base_salary: number;
  allowance: number;
  bonus: number;
  penalty: number;
  total_salary: number;
  employee?: {
    full_name: string;
  } | null;
};

// Kiểu dữ liệu nhân viên fallback
type EmployeeMini = {
  id: number;
  full_name: string;
};

const PayrollDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // === LOAD PAYROLL DETAIL ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<Payroll>(`/payrolls/${id}`);
        setPayroll(data);

        // Nếu backend đã join employee -> dùng luôn
        if (data.employee?.full_name) {
          setEmployeeName(data.employee.full_name);
        } else {
          // FE fallback tự load employee name
          fetchEmployeeName(data.employee_id);
        }
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu bảng lương.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ===== Fallback: tự load tên nhân viên nếu backend không join =====
  const fetchEmployeeName = async (employeeId: number) => {
    try {
      const emp = await apiGet<EmployeeMini>(`/employees/${employeeId}`);
      setEmployeeName(emp.full_name);
    } catch {
      setEmployeeName(`Nhân viên #${employeeId}`);
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (!payroll)
    return <p className="m-3 text-danger">Không tìm thấy dữ liệu.</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaMoneyBillWave className="me-2" />
            Chi tiết bảng lương
          </h3>
        </div>
        <div className="card-body">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-1">
                {employeeName} - Tháng {payroll.month}/{payroll.year}
              </h4>
              <p className="mb-0 text-muted">Mã bảng lương: #{payroll.id}</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <FaUser className="me-2" />
                    Thông tin nhân viên
                  </h5>
                  <p className="mb-1">
                    <strong>Họ và tên:</strong> {employeeName}
                  </p>
                  <p className="mb-0">
                    <strong>Mã nhân viên:</strong> #{payroll.employee_id}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <FaCalendarAlt className="me-2" />
                    Kỳ lương
                  </h5>
                  <p className="mb-1">
                    <strong>Tháng:</strong> {payroll.month}
                  </p>
                  <p className="mb-0">
                    <strong>Năm:</strong> {payroll.year}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <FaCalculator className="me-2" />
                Chi tiết lương
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Lương cơ bản:</strong>{" "}
                    {payroll.base_salary.toLocaleString("vi-VN")}₫
                  </p>
                  <p className="mb-1">
                    <strong>Phụ cấp:</strong>{" "}
                    {payroll.allowance.toLocaleString("vi-VN")}₫
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong className="text-success">
                      <FaGift className="me-1" />
                      Thưởng:
                    </strong>{" "}
                    <span className="text-success">
                      {payroll.bonus.toLocaleString("vi-VN")}₫
                    </span>
                  </p>
                  <p className="mb-0">
                    <strong className="text-danger">
                      <FaExclamationTriangle className="me-1" />
                      Phạt:
                    </strong>{" "}
                    <span className="text-danger">
                      {payroll.penalty.toLocaleString("vi-VN")}₫
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <FaMoneyBillWave className="me-2" />
                Tổng lương
              </h5>
              <p className="mb-0 fs-4 fw-bold text-primary">
                {payroll.total_salary.toLocaleString("vi-VN")}₫
              </p>
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              className="btn btn-warning px-4"
              onClick={() => navigate(`/payrolls/${payroll.id}/edit`)}
            >
              <FaEdit className="me-1" /> Sửa
            </button>
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/payrolls")}
            >
              <FaArrowLeft className="me-1" /> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollDetail;
