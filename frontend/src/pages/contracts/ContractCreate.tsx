import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/client";

// Kiểu dữ liệu cho Employee
type Employee = {
  id: number;
  full_name: string;
};

// Hàm upload file lên Cloudinary
async function uploadFileToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Upload file thất bại!");
  }

  const data = await res.json();
  return data.secure_url;
}

const ContractCreate: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employee_id: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    file: null as File | null,
    note: "",
  });

  // Lấy danh sách nhân viên thật từ backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiGet<Employee[]>("/employees");
        setEmployees(data);
      } catch {
        alert("Không thể tải danh sách nhân viên!");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let fileUrl: string | null = null;

      // 1️⃣ Upload file hợp đồng lên Cloudinary nếu có
      if (form.file) {
        fileUrl = await uploadFileToCloudinary(form.file);
        console.log("Uploaded contract file URL:", fileUrl);
      }

      // 2️⃣ Chuẩn bị payload gửi backend
      const payload = {
        employee_id: Number(form.employee_id),
        contract_type: form.contract_type,
        start_date: form.start_date,
        end_date: form.end_date || null,
        file_url: fileUrl,
        note: form.note || null,
        salary: 0, // nếu backend yêu cầu
      };

      // 3️⃣ Gửi API thật đến backend
      await apiPost("/contracts", payload);

      alert("Tạo hợp đồng thành công!");
      navigate("/contracts");
    } catch (err) {
      console.error(err);
      alert("Không thể tạo hợp đồng!");
    }
  };

  if (loading) return <p className="m-3">Đang tải danh sách nhân viên...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Thêm hợp đồng lao động</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">

        {/* Employee select */}
        <div className="mb-3">
          <label className="form-label fw-bold">Nhân viên</label>
          <select
            className="form-select"
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map((e) => (
              <option key={e.id} value={e.id}>
                {e.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Contract Type */}
        <div className="mb-3">
          <label className="form-label fw-bold">Loại hợp đồng</label>
          <input
            type="text"
            className="form-control"
            name="contract_type"
            value={form.contract_type}
            onChange={handleChange}
            placeholder="Ví dụ: HĐ Lao động 1 năm"
            required
          />
        </div>

        {/* Dates */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Ngày bắt đầu</label>
            <input
              type="date"
              className="form-control"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Ngày kết thúc</label>
            <input
              type="date"
              className="form-control"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* File Upload */}
        <div className="mt-3">
          <label className="form-label fw-bold">File hợp đồng</label>
          <input type="file" className="form-control" onChange={handleFileChange} />

          {form.file && (
            <p className="mt-2 text-muted">Đã chọn: {form.file.name}</p>
          )}
        </div>

        {/* Note */}
        <div className="mt-3">
          <label className="form-label fw-bold">Ghi chú</label>
          <textarea
            className="form-control"
            rows={3}
            name="note"
            value={form.note}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* BUTTONS */}
        <div className="mt-4 d-flex gap-3">
          <button type="submit" className="btn btn-primary px-4">
            Lưu
          </button>

          <button
            type="button"
            className="btn btn-secondary px-4"
            onClick={() => navigate("/contracts")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractCreate;
