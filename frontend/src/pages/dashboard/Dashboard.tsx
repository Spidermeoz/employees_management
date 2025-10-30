import { Users2, UserCheck, UserX, Building2 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// ✅ Đăng ký chart.js modules (bắt buộc)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  // 📊 Mock thống kê tổng quan
  const stats = {
    totalEmployees: 45,
    activeEmployees: 38,
    inactiveEmployees: 7,
    totalDepartments: 4,
  };

  // 📈 Mock dữ liệu biểu đồ
  const chartData = {
    labels: ["IT", "HR", "Finance", "Marketing"],
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: [15, 10, 8, 12],
        backgroundColor: "#2563eb", // Tailwind blue-600
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 2 },
        grid: { color: "#e2e8f0" }, // Tailwind slate-200
      },
      x: {
        grid: { display: false },
      },
    },
  };

  // 💡 Các thẻ thống kê nhanh
  const cards = [
    {
      title: "Tổng nhân viên",
      value: stats.totalEmployees,
      icon: Users2,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Đang hoạt động",
      value: stats.activeEmployees,
      icon: UserCheck,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Tạm nghỉ việc",
      value: stats.inactiveEmployees,
      icon: UserX,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Phòng ban",
      value: stats.totalDepartments,
      icon: Building2,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Tiêu đề */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          Bảng điều khiển
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Tổng quan nhanh về nhân sự và phòng ban trong hệ thống
        </p>
      </div>

      {/* Các thẻ thống kê */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div>
                <p className="text-sm text-slate-500">{card.title}</p>
                <p className="mt-1 text-2xl font-semibold text-slate-800">
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Biểu đồ nhân viên theo phòng ban */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-slate-800">
            Số lượng nhân viên theo phòng ban
          </h2>
        </div>
        <Bar data={chartData} options={chartOptions} height={100} />
      </div>

      {/* Gợi ý thêm các chỉ số khác */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
        <p className="mb-2 font-medium text-slate-700">Gợi ý mở rộng:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Thêm thống kê nhân viên theo giới tính hoặc độ tuổi</li>
          <li>Thêm biểu đồ tỷ lệ nhân viên đang hoạt động</li>
          <li>Hiển thị biểu đồ xu hướng nhân sự theo thời gian</li>
        </ul>
      </div>
    </div>
  );
}
