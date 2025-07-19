import { Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./pages/Auth/Auth";
import Layout from "./pages/Layout";
import Dashboard from "./pages/dashboard/Dashboard";
import Coding from "./pages/coding/Coding";
import Courses from "./pages/Programs/Programs";
import { Provider } from "react-redux"
import {store} from "./redux/store"
import AddCourse from "./pages/Programs/AddCourse";
import CourseDetails from "./pages/Programs/CourseDetails"; 
import SingleTask from "./pages/compiler/Compiler";
function App() {
  return (
    <Provider store={store}>
      <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/profile" replace />} />
        <Route path="dashboard" element={<Navigate to="/profile" replace />} />
        <Route path="coding" element={<Coding />} />
        <Route path="courses" element={<Courses />} />
        <Route path="profile" element={<Dashboard />} />
        <Route path="courses/add" element={<AddCourse />} />
        <Route path="courses/:id" element={<CourseDetails />} />
        <Route path="coding/:id" element={<SingleTask />} />
        <Route path="compiler/:id/:programid" element={<SingleTask />} />
      </Route>
    </Routes>
    </Provider>
    
  );
}

export default App;