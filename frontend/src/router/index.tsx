import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employees/EmployeeList";
import EmployeeForm from "../pages/employees/EmployeeForm";
import EmployeeDetail from "../pages/employees/EmployeeDetail";
import EmployeeEdit from "../pages/employees/EmployeeEdit";
import DepartmentList from "../pages/departments/DepartmentList";
import DepartmentForm from "../pages/departments/DepartmentForm";
import Profile from "../pages/profile/Profile";
import NotFound from "../pages/errors/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "employees", element: <EmployeeList /> },
      { path: "employees/:id", element: <EmployeeDetail /> },
      { path: "employees/new", element: <EmployeeForm /> },
      { path: "employees/:id/edit", element: <EmployeeEdit /> },
      { path: "departments", element: <DepartmentList /> },
      { path: "departments/new", element: <DepartmentForm /> },
      { path: "departments/:id/edit", element: <DepartmentForm /> },
      { path: "profile", element: <Profile /> },
      { path: "*", element: <NotFound /> },
    ]
  },
  { path: "*", element: <NotFound /> },
]);
