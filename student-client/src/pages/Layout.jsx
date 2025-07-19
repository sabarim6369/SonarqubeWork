import React, { useEffect , useState} from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import RampexLogo from "../assets/images/rampex.png";
import CodeBlack from "../assets/images/code-black.png";
import CodeWhite from "../assets/images/code-white.png";
import DashBlack from "../assets/images/dash-black.png";
import DashWhite from "../assets/images/dash-white.png";
import TaskBlack from "../assets/images/task-black.png";
import TaskWhite from "../assets/images/task-white.png";
import Profile from "../assets/images/profile.png";
import { useSelector } from "react-redux";
import axios from "axios";
import { setStudent } from "../redux/slices/student";
import { setCoding } from "../redux/slices/coding";
import { useDispatch } from "react-redux";
import {BACKEND_URI} from "../utils/connectivity"
import { IoExitOutline } from "react-icons/io5";

export default function Layout() {
  const student = useSelector((state) => state.student);
  const coding = useSelector((state) => state.coding);
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        console.log("Fetching student data...");
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth");
          return;
        }
        
        const response = await axios.get(`${BACKEND_URI}/student/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

  
        if (response.status === 200) {
          dispatch(setStudent(response.data.student));
        }

        const codingResponse = await axios.get(`${BACKEND_URI}/student/get-coding`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (codingResponse.status === 200) {
          console.log("Coding data fetched successfully:", codingResponse.data);
          dispatch(setCoding( codingResponse.data ));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        localStorage.removeItem("token");
        navigate("/auth"); 
      }
    };
  
    fetchStudent();
  }, []);

  const menuItems = [
    {
      name: "Coding",
      path: "/coding",
      icons: { active: CodeWhite, inactive: CodeBlack },
    },
    {
      name: "Courses",
      path: "/courses",
      icons: { active: TaskWhite, inactive: TaskBlack },
    },
  ];

  if(loading) {
    return <div>Loading...</div>
  }
  return (
    <div className="h-screen w-screen bg-white flex flex-row">
      <div className="w-1/6 max-w-[220px] min-w-[200px] bg-white border-r border-white flex flex-col items-center py-4 h-screen shadow-2xl">
        <img
          src={RampexLogo}
          className="w-4/5 h-auto contain-content"
          alt="Rampex Logo"
        />

        <div className="w-full flex flex-col items-center gap-6 mt-10 flex-1">
          {menuItems.map(({ name, path, icons }) => (
            <div
              key={path}
              className={`w-9/10 h-[50px] flex flex-row items-center gap-4 pl-6 rounded-lg cursor-pointer transition-all hover:bg-backgroundBlue
                ${
                  currentRoute.startsWith(path)
                    ? "bg-blue text-white"
                    : "bg-white text-black"
                }`}
              onClick={() => navigate(path)}
            >
              <img
                src={currentRoute.startsWith(path) ? icons.active : icons.inactive}
                className="h-3/6 aspect-square object-contain"
                alt={`${name} Icon`}
              />
              <div className="text-lg font-poppins font-medium">{name}</div>
            </div>
          ))}
        </div>
        <div className="w-9/10 h-[80px] flex flex-row items-center gap-4 cursor-pointer">
          <div className="h-4/5 aspect-square bg-backgroundBlue rounded-full flex items-center justify-center">
            <img
              src={Profile}
              alt="profile"
              className="h-2/5 aspect-square object-contain"
               onClick={() => navigate("/profile")}
            />
          </div>
          <div className="flex flex-col h-full justify-center font-lato font-medium text-base">
            {student.name}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
