import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const mockStats = {
  totalEmployees: 42,
  totalDepartments: 5,
  totalSalaryMonth: 125_000_000,
};

const mockContracts = [
  {
    id: 1,
    employee: "Nguyễn Văn A",
    type: "HĐ Lao động 1 năm",
    endDate: "2025-02-10",
  },
  {
    id: 2,
    employee: "Trần Thị B",
    type: "HĐ Thời vụ",
    endDate: "2025-02-15",
  },
  {
    id: 3,
    employee: "Phạm Văn C",
    type: "HĐ Lao động 3 năm",
    endDate: "2025-03-01",
  },
];

const DashboardPage: React.FC = () => {
  return (
    <div className="container-fluid py-3">
      {/* PAGE TITLE */}
      <h3 className="fw-bold mb-4">Dashboard</h3>

      {/* STATS CARDS */}
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="text-secondary">Tổng số nhân viên</h6>
            <h3 className="fw-bold">{mockStats.totalEmployees}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="text-secondary">Số lượng phòng ban</h6>
            <h3 className="fw-bold">{mockStats.totalDepartments}</h3>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3">
            <h6 className="text-secondary">Tổng quỹ lương tháng</h6>
            <h3 className="fw-bold">
              {mockStats.totalSalaryMonth.toLocaleString("vi-VN")} ₫
            </h3>
          </div>
        </div>
      </div>

      {/* CHART MOCK */}
      <div className="card shadow-sm border-0 p-4 mt-4">
        <h5 className="mb-3 fw-bold">Biểu đồ số lượng nhân viên theo phòng ban</h5>

        {/* Mock chart block */}
        <div
          style={{
            height: "200px",
            background: "linear-gradient(135deg, #eee, #ddd)",
            borderRadius: "8px",
          }}
          className="d-flex justify-content-center align-items-center text-muted"
        >
          (Biểu đồ mock – sẽ thay bằng chart thực sau)
        </div>
      </div>

      {/* CONTRACT TABLE */}
      <div className="card shadow-sm border-0 p-4 mt-4">
        <h5 className="fw-bold mb-3">Hợp đồng sắp hết hạn</h5>

        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nhân viên</th>
              <th>Loại hợp đồng</th>
              <th>Ngày kết thúc</th>
            </tr>
          </thead>
          <tbody>
            {mockContracts.map((c) => (
              <tr key={c.id}>
                <td>{c.employee}</td>
                <td>{c.type}</td>
                <td className="text-danger fw-bold">{c.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
