import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";
import {
  FaClock,
  FaEdit,
  FaArrowLeft,
  FaUser,
  FaCalendarAlt,
  FaSignOutAlt,
} from "react-icons/fa";

type Timesheet = {
  id: number;
  employee_id: number;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  working_hours?: number | string | null;
};

type Employee = {
  id: number;
  full_name: string;
};

const TimesheetDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [timesheet, setTimesheet] = useState<Timesheet | null>(null);
  const [employeeName, setEmployeeName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const ts = await apiGet<Timesheet>(`/timesheets/${id}`);
        setTimesheet(ts);

        const emp = await apiGet<Employee>(`/employees/${ts.employee_id}`);
        setEmployeeName(emp.full_name);
      } catch (err) {
        console.error(err);
        alert("Không tải được dữ liệu chấm công.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;
  if (!timesheet)
    return <p className="m-3 text-danger">Không tìm thấy dữ liệu.</p>;

  const isLate = timesheet.check_in && timesheet.check_in > "08:15";

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaClock className="me-2" />
            Chi tiết chấm công
          </h3>
        </div>
        <div className="card-body">
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="fw-bold mb-1">
                {employeeName} - {timesheet.date}
              </h4>
              <p className="mb-0 text-muted">Mã chấm công: #{timesheet.id}</p>
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
                    <strong>Mã nhân viên:</strong> #{timesheet.employee_id}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="fw-bold mb-3">
                    <FaCalendarAlt className="me-2" />
                    Thời gian làm việc
                  </h5>
                  <p className="mb-1">
                    <strong>Ngày:</strong> {timesheet.date}
                  </p>
                  <p className="mb-1">
                    <strong>Giờ check-in:</strong> {timesheet.check_in || "—"}
                  </p>
                  <p className="mb-1">
                    <strong>Giờ check-out:</strong> {timesheet.check_out || "—"}
                  </p>
                  <p className="mb-0">
                    <strong>Số giờ làm:</strong>{" "}
                    <span className="fw-bold text-primary">
                      {timesheet.working_hours ?? "—"} giờ
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <FaSignOutAlt className="me-2" />
                Trạng thái
              </h5>
              <p className="mb-0">
                {timesheet.check_in ? (
                  isLate ? (
                    <span className="badge bg-danger fs-6">Đi trễ</span>
                  ) : (
                    <span className="badge bg-success fs-6">Đúng giờ</span>
                  )
                ) : (
                  <span className="badge bg-secondary fs-6">Chưa check-in</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button
              className="btn btn-warning px-4"
              onClick={() => navigate(`/timesheets/${timesheet.id}/edit`)}
            >
              <FaEdit className="me-1" /> Sửa
            </button>
            <button
              className="btn btn-secondary px-4"
              onClick={() => navigate("/timesheets")}
            >
              <FaArrowLeft className="me-1" /> Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetDetail;
