import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { apiGet, apiPost } from "../../api/client";
import { uploadToCloudinary } from "../../utils/uploadCloudinary";
import {
  FaFileContract,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaTrash,
} from "react-icons/fa";

type Employee = {
  id: number;
  full_name: string;
};

const ContractCreate: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [form, setForm] = useState({
    employee_id: "",
    contract_type: "",
    start_date: "",
    end_date: "",
    note: "",
    file: null as File | null,
    filePreviewUrl: "", // URL để preview file mới
    fileType: "", // Loại file mới (pdf, image, etc.)
  });

  // Hàm xác thực form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.employee_id) newErrors.employee_id = "Vui lòng chọn nhân viên.";
    if (!form.contract_type)
      newErrors.contract_type = "Vui lòng nhập loại hợp đồng.";
    if (!form.start_date) newErrors.start_date = "Vui lòng chọn ngày bắt đầu.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await apiGet<Employee[]>("/employees");
        setEmployees(data);
      } catch (err) {
        console.error(err);
        setSubmitMessage("Không thể tải danh sách nhân viên.");
        setSubmitMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Xóa lỗi khi người dùng bắt đầu sửa
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 🔥 Hàm xử lý thay đổi file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.name.split(".").pop()?.toLowerCase() || "";
      setForm({
        ...form,
        file: file,
        filePreviewUrl: URL.createObjectURL(file), // Tạo URL tạm thời để preview
        fileType: fileType, // Lưu lại loại file
      });
    }
  };

  // 🔥 Hàm xóa file đã chọn
  const handleRemoveFile = () => {
    setForm({
      ...form,
      file: null,
      filePreviewUrl: "", // Xóa URL preview
      fileType: "", // Xóa loại file
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      let finalUrl = null;
      // Nếu có file mới, upload lên Cloudinary
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

      await apiPost("/contracts", payload);
      setSubmitMessage("Tạo hợp đồng thành công!");
      setSubmitMessageType("success");
      setTimeout(() => navigate("/contracts"), 1500);
    } catch (err: any) {
      console.error(err);
      setSubmitMessage("Không thể tạo hợp đồng. Vui lòng thử lại.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h3 className="fw-bold mb-0">
            <FaFileContract className="me-2" />
            Thêm hợp đồng mới
          </h3>
        </div>
        <div className="card-body">
          {/* Thông báo thành công/lỗi */}
          {submitMessage && (
            <div
              className={`alert alert-${
                submitMessageType === "success" ? "success" : "danger"
              } d-flex align-items-center`}
              role="alert"
            >
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* NHÂN VIÊN */}
            <div className="mb-3">
              <label className="form-label fw-bold">Nhân viên *</label>
              <select
                className={`form-select ${
                  errors.employee_id ? "is-invalid" : ""
                }`}
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.full_name}
                  </option>
                ))}
              </select>
              {errors.employee_id && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.employee_id}
                </div>
              )}
            </div>

            {/* LOẠI HỢP ĐỒNG */}
            <div className="mb-3">
              <label className="form-label fw-bold">Loại hợp đồng *</label>
              <input
                type="text"
                className={`form-control ${
                  errors.contract_type ? "is-invalid" : ""
                }`}
                name="contract_type"
                value={form.contract_type}
                onChange={handleChange}
                required
              />
              {errors.contract_type && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />
                  {errors.contract_type}
                </div>
              )}
            </div>

            {/* NGÀY BẮT ĐẦU / KẾT THÚC */}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Ngày bắt đầu *</label>
                <input
                  type="date"
                  className={`form-control ${
                    errors.start_date ? "is-invalid" : ""
                  }`}
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
                {errors.start_date && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />
                    {errors.start_date}
                  </div>
                )}
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

            {/* FILE HỢP ĐỒNG */}
            <div className="mb-3">
              <label className="form-label fw-bold">File hợp đồng</label>
              {form.filePreviewUrl && (
                <div className="border rounded p-3 mb-3 bg-light">
                  <h6 className="fw-bold mb-3">Xem trước file:</h6>

                  {/* PDF */}
                  {form.fileType === "pdf" && (
                    <embed
                      src={form.filePreviewUrl}
                      width="100%"
                      height="500px"
                      style={{ borderRadius: "4px", border: "1px solid #ddd" }}
                    />
                  )}

                  {/* IMAGE */}
                  {["jpg", "jpeg", "png", "gif", "webp"].includes(
                    form.fileType
                  ) && (
                    <img
                      src={form.filePreviewUrl}
                      alt="Preview"
                      className="img-fluid rounded"
                      style={{ maxHeight: "500px", objectFit: "contain" }}
                    />
                  )}

                  {/* WORD / EXCEL */}
                  {["doc", "docx", "xls", "xlsx"].includes(form.fileType) && (
                    <iframe
                      src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                        form.filePreviewUrl
                      )}`}
                      style={{
                        width: "100%",
                        height: "500px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      title="Office Preview"
                    ></iframe>
                  )}

                  {/* TEXT */}
                  {["txt", "csv", "json"].includes(form.fileType) && (
                    <iframe
                      src={form.filePreviewUrl}
                      style={{
                        width: "100%",
                        height: "400px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                      }}
                      title="Text Preview"
                    ></iframe>
                  )}

                  {/* FALLBACK */}
                  {![
                    "pdf",
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "webp",
                    "doc",
                    "docx",
                    "xls",
                    "xlsx",
                    "txt",
                    "csv",
                    "json",
                  ].includes(form.fileType) && (
                    <div className="text-center p-4">
                      <h4 className="fw-bold">
                        Không thể xem trước loại file này
                      </h4>
                      <p className="text-muted">
                        Vui lòng tải file xuống để xem.
                      </p>
                    </div>
                  )}

                  {/* REMOVE BUTTON */}
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleRemoveFile}
                    >
                      <FaTrash className="me-1" /> Chọn file khác
                    </button>
                  </div>
                </div>
              )}

              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            {/* GHI CHÚ */}
            <div className="mb-4">
              <label className="form-label fw-bold">Ghi chú</label>
              <textarea
                className="form-control"
                rows={3}
                name="note"
                value={form.note}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* NÚT HÀNH ĐỘNG */}
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-secondary px-4"
                onClick={() => navigate("/contracts")}
              >
                <FaTimes className="me-1" /> Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <FaSpinner className="fa-spin me-1" />
                ) : (
                  <FaSave className="me-1" />
                )}
                {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContractCreate;
