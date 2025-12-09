import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPut } from "../../api/client";

// Kiểu dữ liệu hợp đồng
type Contract = {
  id: number;
  employee_id: number;
  contract_type: string;
  start_date: string;
  end_date?: string | null;
  file_url?: string | null;
  note?: string | null;
  employee: {
    id: number;
    full_name: string;
  };
};

// Kiểu dữ liệu nhân viên
type Employee = {
  id: number;
  full_name: string;
};

// Upload file Cloudinary
async function uploadToCloudinary(file: File): Promise<string> {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Upload file thất bại");

  const data = await res.json();
  return data.secure_url;
}

const ContractEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    employee_id: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    note: "",
    file: null as File | null,
    file_url: "",
  });

  // 🔥 Load hợp đồng + nhân viên
  useEffect(() => {
    const loadData = async () => {
      try {
        const [contract, employeeList] = await Promise.all([
          apiGet<Contract>(`/contracts/${id}`),
          apiGet<Employee[]>("/employees"),
        ]);

        setEmployees(employeeList);

        setForm({
          employee_id: String(contract.employee_id),
          contract_type: contract.contract_type,
          start_date: contract.start_date,
          end_date: contract.end_date || "",
          note: contract.note || "",
          file: null,
          file_url: contract.file_url || "",
        });
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu hợp đồng!");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // Input change
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // File change (new file)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setForm({ ...form, file: e.target.files[0] });
    }
  };

  const getFileType = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    return ext;
  };

  const renderFilePreview = (url: string) => {
    if (!url) return null;

    const ext = getFileType(url);

    const isPDF = ext === "pdf";
    const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext!);
    const isDoc = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext!);

    return (
      <div className="border p-3 rounded bg-light">
        {isPDF && (
          <embed src={url} width="100%" height="500px" type="application/pdf" />
        )}

        {isImage && (
          <img src={url} className="img-fluid rounded" alt="contract file" />
        )}

        {isDoc && (
          <iframe
            src={`https://docs.google.com/viewer?url=${encodeURIComponent(
              url
            )}&embedded=true`}
            width="100%"
            height="500px"
          />
        )}

        {!isPDF && !isImage && !isDoc && (
          <p>
            Không hỗ trợ preview loại file này.{" "}
            <a href={url} target="_blank">
              Tải xuống
            </a>
          </p>
        )}
      </div>
    );
  };

  // Submit update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let finalUrl = form.file_url;

      if (form.file) {
        finalUrl = await uploadToCloudinary(form.file);
      }

      const payload = {
        employee_id: Number(form.employee_id),
        contract_type: form.contract_type,
        start_date: form.start_date,
        end_date: form.end_date || null,
        note: form.note || null,
        file_url: finalUrl,
      };

      await apiPut(`/contracts/${id}`, payload);

      alert("Cập nhật hợp đồng thành công!");
      navigate("/contracts");
    } catch (err) {
      console.error(err);
      alert("Không thể cập nhật hợp đồng!");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid">
      <h3 className="fw-bold mb-4">Chỉnh sửa hợp đồng</h3>

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        {/* EMPLOYEE */}
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

        {/* TYPE */}
        <div className="mb-3">
          <label className="form-label fw-bold">Loại hợp đồng</label>
          <input
            type="text"
            className="form-control"
            name="contract_type"
            value={form.contract_type}
            onChange={handleChange}
            required
          />
        </div>

        {/* DATES */}
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

        {/* FILE */}
        <div className="mt-3">
          <label className="form-label fw-bold">File hợp đồng</label>

          {/* Preview file hiện tại */}
          {form.file_url && !form.file && (
            <div className="mt-2">
              <p className="text-muted mb-2">File hiện tại:</p>
              {renderFilePreview(form.file_url)}
            </div>
          )}

          {/* Nếu chọn file mới → preview file mới */}
          {form.file && (
            <div className="mt-3">
              <p className="text-muted">Preview file mới:</p>
              {renderFilePreview(URL.createObjectURL(form.file))}
            </div>
          )}

          <input
            type="file"
            className="form-control mt-3"
            onChange={handleFileChange}
          />
        </div>

        {/* NOTE */}
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
            Cập nhật
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

export default ContractEdit;
