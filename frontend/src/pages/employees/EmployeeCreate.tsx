import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost } from "../../api/client";
import { uploadToCloudinary } from "../../utils/uploadCloudinary";
import {
  FaUser,
  FaBriefcase,
  FaImage,
  FaSave,
  FaTimes,
  FaSpinner,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

// --- CẤU HÌNH XÁC THỰC FILE ---
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type Department = {
  id: number;
  name: string;
};

type Position = {
  id: number;
  name: string;
};

type SalaryGrade = {
  id: number;
  grade_name: string;
};

const EmployeeCreate: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [grades, setGrades] = useState<SalaryGrade[]>([]);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error" | null
  >(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    code: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    address: "",
    department_id: "",
    position_id: "",
    salary_grade_id: "",
    hire_date: "",
    status: "active",
    avatar: null as File | null,
  });

  // 🔥 Hàm xác thực toàn diện
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.full_name.trim()) newErrors.full_name = "Họ và tên là bắt buộc.";
    if (!form.code.trim()) newErrors.code = "Mã nhân viên là bắt buộc.";
    if (!form.gender) newErrors.gender = "Vui lòng chọn giới tính.";
    if (!form.dob) newErrors.dob = "Vui lòng chọn ngày sinh.";
    if (!form.email.trim()) newErrors.email = "Email là bắt buộc.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Định dạng email không hợp lệ.";
    if (!form.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc.";
    else if (!/(0[3|5|7|8|9])+([0-9]{8})\b/.test(form.phone))
      newErrors.phone = "Số điện thoại không hợp lệ.";
    if (!form.department_id)
      newErrors.department_id = "Vui lòng chọn phòng ban.";
    if (!form.position_id) newErrors.position_id = "Vui lòng chọn chức vụ.";
    if (!form.salary_grade_id)
      newErrors.salary_grade_id = "Vui lòng chọn bậc lương.";
    if (!form.hire_date) newErrors.hire_date = "Vui lòng chọn ngày vào làm.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptData, posData, gradeData] = await Promise.all([
          apiGet<Department[]>("/departments"),
          apiGet<Position[]>("/positions"),
          apiGet<SalaryGrade[]>("/salary-grades"),
        ]);
        setDepartments(deptData);
        setPositions(posData);
        setGrades(gradeData);
      } catch (err) {
        console.error(err);
        setSubmitMessage(
          "Không thể tải dữ liệu danh sách phòng ban/chức vụ/bậc lương."
        );
        setSubmitMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Xóa lỗi khi người dùng bắt đầu gõ/chọn
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Chỉ chấp nhận các file ảnh (JPG, PNG, GIF).",
        }));
        setForm((prev) => ({ ...prev, avatar: null }));
        setAvatarPreview(null);
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          avatar: "Dung lượng file tối đa là 5MB.",
        }));
        setForm((prev) => ({ ...prev, avatar: null }));
        setAvatarPreview(null);
        e.target.value = "";
        return;
      }

      setErrors((prev) => ({ ...prev, avatar: "" }));
      setForm({ ...form, avatar: file });
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      let avatarUrl = null;
      if (form.avatar) {
        avatarUrl = await uploadToCloudinary(form.avatar);
      }

      const payload = {
        ...form,
        department_id: form.department_id ? Number(form.department_id) : null,
        position_id: form.position_id ? Number(form.position_id) : null,
        salary_grade_id: form.salary_grade_id
          ? Number(form.salary_grade_id)
          : null,
        avatar: avatarUrl,
      };

      await apiPost("/employees", payload);
      setSubmitMessage("Tạo nhân viên thành công!");
      setSubmitMessageType("success");
      setTimeout(() => navigate("/employees"), 1500);
    } catch (err) {
      console.error(err);
      setSubmitMessage("Lỗi! Không thể tạo nhân viên.");
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
          <h3 className="fw-bold mb-0">Thêm nhân viên mới</h3>
        </div>
        <div className="card-body">
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
            {/* CARD: Thông tin cá nhân */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="fw-bold mb-0">
                  <FaUser className="me-2" />
                  Thông tin cá nhân
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.full_name ? "is-invalid" : ""
                      }`}
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      required
                    />
                    {errors.full_name && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.full_name}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Mã nhân viên *</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.code ? "is-invalid" : ""
                      }`}
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      required
                    />
                    {errors.code && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.code}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Giới tính *</label>
                    <select
                      className={`form-select ${
                        errors.gender ? "is-invalid" : ""
                      }`}
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn giới tính --</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                    {errors.gender && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.gender}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Ngày sinh *</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.dob ? "is-invalid" : ""
                      }`}
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      required
                    />
                    {errors.dob && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.dob}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Ngày vào làm *</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.hire_date ? "is-invalid" : ""
                      }`}
                      name="hire_date"
                      value={form.hire_date}
                      onChange={handleChange}
                      required
                    />
                    {errors.hire_date && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.hire_date}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <FaEnvelope className="me-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      <FaPhone className="me-1" />
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errors.phone ? "is-invalid" : ""
                      }`}
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.phone}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label">
                      <FaMapMarkerAlt className="me-1" />
                      Địa chỉ
                    </label>
                    <textarea
                      className="form-control"
                      name="address"
                      rows={2}
                      value={form.address}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD: Thông tin công việc */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="fw-bold mb-0">
                  <FaBriefcase className="me-2" />
                  Thông tin công việc
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Phòng ban *</label>
                    <select
                      className={`form-select ${
                        errors.department_id ? "is-invalid" : ""
                      }`}
                      name="department_id"
                      value={form.department_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn phòng ban --</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                    {errors.department_id && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.department_id}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Chức vụ *</label>
                    <select
                      className={`form-select ${
                        errors.position_id ? "is-invalid" : ""
                      }`}
                      name="position_id"
                      value={form.position_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn chức vụ --</option>
                      {positions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    {errors.position_id && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.position_id}
                      </div>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Bậc lương *</label>
                    <select
                      className={`form-select ${
                        errors.salary_grade_id ? "is-invalid" : ""
                      }`}
                      name="salary_grade_id"
                      value={form.salary_grade_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Chọn bậc lương --</option>
                      {grades.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.grade_name}
                        </option>
                      ))}
                    </select>
                    {errors.salary_grade_id && (
                      <div className="invalid-feedback d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.salary_grade_id}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD: Ảnh đại diện */}
            <div className="card mb-4">
              <div className="card-header bg-light">
                <h5 className="fw-bold mb-0">
                  <FaImage className="me-2" />
                  Ảnh đại diện
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="me-4">
                    <img
                      src={avatarPreview || "https://via.placeholder.com/150"}
                      alt="avatar preview"
                      width="120"
                      height="120"
                      className="rounded border"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="avatar-upload"
                      className={`btn ${
                        errors.avatar ? "btn-danger" : "btn-outline-secondary"
                      }`}
                    >
                      Chọn ảnh mới
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      className="d-none"
                      onChange={handleAvatarChange}
                      accept="image/*"
                    />
                    <p className="text-muted small mt-2 mb-0">
                      Định dạng: JPG, PNG, GIF. Tối đa 5MB.
                    </p>
                    {errors.avatar && (
                      <div className="invalid-feedback d-block d-flex align-items-center">
                        <FaExclamationTriangle className="me-1" />
                        {errors.avatar}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary px-4"
                type="button"
                onClick={() => navigate("/employees")}
              >
                <FaTimes className="me-1" /> Hủy
              </button>
              <button
                className="btn btn-primary px-4"
                type="submit"
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

export default EmployeeCreate;
