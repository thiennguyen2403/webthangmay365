import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import AppRoutes from "../routes/AppRoutes";

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <AppRoutes />
      </div>
    </div>
  );
}

export default MainLayout;