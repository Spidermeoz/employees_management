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
  FaDownload,
} from "react-icons/fa";

type Employee = {
  id: number;
  full_name: string;
  salary_grade?: {
    id: number;
    grade_name: string;
    base_salary: number;
  } | null;
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
    salary: "",
    start_date: "",
    end_date: "",
    note: "",
    file: null as File | null,
    filePreviewUrl: "",
    fileType: "",
  });

  // ==========================
  // VALIDATE FORM
  // ==========================
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.employee_id) newErrors.employee_id = "Vui lòng chọn nhân viên.";
    if (!form.contract_type)
      newErrors.contract_type = "Vui lòng nhập loại hợp đồng.";
    if (!form.start_date) newErrors.start_date = "Vui lòng chọn ngày bắt đầu.";
    if (!form.salary) newErrors.salary = "Lương chưa được tự động điền.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==========================
  // LOAD EMPLOYEES
  // ==========================
  useEffect(() => {
    apiGet<Employee[]>("/employees")
      .then(setEmployees)
      .catch(() => {
        setSubmitMessage("Không thể tải danh sách nhân viên.");
        setSubmitMessageType("error");
      })
      .finally(() => setLoading(false));
  }, []);

  // ==========================
  // HANDLE INPUT CHANGES
  // ==========================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // ---- Khi chọn nhân viên -> tự động điền lương hiện tại ----
    if (name === "employee_id") {
      const emp = employees.find((x) => x.id === Number(value));
      if (emp?.salary_grade?.base_salary) {
        setForm((prev) => ({
          ...prev,
          salary: String(emp.salary_grade!.base_salary), // fill salary
        }));
      }
    }
  };

  // ==========================
  // IMAGE OR FILE PREVIEW
  // ==========================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.name.split(".").pop()?.toLowerCase() || "";
      setForm({
        ...form,
        file,
        filePreviewUrl: URL.createObjectURL(file),
        fileType,
      });
    }
  };

  const handleRemoveFile = () => {
    setForm({
      ...form,
      file: null,
      filePreviewUrl: "",
      fileType: "",
    });
  };

  // Tải file mẫu hợp đồng
  const downloadTemplate = () => {
    const url =
      "https://res.cloudinary.com/dgqzcdtbx/raw/upload/v1765686669/phbyxovlf3d6fopdo7pw.doc";
    const link = document.createElement("a");
    link.href = url;
    link.download = "mau_hop_dong.doc";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // ==========================
  // SUBMIT FORM
  // ==========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      let finalUrl = null;

      if (form.file) {
        finalUrl = await uploadToCloudinary(form.file);
      }

      const payload = {
        employee_id: Number(form.employee_id),
        contract_type: form.contract_type,
        salary: Number(form.salary),
        start_date: form.start_date,
        end_date: form.end_date || null,
        note: form.note || null,
        file_url: finalUrl,
      };

      await apiPost("/contracts", payload);
      setSubmitMessage("Tạo hợp đồng thành công!");
      setSubmitMessageType("success");

      setTimeout(() => navigate("/contracts"), 1500);
    } catch (err) {
      console.error(err);
      setSubmitMessage("Không thể tạo hợp đồng. Vui lòng thử lại.");
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p className="m-3 text-center">Đang tải dữ liệu...</p>;

  // ==========================
  // RENDER
  // ==========================
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
          {/* THÔNG BÁO */}
          {submitMessage && (
            <div
              className={`alert alert-${
                submitMessageType === "success" ? "success" : "danger"
              }`}
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
                  <FaExclamationTriangle className="me-1" />{" "}
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
              />
              {errors.contract_type && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" />{" "}
                  {errors.contract_type}
                </div>
              )}
            </div>

            {/* LƯƠNG — TỰ ĐỘNG ĐIỀN + KHÓA INPUT */}
            <div className="mb-3">
              <label className="form-label fw-bold">Lương hiện tại *</label>
              <input
                type="number"
                className={`form-control ${errors.salary ? "is-invalid" : ""}`}
                name="salary"
                value={form.salary}
                readOnly
                style={{ backgroundColor: "#e9ecef", cursor: "not-allowed" }}
              />
              {errors.salary && (
                <div className="invalid-feedback d-flex align-items-center">
                  <FaExclamationTriangle className="me-1" /> {errors.salary}
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
                />
                {errors.start_date && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <FaExclamationTriangle className="me-1" />{" "}
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
            <div className="mb-3 mt-3">
              <label className="form-label fw-bold">File hợp đồng</label>

              {/* Nút tải file mẫu */}
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  onClick={downloadTemplate}
                >
                  <FaDownload className="me-1" /> Tải mẫu hợp đồng
                </button>
              </div>

              {/* Preview file */}
              {form.filePreviewUrl && (
                <div className="border rounded p-3 mb-3 bg-light">
                  <h6>Preview file:</h6>

                  {/* PDF */}
                  {form.fileType === "pdf" && (
                    <embed
                      src={form.filePreviewUrl}
                      width="100%"
                      height="500px"
                      type="application/pdf"
                    />
                  )}

                  {/* Image */}
                  {["jpg", "jpeg", "png", "gif", "webp"].includes(
                    form.fileType
                  ) && (
                    <img
                      src={form.filePreviewUrl}
                      className="img-fluid rounded"
                      alt="Contract file"
                    />
                  )}

                  {/* Các file doc/xlsx -> render bằng google viewer */}
                  {["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
                    form.fileType
                  ) && (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(
                        form.filePreviewUrl
                      )}&embedded=true`}
                      width="100%"
                      height="500px"
                      title="View Document"
                    />
                  )}

                  {/* Không preview được */}
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
                    "ppt",
                    "pptx",
                  ].includes(form.fileType) && (
                    <p className="text-muted">Không thể xem trước file này.</p>
                  )}

                  {/* Nút xóa */}
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm mt-3"
                    onClick={handleRemoveFile}
                  >
                    <FaTrash className="me-1" /> Xóa file
                  </button>
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

            {/* BUTTONS */}
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
