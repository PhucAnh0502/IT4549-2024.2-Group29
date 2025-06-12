import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import AccountActive from "./components/auth/AccountActive";
import ChangePassword from "./components/auth/ChangePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSummary from "./components/adminAndManager/Summary";
import UserList from "./components/adminAndManager/users/UserList";
import UserDetail from "./components/adminAndManager/users/UserDetail";
import RoomList from "./components/adminAndManager/rooms/RoomList";
import RoomDetail from "./components/adminAndManager/rooms/RoomDetail";
import AddRoom from "./components/adminAndManager/rooms/AddRoom";
import CourseList from "./components/adminAndManager/courses/CourseList";
import CourseDetail from "./components/adminAndManager/courses/CourseDetail";
import EquipmentsList from "./components/adminAndManager/equipments/EquipmentsList";
import EquipmentDetail from "./components/adminAndManager/equipments/EquipmentDetail";
import AddEquipment from "./components/adminAndManager/equipments/AddEquipment";
import SettingDashboard from "./components/adminAndManager/settings/SettingDashboard";
import ReportList from "./components/adminAndManager/reports/ReportList";
import ReportDetail from "./components/adminAndManager/reports/ReportDetail";
import AddReport from "./components/adminAndManager/reports/AddReport";
import TrainingRecordsList from "./components/adminAndManager/trainingRecords/TrainingRecordsList";
import TrainingRecordDetail from "./components/adminAndManager/trainingRecords/TrainingRecordDetail";
import ManagerDashboard from "./pages/ManagerDashboard";
import MemberDashboard from "./pages/MemberDashboard";
import MemberSummary from "./components/memberDashboard/MemberSummary";
import MemberCourseList from "./components/memberDashboard/courses/MemberCourseList";
import MemberEquipmentList from "./components/memberDashboard/equipments/MemberEquipmentList";
import MemberEquipmentBookings from "./components/memberDashboard/equipments/MemberEquipmentBookings";
import FeedbackList from "./components/memberDashboard/feedback/FeedbackList";
import FeedbackDetail from "./components/memberDashboard/feedback/FeedbackDetail";
import AddFeedback from "./components/memberDashboard/feedback/AddFeedback";
import TrainerDashboard from "./pages/TrainerDashboard";
import TrainerSummary from "./components/trainerDashboard/TrainerSummary";
import TrainerCourseList from "./components/trainerDashboard/courses/TrainerCourseList";
import CreateCourse from "./components/trainerDashboard/courses/CreateCourse";
import EditCourse from "./components/trainerDashboard/courses/EditCourse";
import TrainerRecordsList from "./components/trainerDashboard/trainingRecords/TrainerRecordsList";
import TrainerRecordForm from "./components/trainerDashboard/trainingRecords/TrainerRecordForm";
import TrainerRecordDetail from "./components/trainerDashboard/trainingRecords/TrainerRecordDetail";
import TrainerReportsList from "./components/trainerDashboard/reports/TrainerReportsList";
import TrainerReportDetail from "./components/trainerDashboard/reports/TrainerReportDetail";
import TrainerCreateReportForm from "./components/trainerDashboard/reports/TrainerCreateReportForm";
import TrainerEditReportForm from "./components/trainerDashboard/reports/TrainerEditReportForm";

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <BrowserRouter>
      {/* Modal components */}
      {showLogin && <Login onClose={() => setShowLogin(false)} />}

      {showRegister && <Register onClose={() => setShowRegister(false)} />}

      <Routes>
        {/* Auth */}
        <Route
          path="/"
          element={
            <Home
              setShowLogin={setShowLogin}
              setShowRegister={setShowRegister}
            />
          }
        />
        <Route
          path="/login"
          element={<Login onClose={() => window.history.back()} />}
        />
        <Route
          path="/register"
          element={<Register onClose={() => window.history.back()} />}
        />
        <Route
          path="/activate-account"
          element={<AccountActive onClose={() => window.history.back()} />}
        />
        <Route
          path="/change-password"
          element={<ChangePassword onClose={() => window.history.back()} />}
        />
        <Route
          path="/forgot-password"
          element={<ForgotPassword onClose={() => window.history.back()} />}
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes allowedRoles={["Admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          {/* Overview Dashboard */}
          <Route index element={<AdminSummary />}></Route>

          {/* Users */}
          <Route
            path="/admin-dashboard/users"
            element={<UserList onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/users/:userId"
            element={<UserDetail onClose={() => window.history.back()} />}
          />

          {/* Rooms */}
          <Route
            path="/admin-dashboard/rooms"
            element={<RoomList onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/rooms/add-room"
            element={<AddRoom onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/rooms/:roomId"
            element={<RoomDetail onClose={() => window.history.back()} />}
          />

          {/* Courses */}
          <Route
            path="/admin-dashboard/courses"
            element={<CourseList onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/courses/:courseId"
            element={<CourseDetail onClose={() => window.history.back()} />}
          />

          {/* Equipments */}
          <Route
            path="/admin-dashboard/equipments"
            element={<EquipmentsList onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/equipments/:equipmentId"
            element={<EquipmentDetail onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/equipments/add-equipment"
            element={<AddEquipment onClose={() => window.history.back()} />}
          />

          {/* Reports */}
          <Route
            path="/admin-dashboard/reports"
            element={<ReportList onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/reports/:reportId"
            element={<ReportDetail onClose={() => window.history.back()} />}
          />

          <Route
            path="/admin-dashboard/reports/add-report"
            element={<AddReport onClose={() => window.history.back()} />}
          />

          {/* Training Records */}
          <Route
            path="/admin-dashboard/training-records"
            element={
              <TrainingRecordsList onClose={() => window.history.back()} />
            }
          />

          <Route
            path="/admin-dashboard/training-records/:trainingRecordId"
            element={
              <TrainingRecordDetail onClose={() => window.history.back()} />
            }
          />

          {/* Settings */}
          <Route
            path="/admin-dashboard/setting"
            element={<SettingDashboard onClose={() => window.history.back()} />}
          />
        </Route>

        {/* Manager Dashboard */}
        <Route
          path="/manager-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes allowedRoles={["Manager"]}>
                <ManagerDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          {/* Overview Dashboard */}
          <Route index element={<AdminSummary />}></Route>

          {/* Users */}
          <Route
            path="/manager-dashboard/users"
            element={<UserList onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/users/:userId"
            element={<UserDetail onClose={() => window.history.back()} />}
          />
          {/* Rooms */}
          <Route
            path="/manager-dashboard/rooms"
            element={<RoomList onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/rooms/add-room"
            element={<AddRoom onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/rooms/:roomId"
            element={<RoomDetail onClose={() => window.history.back()} />}
          />
          {/* Courses */}
          <Route
            path="/manager-dashboard/courses"
            element={<CourseList onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/courses/:courseId"
            element={<CourseDetail onClose={() => window.history.back()} />}
          />
          {/* Equipments */}
          <Route
            path="/manager-dashboard/equipments"
            element={<EquipmentsList onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/equipments/:equipmentId"
            element={<EquipmentDetail onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/equipments/add-equipment"
            element={<AddEquipment onClose={() => window.history.back()} />}
          />
          {/* Reports */}
          <Route
            path="/manager-dashboard/reports"
            element={<ReportList onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/reports/:reportId"
            element={<ReportDetail onClose={() => window.history.back()} />}
          />

          <Route
            path="/manager-dashboard/reports/add-report"
            element={<AddReport onClose={() => window.history.back()} />}
          />
          {/* Training Records */}
          <Route
            path="/manager-dashboard/training-records"
            element={
              <TrainingRecordsList onClose={() => window.history.back()} />
            }
          />

          <Route
            path="/manager-dashboard/training-records/:trainingRecordId"
            element={
              <TrainingRecordDetail onClose={() => window.history.back()} />
            }
          />
          {/* Settings */}
          <Route
            path="/manager-dashboard/setting"
            element={<SettingDashboard onClose={() => window.history.back()} />}
          />
        </Route>

        {/* Trainer Dashboard */}
        <Route
          path="/trainer-dashboard"
          element={
            <RoleBaseRoutes allowedRoles={["Trainer"]}>
              <TrainerDashboard />
            </RoleBaseRoutes>
          }
        >
          {/* Overview Dashboard */}
          <Route index element={<TrainerSummary />} />

          {/* Courses */}
          <Route path="my-courses" element={<TrainerCourseList />} />
          <Route path="create-course" element={<CreateCourse />} />
          <Route path="courses/edit/:id" element={<EditCourse />} />

          {/* Training Records */}
          <Route path="training-records" element={<TrainerRecordsList />} />
          <Route
            path="training-records/create"
            element={<TrainerRecordForm mode="create" />}
          />
          <Route
            path="training-records/edit/:id"
            element={<TrainerRecordForm mode="edit" />}
          />
          <Route
            path="training-records/:id"
            element={<TrainerRecordDetail />}
          />

          {/* Report */}
          <Route path="reports" element={<TrainerReportsList />} />
          <Route path="reports/:id" element={<TrainerReportDetail />} />
          <Route
            path="reports/create"
            element={<TrainerCreateReportForm mode="create" />}
          />
          <Route
            path="reports/edit/:reportId"
            element={<TrainerEditReportForm mode="edit" />}
          />

          {/* Settings */}
          <Route
            path="/trainer-dashboard/setting"
            element={<SettingDashboard onClose={() => window.history.back()} />}
          />
        </Route>

        {/* Member Dashboard */}
        <Route
          path="/member-dashboard"
          element={
            <RoleBaseRoutes allowedRoles={["Member"]}>
              <MemberDashboard />
            </RoleBaseRoutes>
          }
        >
          {/* Overview Dashboard */}
          <Route index element={<MemberSummary />}></Route>

          {/* Courses */}
          <Route
            path="/member-dashboard/courses"
            element={<MemberCourseList onClose={() => window.history.back()} />}
          />

          {/* Equipment */}
          <Route
            path="/member-dashboard/equipments"
            element={
              <MemberEquipmentList onClose={() => window.history.back()} />
            }
          />

          <Route
            path="/member-dashboard/equipments/bookings"
            element={
              <MemberEquipmentBookings onClose={() => window.history.back()} />
            }
          />

          {/*Equipment Info*/}
          <Route
            path="/member-dashboard/equipments/:equipmentId"
            element={<EquipmentDetail onClose={() => window.history.back()} />}
          />

          {/*Report*/}
          <Route
            path="/member-dashboard/reports"
            element={<FeedbackList onClose={() => window.history.back()} />}
          />

          {/*Add Feedback*/}
          <Route
            path="/member-dashboard/feedback/add-feedback"
            element={<AddFeedback onClose={() => window.history.back()} />}
          />

          {/*Feedback Info*/}
          <Route
            path="/member-dashboard/feedback/:feedbackId"
            element={<FeedbackDetail onClose={() => window.history.back()} />}
          />

          {/*Room Info*/}
          <Route
            path="/member-dashboard/rooms/:roomId"
            element={<RoomDetail onClose={() => window.history.back()} />}
          />

          {/*Settings*/}
          <Route
            path="/member-dashboard/setting"
            element={<SettingDashboard onClose={() => window.history.back()} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
