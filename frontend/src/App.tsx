import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/Auth/LoginPage";
import Dashboard from "./pages/Admin/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { GetUser } from "./Redux/slices/UserSlice.js";
import UserProtectRoutes from "./components/ProtectedRoutes.js";
import AddWorker from "./pages/Admin/Pages/AddWorker/AddWorker.js";
import Parentspage from "./pages/Admin/Pages/parents/Parentspage.js";
import Daycare from "./pages/Admin/Pages/Daycare/Daycare.js";
import Areas from "./pages/Admin/Pages/Areas/Areas.js";
import Appointment from "./pages/Admin/Pages/Appointments/Appointment.js";
import AppointmentDetails from "./pages/Admin/Pages/Appointments/Details/AppointmentDetails.js";
import Vaccination from "./pages/Admin/Pages/Vaccination/Vaccination.js";
import ParentDetails from "./pages/Admin/Pages/ParentDetails/ParentDetails.js";
import WorkerDeatils from "./pages/Admin/Pages/WorkerDetails/WorkerDetails.js";
import Attendace from "./pages/Admin/Pages/Attendance/Attendace.js";
import AddAttendace from "./pages/Admin/Pages/Attendance/Add Attendace/AddAttendace.js";
import Data from "./pages/Admin/Pages/Data/Data.js";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(GetUser());
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <UserProtectRoutes>
              <Dashboard />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-attendance"
          element={
            <UserProtectRoutes>
              <Attendace />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-data"
          element={
            <UserProtectRoutes>
              <Data />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/add-attendance/*"
          element={
            <UserProtectRoutes>
              <AddAttendace />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/parents-detail/*"
          element={
            <UserProtectRoutes>
              <ParentDetails />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/worker-detail/*"
          element={
            <UserProtectRoutes>
              <WorkerDeatils />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/appointments/*"
          element={
            <UserProtectRoutes>
              <AppointmentDetails />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-add-worker"
          element={
            <UserProtectRoutes>
              <AddWorker />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-vaccination"
          element={
            <UserProtectRoutes>
              <Vaccination />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-appointments"
          element={
            <UserProtectRoutes>
              <Appointment />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-parents"
          element={
            <UserProtectRoutes>
              <Parentspage />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-daycare"
          element={
            <UserProtectRoutes>
              <Daycare />
            </UserProtectRoutes>
          }
        />
        <Route
          path="/admin-areas"
          element={
            <UserProtectRoutes>
              <Areas />
            </UserProtectRoutes>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
