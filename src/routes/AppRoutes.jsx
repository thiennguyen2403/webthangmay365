import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import RoleLayout from "../layouts/RoleLayout";
import DirectorDashboard from "../pages/director/DirectorDashboard";
import DirectorUsers from "../pages/director/DirectorUsers";
import DirectorProjects from "../pages/director/DirectorProjects";
import DirectorProjectDetail from "../pages/director/DirectorProjectDetail";
import DirectorCreateProject from "../pages/director/DirectorCreateProject";
import DirectorFinance from "../pages/director/DirectorFinance";
import DirectorTasks from "../pages/director/DirectorTasks";
import DirectorApprovals from "../pages/director/DirectorApprovals";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerProjects from "../pages/manager/ManagerProjects";
import ManagerProjectDetail from "../pages/manager/ManagerProjectDetail";
import ManagerTasks from "../pages/manager/ManagerTasks";
import ManagerReports from "../pages/manager/ManagerReports";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import EmployeeReports from "../pages/employee/EmployeeReports";
import EmployeeIssues from "../pages/employee/EmployeeIssues";
import EmployeeMaintenance from "../pages/employee/EmployeeMaintenance";
import EmployeeProjectDetail from "../pages/employee/EmployeeProjectDetail";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import CustomerProjectDetail from "../pages/customer/CustomerProjectDetail";
import Profile from "../pages/Profile";

function AppRoutes(){
  return <Routes>
    <Route path="/login" element={<Login/>}/>
    <Route element={<ProtectedRoute roles={["director"]}/>}> 
      <Route path="/director" element={<RoleLayout type="director"/>}> 
        <Route index element={<DirectorDashboard/>}/> 
        <Route path="users" element={<DirectorUsers/>}/> 
        <Route path="projects" element={<DirectorProjects/>}/> 
        <Route path="projects/create" element={<DirectorCreateProject/>}/> 
        <Route path="projects/:id" element={<DirectorProjectDetail/>}/> 
        <Route path="tasks" element={<DirectorTasks/>}/> 
        <Route path="approvals" element={<DirectorApprovals/>}/> 
        <Route path="finance" element={<DirectorFinance/>}/> 
        <Route path="profile" element={<Profile/>}/> 
      </Route> 
    </Route>
    <Route element={<ProtectedRoute roles={["manager"]}/>}> 
      <Route path="/manager" element={<RoleLayout type="manager"/>}> 
        <Route index element={<ManagerDashboard/>}/> 
        <Route path="projects" element={<ManagerProjects/>}/> 
        <Route path="projects/:id" element={<ManagerProjectDetail/>}/> 
        <Route path="tasks" element={<ManagerTasks/>}/> 
        <Route path="reports" element={<ManagerReports/>}/> 
        <Route path="profile" element={<Profile/>}/> 
      </Route> 
    </Route>
    <Route element={<ProtectedRoute roles={["employee_technical","employee_installation","employee_maintenance"]}/>}> 
      <Route path="/employee" element={<RoleLayout type="employee"/>}> 
        <Route index element={<EmployeeDashboard/>}/> 
        <Route path="projects/:id" element={<EmployeeProjectDetail/>}/> 
        <Route path="reports" element={<EmployeeReports/>}/> 
        <Route path="issues" element={<EmployeeIssues/>}/> 
        <Route path="maintenance" element={<EmployeeMaintenance/>}/> 
        <Route path="profile" element={<Profile/>}/> 
      </Route> 
    </Route>
    <Route element={<ProtectedRoute roles={["customer_installation","customer_maintenance"]}/>}> 
      <Route path="/customer" element={<RoleLayout type="customer"/>}> 
        <Route index element={<CustomerDashboard/>}/> 
        <Route path="projects/:id" element={<CustomerProjectDetail/>}/> 
        <Route path="profile" element={<Profile/>}/> 
      </Route> 
    </Route>
    <Route path="/" element={<Navigate to="/login" replace/>}/>
    <Route path="*" element={<Navigate to="/login" replace/>}/>
  </Routes>
}
export default AppRoutes;
