import React, { useEffect, useState, useRef } from "react";
import { apiGet } from "../../api/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaUsers,
  FaBuilding,
  FaFileContract,
  FaMoneyBillWave,
  FaChartPie,
  FaChartBar,
} from "react-icons/fa";
// Import tệp CSS mới
import "./DashboardPage.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const CHART_COLORS = {
  primary: "#0d6efd",
  success: "#198754",
  danger: "#dc3545",
  warning: "#ffc107",
  info: "#0dcaf0",
  secondary: "#6c757d",
};

const DashboardPage: React.FC = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);
  const [totalContracts, setTotalContracts] = useState(0);
  const [totalPayrolls, setTotalPayrolls] = useState(0);

  const [statusStats, setStatusStats] = useState({
    active: 0,
    inactive: 0,
  });

  const [empDeptData, setEmpDeptData] = useState<
    { department: string; count: number }[]
  >([]);

  const [loading, setLoading] = useState(true);
  const barChartRef = useRef<ChartJS<"bar">>(null);

  // ✅ SỬA LỖI 1: Đưa hàm createGradient lên trước khi sử dụng
  const createGradient = (ctx: any, chartArea: any) => {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0, "rgba(13, 110, 253, 0.5)");
    gradient.addColorStop(1, "rgba(13, 110, 253, 1)");
    return gradient;
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const employees = await apiGet<any[]>("/employees");
        const departments = await apiGet<any[]>("/departments");
        const contracts = await apiGet<any[]>("/contracts");
        const payrolls = await apiGet<any[]>("/payrolls");

        setTotalEmployees(employees.length);
        setTotalDepartments(departments.length);
        setTotalContracts(contracts.length);
        setTotalPayrolls(payrolls.length);

        const statusCount = { active: 0, inactive: 0 };
        employees.forEach((e) => {
          if (e.status === "active") {
            statusCount.active++;
          } else {
            statusCount.inactive++;
          }
        });
        setStatusStats(statusCount);

        const depMap: Record<string, number> = {};
        employees.forEach((emp) => {
          const dep = emp.department?.name || "Chưa phân phòng";
          depMap[dep] = (depMap[dep] || 0) + 1;
        });

        const deptChartData = Object.entries(depMap).map(
          ([department, count]) => ({
            department,
            count,
          })
        );
        setEmpDeptData(deptChartData);
      } catch (err) {
        console.error("Lỗi load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  const pieData = {
    labels: ["Đang làm", "Nghỉ làm"],
    datasets: [
      {
        label: "Số lượng",
        data: [statusStats.active, statusStats.inactive],
        backgroundColor: [CHART_COLORS.success, CHART_COLORS.danger],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  const barData = {
    labels: empDeptData.map((d) => d.department),
    datasets: [
      {
        label: "Số nhân viên",
        data: empDeptData.map((d) => d.count),
        backgroundColor: barChartRef.current
          ? createGradient(
              barChartRef.current.ctx,
              barChartRef.current.chartArea
            )
          : CHART_COLORS.primary,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="container-fluid p-4 bg-body-secondary">
      <div className="d-flex align-items-center mb-4">
        <FaChartBar className="me-2" size={32} color={CHART_COLORS.primary} />
        <h2 className="fw-bold mb-0">Dashboard Quản Lý Nhân Sự</h2>
      </div>

      {/* CARDS SUMMARY */}
      <div className="row g-4 mb-4">
        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 summary-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="icon-box bg-primary bg-opacity-10 text-primary">
                    <FaUsers size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1">Tổng Nhân viên</p>
                  <h3 className="fw-bold mb-0">{totalEmployees}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 summary-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="icon-box bg-success bg-opacity-10 text-success">
                    <FaBuilding size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1">Phòng ban</p>
                  <h3 className="fw-bold mb-0">{totalDepartments}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 summary-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="icon-box bg-warning bg-opacity-10 text-warning">
                    <FaFileContract size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1">Hợp đồng</p>
                  <h3 className="fw-bold mb-0">{totalContracts}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6">
          <div className="card shadow-sm border-0 h-100 summary-card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  <div className="icon-box bg-danger bg-opacity-10 text-danger">
                    <FaMoneyBillWave size={24} />
                  </div>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-muted mb-1">Bảng lương</p>
                  <h3 className="fw-bold mb-0">{totalPayrolls}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="row g-4">
        {/* PIE CHART - Employee Status */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FaChartPie className="me-2" color={CHART_COLORS.primary} />
                <h5 className="fw-bold mb-0">Tỷ lệ trạng thái nhân viên</h5>
              </div>
              <div style={{ height: "220px" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* BAR CHART - Employees by Department */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <FaChartBar className="me-2" color={CHART_COLORS.primary} />
                <h5 className="fw-bold mb-0">Số nhân viên theo phòng ban</h5>
              </div>
              <div style={{ height: "220px" }}>
                <Bar ref={barChartRef} data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ SỬA LỖI 2: Xóa bỏ khối style jsx */}
    </div>
  );
};

export default DashboardPage;
