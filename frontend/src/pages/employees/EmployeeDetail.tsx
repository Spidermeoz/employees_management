import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, Building2, UserCircle2 } from "lucide-react";
import employeesData from "../../mock/employees.json";

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

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Giả lập lấy dữ liệu từ JSON mock
    const found = (employeesData as Employee[]).find(
      (e) => e.id === Number(id)
    );
    setEmployee(found || null);
  }, [id]);

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <p>Không tìm thấy thông tin nhân viên.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          ← Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>
      </div>

      {/* Thông tin chính */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Thông tin bên trái */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
              <UserCircle2 className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="mt-3 text-lg font-semibold text-slate-800">
              {employee.full_name}
            </h2>
            <p className="text-sm text-slate-500">{employee.position}</p>
            <p
              className={`mt-2 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                employee.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {employee.status === "active" ? "Đang làm việc" : "Tạm nghỉ việc"}
            </p>
          </div>

          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span>{employee.phone || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span>{employee.department}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>
                Ngày tạo:{" "}
                {new Date(employee.created_at).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết bên phải */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Chi tiết nhân viên
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm text-slate-700">
            <div>
              <span className="font-medium text-slate-500">Mã nhân viên:</span>
              <p className="mt-1">{employee.code}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Giới tính:</span>
              <p className="mt-1 capitalize">
                {employee.gender === "male"
                  ? "Nam"
                  : employee.gender === "female"
                  ? "Nữ"
                  : "Khác"}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Chức vụ:</span>
              <p className="mt-1">{employee.position}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Phòng ban:</span>
              <p className="mt-1">{employee.department}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Trạng thái:</span>
              <p
                className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                  employee.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {employee.status === "active" ? "Đang làm việc" : "Tạm nghỉ"}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-500">Ngày vào công ty:</span>
              <p className="mt-1">
                {employee.created_at
                  ? new Date(employee.created_at).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            <p>
              <span className="font-semibold text-slate-700">Ghi chú:</span> Đây là
              bản xem chi tiết nhân viên. Sau này bạn có thể mở rộng phần này để
              hiển thị lịch sử làm việc, hoạt động, hoặc cập nhật hồ sơ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
