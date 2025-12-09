import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet } from "../../api/client";

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

  // 🔥 Fetch timesheet + employee name
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const ts = await apiGet<Timesheet>(`/timesheets/${id}`);

        setTimesheet(ts);

        // FETCH EMPLOYEE NAME
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

  if (loading) return <p className="m-3">Đang tải dữ liệu...</p>;
  if (!timesheet)
    return <p className="m-3 text-danger">Không tìm thấy dữ liệu.</p>;

  // 🔍 Kiểm tra đúng giờ hay đi trễ
  const isLate = timesheet.check_in && timesheet.check_in > "08:15";

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chi tiết chấm công</h3>

      <div className="card p-4 shadow-sm border-0 mb-4">
        <h4 className="fw-bold mb-3">
          Chấm công ngày {timesheet.date} – {employeeName}
        </h4>

        <p>
          <strong>Ngày:</strong> {timesheet.date}
        </p>

        <p>
          <strong>Giờ check-in:</strong> {timesheet.check_in ?? "—"}
        </p>

        <p>
          <strong>Giờ check-out:</strong> {timesheet.check_out ?? "—"}
        </p>

        <p>
          <strong>Số giờ làm:</strong> {timesheet.working_hours ?? "—"} giờ
        </p>

        {/* Status */}
        <p>
          <strong>Trạng thái:</strong>{" "}
          {timesheet.check_in ? (
            isLate ? (
              <span className="badge bg-danger">Đi trễ</span>
            ) : (
              <span className="badge bg-success">Đúng giờ</span>
            )
          ) : (
            <span className="badge bg-secondary">Không có dữ liệu</span>
          )}
        </p>

        {/* ACTION BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/timesheets/${timesheet.id}/edit`)}
          >
            ✏ Sửa
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate("/timesheets")}
          >
            ↩ Quay lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimesheetDetail;
