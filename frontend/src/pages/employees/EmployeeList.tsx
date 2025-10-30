import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, Filter, Eye } from "lucide-react";
import employeesData from "../../mock/employees.json"; // mock data file

interface Employee {
  id: number;
  code: string;
  full_name: string;
  email: string;
  phone: string;
  gender: string;
  position: string;
  status: string;
  department: string;
  created_at: string;
}

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    setEmployees(employeesData as Employee[]);
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.full_name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.code.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || e.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [employees, search, filterStatus]);

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa nhân viên này không?")) {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold text-slate-800">
          Danh sách nhân viên
        </h1>

        <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800">
          <Plus className="h-4 w-4" /> Thêm nhân viên
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm nhân viên..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Tạm nghỉ việc</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">Mã NV</th>
              <th className="px-4 py-3 font-medium">Họ và tên</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Phòng ban</th>
              <th className="px-4 py-3 font-medium">Chức vụ</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  Không có nhân viên nào phù hợp.
                </td>
              </tr>
            )}

            {filtered.map((emp) => (
              <tr
                key={emp.id}
                className="border-t hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {emp.code}
                </td>
                <td className="px-4 py-3">{emp.full_name}</td>
                <td className="px-4 py-3">{emp.email}</td>
                <td className="px-4 py-3">{emp.department}</td>
                <td className="px-4 py-3">{emp.position}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      emp.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status === "active" ? "Hoạt động" : "Tạm nghỉ"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-1">
                  {/* 👁 Nút xem chi tiết */}
                  <button
                    onClick={() => navigate(`/app/employees/${emp.id}`)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* ✏️ Nút chỉnh sửa */}
                  <button
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  {/* 🗑 Nút xóa */}
                  <button
                    onClick={() => handleDelete(emp.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                    title="Xóa nhân viên"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
