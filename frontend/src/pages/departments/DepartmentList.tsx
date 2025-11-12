import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Pencil, Trash2, Phone, Mail } from "lucide-react";
import departmentsData from "../../mock/departments.json";
import { useNavigate } from "react-router-dom";

interface Department {
  id: number;
  name: string;
  description?: string;
  manager_name?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export default function DepartmentList() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState("");

  // Nạp dữ liệu giả lập (sau này thay bằng API call)
  useEffect(() => {
    setDepartments(departmentsData as Department[]);
  }, []);

  // Bộ lọc theo từ khóa
  const filtered = useMemo(() => {
    return departments.filter((d) =>
      d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [departments, search]);

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa phòng ban này không?")) {
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      // Sau này: await axios.delete(`/api/departments/${id}`)
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold text-slate-800">
          Danh sách phòng ban
        </h1>

        <button
          onClick={() => navigate("/app/departments/new")}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> Thêm phòng ban
        </button>
      </div>

      {/* Ô tìm kiếm */}
      <div className="flex items-center gap-2 rounded-2xl border bg-white p-4 shadow-sm">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm phòng ban..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-4 py-3 font-medium">Tên phòng ban</th>
              <th className="px-4 py-3 font-medium">Trưởng phòng</th>
              <th className="px-4 py-3 font-medium">Liên hệ</th>
              <th className="px-4 py-3 font-medium">Mô tả</th>
              <th className="px-4 py-3 font-medium">Ngày tạo</th>
              <th className="px-4 py-3 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  Không có phòng ban nào phù hợp.
                </td>
              </tr>
            )}
            {filtered.map((dep) => (
              <tr
                key={dep.id}
                className="border-t hover:bg-slate-50 transition-colors"
              >
                {/* Tên phòng ban */}
                <td className="px-4 py-3 font-medium text-slate-800">
                  {dep.name}
                </td>

                {/* Trưởng phòng */}
                <td className="px-4 py-3 text-slate-700">
                  {dep.manager_name || "—"}
                </td>

                {/* Liên hệ */}
                <td className="px-4 py-3 text-slate-600">
                  {dep.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-slate-400" />
                      {dep.phone}
                    </div>
                  )}
                  {dep.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-slate-400" />
                      {dep.email}
                    </div>
                  )}
                  {!dep.phone && !dep.email && "—"}
                </td>

                {/* Mô tả */}
                <td className="px-4 py-3 text-slate-600">
                  {dep.description || "—"}
                </td>

                {/* Ngày tạo */}
                <td className="px-4 py-3 text-slate-500">
                  {dep.created_at
                    ? new Date(dep.created_at).toLocaleDateString("vi-VN")
                    : "—"}
                </td>

                {/* Hành động */}
                <td className="px-4 py-3 text-right space-x-1">
                  <button
                    onClick={() => navigate(`/app/departments/${dep.id}/edit`)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
                    title="Chỉnh sửa"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dep.id)}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                    title="Xóa"
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
