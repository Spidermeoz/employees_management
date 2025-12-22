import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";

import EmployeeList from "./pages/employees/EmployeeList";
import EmployeeCreate from "./pages/employees/EmployeeCreate";
import EmployeeEdit from "./pages/employees/EmployeeEdit";
import EmployeeDetail from "./pages/employees/EmployeeDetail";

import DepartmentsList from "./pages/departments/DepartmentsList";
import DepartmentCreate from "./pages/departments/DepartmentCreate";
import DepartmentEdit from "./pages/departments/DepartmentEdit";
import DepartmentDetail from "./pages/departments/DepartmentDetail";

import PositionsList from "./pages/positions/PositionsList";
import PositionCreate from "./pages/positions/PositionCreate";
import PositionEdit from "./pages/positions/PositionEdit";
import PositionDetail from "./pages/positions/PositionDetail";

import SalaryGradesList from "./pages/salary-grades/SalaryGradesList";
import SalaryGradeCreate from "./pages/salary-grades/SalaryGradeCreate";
import SalaryGradeEdit from "./pages/salary-grades/SalaryGradeEdit";
import SalaryGradeDetail from "./pages/salary-grades/SalaryGradeDetail";

import ContractsList from "./pages/contracts/ContractsList";
import ContractCreate from "./pages/contracts/ContractCreate";
import ContractEdit from "./pages/contracts/ContractEdit";
import ContractDetail from "./pages/contracts/ContractDetail";

import TimesheetsList from "./pages/timesheets/TimesheetsList";
import TimesheetCreate from "./pages/timesheets/TimesheetCreate";
import TimesheetEdit from "./pages/timesheets/TimesheetEdit";
import TimesheetDetail from "./pages/timesheets/TimesheetDetail";

import RewardsList from "./pages/rewards/RewardsList";
import RewardCreate from "./pages/rewards/RewardCreate";
import RewardEdit from "./pages/rewards/RewardEdit";
import RewardDetail from "./pages/rewards/RewardDetail";

import PayrollList from "./pages/payrolls/PayrollList";
import PayrollCreate from "./pages/payrolls/PayrollCreate";
import PayrollEdit from "./pages/payrolls/PayrollEdit";
import PayrollDetail from "./pages/payrolls/PayrollDetail";

import UsersList from "./pages/users/UsersList";
import UserCreate from "./pages/users/UserCreate";
import UserEdit from "./pages/users/UserEdit";

/* =======================
   AUTH GUARD FIXED
======================= */
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const rawToken = localStorage.getItem("access_token");

  // Loại các token không hợp lệ
  const token =
    rawToken &&
    rawToken !== "undefined" &&
    rawToken !== "null" &&
    rawToken !== ""
      ? rawToken
      : null;

  if (!token) {
    // Xóa token lỗi
    localStorage.removeItem("access_token");
    localStorage.removeItem("current_user");

    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/* =======================
   APP
======================= */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<LoginPage />} />

        {/* ADMIN (PROTECTED) */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <AdminLayout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardPage />} />

          {/* Employees */}
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/create" element={<EmployeeCreate />} />
          <Route path="employees/:id/edit" element={<EmployeeEdit />} />
          <Route path="employees/:id" element={<EmployeeDetail />} />

          {/* Departments */}
          <Route path="departments" element={<DepartmentsList />} />
          <Route path="departments/create" element={<DepartmentCreate />} />
          <Route path="departments/:id/edit" element={<DepartmentEdit />} />
          <Route path="departments/:id" element={<DepartmentDetail />} />

          {/* Positions */}
          <Route path="positions" element={<PositionsList />} />
          <Route path="positions/create" element={<PositionCreate />} />
          <Route path="positions/:id/edit" element={<PositionEdit />} />
          <Route path="positions/:id" element={<PositionDetail />} />

          {/* Salary Grades */}
          <Route path="salary-grades" element={<SalaryGradesList />} />
          <Route path="salary-grades/create" element={<SalaryGradeCreate />} />
          <Route path="salary-grades/:id/edit" element={<SalaryGradeEdit />} />
          <Route path="salary-grades/:id" element={<SalaryGradeDetail />} />

          {/* Contracts */}
          <Route path="contracts" element={<ContractsList />} />
          <Route path="contracts/create" element={<ContractCreate />} />
          <Route path="contracts/:id/edit" element={<ContractEdit />} />
          <Route path="contracts/:id" element={<ContractDetail />} />

          {/* Timesheets */}
          <Route path="timesheets" element={<TimesheetsList />} />
          <Route path="timesheets/create" element={<TimesheetCreate />} />
          <Route path="timesheets/:id/edit" element={<TimesheetEdit />} />
          <Route path="timesheets/:id" element={<TimesheetDetail />} />

          {/* Rewards */}
          <Route path="rewards" element={<RewardsList />} />
          <Route path="rewards/create" element={<RewardCreate />} />
          <Route path="rewards/:id/edit" element={<RewardEdit />} />
          <Route path="rewards/:id" element={<RewardDetail />} />

          {/* Payrolls */}
          <Route path="payrolls" element={<PayrollList />} />
          <Route path="payrolls/create" element={<PayrollCreate />} />
          <Route path="payrolls/:id/edit" element={<PayrollEdit />} />
          <Route path="payrolls/:id" element={<PayrollDetail />} />

          <Route path="users" element={<UsersList />} />
          <Route path="users/create" element={<UserCreate />} />
          <Route path="users/:id/edit" element={<UserEdit />} />

        </Route>

        {/* FALLBACK — luôn đưa về login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
