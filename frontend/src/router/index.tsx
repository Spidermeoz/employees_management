import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
// import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employees/EmployeeList";
// import EmployeeForm from "../pages/employees/EmployeeForm";
// import EmployeeDetail from "../pages/employees/EmployeeDetail";
// import DepartmentList from "../pages/departments/DepartmentList";
// import Profile from "../pages/profile/Profile";

export const router = createBrowserRouter([
//   { path: "/", element: <Login /> },
  {
    path: "/app",
    element: <MainLayout />,
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "employees", element: <EmployeeList /> },
    //   { path: "employees/:id", element: <EmployeeDetail /> },
    //   { path: "employees/new", element: <EmployeeForm /> },
    //   { path: "departments", element: <DepartmentList /> },
    //   { path: "profile", element: <Profile /> }
    ]
  }
]);
