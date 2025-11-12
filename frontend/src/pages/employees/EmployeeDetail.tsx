import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  UserCircle2,
  MapPin,
  IdCard,
  GraduationCap,
} from "lucide-react";
import employeesData from "../../mock/employees.json";

interface Department {
  id: number;
  name: string;
}

interface Position {
  id: number;
  name: string;
}

interface Education {
  id: number;
  level: string;
  major?: string;
  university?: string;
}

interface Employee {
  id: number;
  code: string;
  full_name: string;
  gender: string;
  date_of_birth?: string;
  address?: string;
  hometown?: string;
  phone?: string;
  email: string;
  citizen_id?: string;
  status: string;
  avatar_url?: string;
  hired_at?: string;
  department?: Department;
  position?: Position;
  education?: Education;
  created_at?: string;
}

export default function EmployeeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    // Giả lập dữ liệu (sau này thay bằng API call)
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

      {/* Nội dung */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột trái */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            {employee.avatar_url ? (
              <img
                src={employee.avatar_url}
                alt={employee.full_name}
                className="h-24 w-24 rounded-full object-cover border"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                <UserCircle2 className="h-12 w-12 text-slate-400" />
              </div>
            )}

            <h2 className="mt-3 text-lg font-semibold text-slate-800">
              {employee.full_name}
            </h2>
            <p className="text-sm text-slate-500">
              {employee.position?.name || "Chưa có chức vụ"}
            </p>
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

          {/* Liên hệ */}
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
              <span>{employee.department?.name || "Chưa có phòng ban"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>
                Ngày vào công ty:{" "}
                {employee.hired_at
                  ? new Date(employee.hired_at).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </span>
            </div>
          </div>
        </div>

        {/* Cột phải */}
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
              <span className="font-medium text-slate-500">Ngày sinh:</span>
              <p className="mt-1">
                {employee.date_of_birth
                  ? new Date(employee.date_of_birth).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật"}
              </p>
            </div>
            <div>
              <span className="font-medium text-slate-500">CMND/CCCD:</span>
              <div className="flex items-center gap-2 mt-1">
                <IdCard className="h-4 w-4 text-slate-400" />
                <p>{employee.citizen_id || "Chưa cập nhật"}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-slate-500">Địa chỉ:</span>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-slate-400" />
                <p>{employee.address || "Chưa cập nhật"}</p>
              </div>
            </div>
            <div>
              <span className="font-medium text-slate-500">Quê quán:</span>
              <p className="mt-1">{employee.hometown || "Chưa cập nhật"}</p>
            </div>
            <div>
              <span className="font-medium text-slate-500">
                Trình độ học vấn:
              </span>
              <div className="flex items-center gap-2 mt-1">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <p>
                  {employee.education?.level
                    ? `${employee.education.level} - ${
                        employee.education.major || ""
                      }`
                    : "Chưa cập nhật"}
                </p>
              </div>
            </div>
            <div>
              <span className="font-medium text-slate-500">
                Ngày tạo hồ sơ:
              </span>
              <p className="mt-1">
                {employee.created_at
                  ? new Date(employee.created_at).toLocaleDateString("vi-VN")
                  : "Không xác định"}
              </p>
            </div>
          </div>

          <div className="mt-8 text-sm text-slate-500">
            <p>
              <span className="font-semibold text-slate-700">Ghi chú:</span> Đây
              là trang xem chi tiết nhân viên. Sau này bạn có thể mở rộng để
              hiển thị hợp đồng, bảo hiểm hoặc lịch sử công tác.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
