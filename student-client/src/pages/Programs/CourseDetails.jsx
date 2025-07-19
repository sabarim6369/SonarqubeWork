import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URI } from "../../utils/connectivity";
import { useSelector } from "react-redux";
import {
  ChevronRight,
  RotateCw,
  ChevronLeft,
  ListCollapse,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setStudent } from "../../redux/slices/student";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [notCompletedTasks, setNotCompletedTasks] = useState([]);
  const student = useSelector((state) => state.student);
  const [platform, setPlatform] = useState(null);
  const [link, setLink] = useState("");
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isPlatformLinked, setIsPlatformLinked] = useState(true);
  const [platformLinks, setPlatformLinks] = useState({});
  const navigate = useNavigate();
  const [isTask, setTask] = useState(false)

  const [progressData, setProgressData] = useState({
    total: 0,
    completed: 0,
  });

  const platforms = ["leetcode", "hackerrank", "codechef"];

  useEffect(() => {
    const fetchDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${BACKEND_URI}/student/get-course-details?program_id=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response) {
          setCourse({
            ...response.data.course,
            startDate: new Date(response.data.course.startDate),
            endDate: new Date(response.data.course.endDate),
          });

          setTasks(response.data.course.studentTasks);
          console.log(response.data.course);

          const completed = response.data.course.studentTasks.filter((task) =>
            task.studentsCompleted.some(
              (studentId) => studentId === student._id
            )
          );

          const notCompleted = response.data.course.studentTasks.filter(
            (task) =>
              !task.studentsCompleted.some(
                (studentId) => studentId === student._id
              )
          );

          console.log("All Tasks:", response.data.course.studentTasks);
          console.log("Completed Tasks:", completed);
          console.log("Not Completed Tasks:", notCompleted);

          setCompletedTasks(completed);
          setNotCompletedTasks(notCompleted);

          const totalTasks = response.data.course.studentTasks.length;
          const completedCount = completed.length;
          const progress =
            totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
          setProgressPercentage(progress);
          setProgressData({
            total: totalTasks,
            completed: completedCount,
          });
          platforms.forEach((platform) => {
            console.log(platform)
            if (
              response.data &&
              student.platforms[platform] === "not-assigned"
            ) {
              
              setIsPlatformLinked(false);
            }
          });

          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, student._id]);
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
  
      // Filter tasks based on the selected date
      const tasksForDate = tasks.filter(
        (task) =>
          task.date && new Date(task.date).toISOString().split("T")[0] === formattedDate
      );
  
      // Separate completed and not completed tasks for the selected date
      const completedOnSelectedDate = tasksForDate.filter((task) =>
        task.studentsCompleted.some((studentId) => studentId === student._id)
      );
  
      const notCompletedOnSelectedDate = tasksForDate.filter(
        (task) =>
          !task.studentsCompleted.some((studentId) => studentId === student._id)
      );
  
      // Update progress percentage and task lists
      const progress =
        tasksForDate.length > 0
          ? (completedOnSelectedDate.length / tasksForDate.length) * 100
          : 0;
  
      setProgressPercentage(progress);
      setProgressData({
        total: tasksForDate.length,
        completed: completedOnSelectedDate.length,
      });
      setCompletedTasks(completedOnSelectedDate);
      setNotCompletedTasks(notCompletedOnSelectedDate);
    } else {
      // Default case when no date is selected
      setCompletedTasks(tasks.filter((task) =>
        task.studentsCompleted.some((studentId) => studentId === student._id)
      ));
      setNotCompletedTasks(tasks.filter(
        (task) =>
          !task.studentsCompleted.some((studentId) => studentId === student._id)
      ));
      setProgressPercentage((completedTasks.length / tasks.length) * 100 || 0);
      setProgressData({
        total: tasks.length,
        completed: completedTasks.length,
      });
    }
  }, [selectedDate, tasks, student._id]);
  
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];

      const completedOnSelectedDate = completedTasks.filter((task) => {
        return (
          task.date &&
          new Date(task.date).toISOString().split("T")[0] === formattedDate
        );
      });

      const totalTasksForDate = tasks.filter((task) => {
        return (
          task.date &&
          new Date(task.date).toISOString().split("T")[0] === formattedDate
        );
      });

      const progress =
        totalTasksForDate.length > 0
          ? (completedOnSelectedDate.length / totalTasksForDate.length) * 100
          : 0;

      setProgressPercentage(progress);
      setProgressData({
        total: totalTasksForDate.length,
        completed: completedOnSelectedDate.length,
      });
    } else {
      const totalTasks = tasks.length;
      const completedCount = completedTasks.length;
      const overallProgress =
        totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
      setProgressPercentage(overallProgress);
      setProgressData({ total: totalTasks, completed: completedCount });
    }
  }, [selectedDate, completedTasks, tasks]);

  const handleTaskReload = async (task) => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URI}/student/evaluate-problem`,
        { task: task, id: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response) {
        if (response.status === 200) {
          console.log("task completed sucessfully");
          setTasks(response.data.course.studentTasks);
          console.log(response.data.course);

          const completed = response.data.course.studentTasks.filter((task) =>
            task.studentsCompleted.some(
              (studentId) => studentId === student._id
            )
          );

          const notCompleted = response.data.course.studentTasks.filter(
            (task) =>
              !task.studentsCompleted.some(
                (studentId) => studentId === student._id
              )
          );
          setCompletedTasks(completed);
          setNotCompletedTasks(notCompleted);
          setProgressPercentage();
          setLoading(false);
        } else if (response.status === 201) {
          console.log("task not completed");
          setLoading(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleInputChange = (platform, value) => {
    setPlatformLinks((prev) => ({ ...prev, [platform]: value }));
  };
  const handleSubmit = (platform) => {
    if (platformLinks[platform]) {
      handlePlatform(platformLinks[platform], platform);
    } else {
      console.log("Please enter a link for", platform);
    }
  };
  const handlePlatform = async (link, platform) => {
    console.log("handlePlatform");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BACKEND_URI}/student/set-platform`,
        { platform: platform, link: link },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response) {
        console.log("platform set sucessfully");
        console.log(response.data.student);
        dispatch(setStudent(response.data.student));
        let count = 0;
        platforms.forEach((platform) => {
          if (
            response.data &&
            response.data.student.platforms[platform] === "not-assigned"
          ) {
            count++;
          } 
          if (count === 0) {
            console.log("all platforms linked");
            setIsPlatformLinked(true);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div>loading...</div>;
  }

  if (!isPlatformLinked) {
    return (
      <div className="w-full h-full flex flex-col p-15">
        <div className="text-blue text-3xl font-medium">
          Link Platforms to Continue
        </div>
        <div className="mt-4 flex-1 overflow-y-scroll no-scrollbar">
          {platforms.map((platform) => {
            return (
              <div
                className="flex flex-row mt-6 mb-6 items-center h-20 rounded-xl pl-4"
                key={platform}
              >
                <div className="text-xl font-semibold text-blue w-[15%]">
                  {platform}
                </div>
                {student.platforms[platform] === "not-assigned" ? (
                  <div className="flex flex-row items-center flex-1 gap-4">
                    <input
                      type="text"
                      className="border-b-2 border-blue text-lg w-[50%] outline-none"
                      placeholder={`${platform} link`}
                      value={platformLinks[platform] || ""}
                      onChange={(e) =>
                        handleInputChange(platform, e.target.value)
                      }
                    />
                    <button
                      className="h-12 aspect-square bg-backgroundBlue rounded-full items-center justify-center flex cursor-pointer hover:scale-105 hover:bg-blue transition-all"
                      onClick={() => handleSubmit(platform)}
                    >
                      <ChevronRight color="white" className="h-1/2 w-1/2" />
                    </button>
                  </div>
                ) : (
                  <div className="text-xl font-semibold text-backgroundBlue">
                    Linked !
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const startDate = course?.startDate ? new Date(course.startDate) : null;
  const endDate = course?.endDate ? new Date(course.endDate) : null;
  const isDateInRange = (date) => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  return (
    <div className={`h-full w-full flex flex-row relative transition-all duration-500`}>
      <div className="flex-1 p-15  flex-col flex pr-0">
        <div className={`${isTask ? "hidden" : "block"} transition-all duration-500`}>
          <div className="font-semibold text-3xl text-blue">{course.name}</div>
          <div className="">{course.description}</div>
        </div>
        <div className={`flex-1 overflow-y-scroll no-scrollbar  ${isTask ? "w-full h-full" : "mt-20"} transition-all duration-500`} >
          <div className={`h-[400px] w-full   rounded-3xl mb-10 p-8 flex flex-col  ${isTask ? "w-full h-full" : "bg-slate-50 "} transition-all duration-500`}>
            <div className="font-semibold text-2xl text-blue pb-3 border-b-2 border-gray-300 flex flex-row items-center justify-between">
              <span>Tasks</span>
              <div className="pr-4 cursor-pointer" onClick={() => {setTask(!isTask)} }>
                <ListCollapse
                  color="var(--backgroundBlue)"
                  className="h-8 w-8"
                />
              </div>
            </div>
            <div className="overflow-y-scroll no-scrollbar flex-1">
              {notCompletedTasks.map((task, index) => (
                <div
                  className="pt-4 pb-4 flex flex-row items-center justify-between border-b-2 border-gray-300 "
                  key={index}
                >
                  <div>
                    <div className="font-semibold , text-lg">
                      {task.taskName}
                    </div>
                    <div
                      className="h-6 overflow-hidden text-gray-500"
                      style={{
                        boxShadow:
                          "inset -10px 0px 30px -10px rgba(255, 255, 255, 1)",
                      }}
                    >
                      {task.description}
                    </div>
                  </div>
                  {student.platforms[task.platform] &&
                  student.platforms[task.platform] !== "not-assigned" ? (
                    <div className="flex flex-row items-center h-13 gap-4 pr-4">
                      <div
                        className="h-full aspect-square rounded-full bg-backgroundBlue flex items-center justify-center cursor-pointer transition-all hover:scale-105"
                        onClick={() => {
                          handleTaskReload(task);
                        }}
                      >
                        <RotateCw color="white" className="h-2.5/5 w-full" />
                      </div>
                      <div
                        className="h-full aspect-square rounded-full bg-blue flex items-center justify-center cursor-pointer  transition-all hover:scale-105"
                        onClick={() => {
                          window.open(
                            task.link,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                      >
                        <ChevronRight color="white" className="h-3/5 w-full" />
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-lg">
                      Link {task.platform}!
                    </div>
                  )}
                </div>
              ))}

              {completedTasks.map((task, index) => (
                <div
                  className="pt-4 pb-4 flex flex-row items-center justify-between border-b-2 border-gray-300 "
                  key={index}
                >
                  <div>
                    <div className="font-semibold , text-lg">
                      {task.taskName}
                    </div>
                    <div
                      className="h-6 overflow-hidden text-gray-500"
                      style={{
                        boxShadow:
                          "inset -10px 0px 30px -10px rgba(255, 255, 255, 1)",
                      }}
                    >
                      {task.description}{" "}
                    </div>
                  </div>
                  <div className="flex flex-row items-center h-13 gap-4 pr-4">
                    <div className="p-2 rounded-full bg-lime-200 text-lime-600 pl-4 pr-4">
                      Completed
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={`w-full flex flex-row justify-between ${isTask ? "hidden" : null} transition-all duration-500`}>
              
            <div className="h-[400px] w-full rounded-3xl mb-10 p-8 flex flex-col transition-all bg-slate-50">
              <div className="font-semibold text-2xl text-blue pb-3 border-b-2 border-gray-300">
                Announcements
              </div>
            </div>  
          </div>
        </div>
      </div>
      <div className="h-full max-w-[500px] w-[40%] min-w-[200px] overflow-y-scroll no-scrollbar flex flex-col items-center ">
        <div className="w-8/10 mt-5 bg-white flex items-center justify-center relative">
          <Calendar
            onClickDay={(date) =>
              setSelectedDate(  
                selectedDate &&
                  selectedDate.toDateString() === date.toDateString()
                  ? null
                  : date
              )
            }
            tileClassName={({ date, view }) => {
              const isCurrentDate =
                new Date().toDateString() === date.toDateString();
              const isSelected =
                selectedDate &&
                date.toDateString() === selectedDate.toDateString();
              if (view === "month") {
                if (isSelected) {
                  return "selected-date";
                } else if (isCurrentDate) {
                  return "current-date";
                } else if (isDateInRange(date)) {
                  return "highlighted";
                }
              }
              return "";
            }}
          />
        </div>
        <div className="mt-10 w-3/4">
          <div className="text-2xl font-medium text-blue tracking-wide w-full flex items-center justify-center">
            Event Stats
          </div>
          <div className="w-full items-center justify-center flex mt-4 relative">
            <div className="absolute text-xl font-bold text-blue">
              {progressPercentage}%
            </div>
            <div className="w-3/7 p-1">
              <CircularProgressbar
                value={progressPercentage}
                strokeWidth={7}
                styles={buildStyles({
                  trailColor: "#e8e8e8",
                  pathColor: "var(--backgroundBlue)",
                  pathTransitionDuration: 0.5,
                })}
              />
            </div>
          </div>
          <div className="w-full flex items-center justify-center mt-2 text-base font-semibold text-gray-400">
            {selectedDate
              ? selectedDate.toLocaleDateString("en-GB")
              : course.startDate.toLocaleDateString("en-GB") +
                " to " +
                course.endDate.toLocaleDateString("en-GB")}
          </div>
          <div className="mt-8 text-xl w-full flex items-center justify-center font-medium">
            <div className="w-7/7 flex flex-col items-center justify-between gap-2">
              <div className="w-full font-semibold  text-2xl flex flex-row items-center justify-center bg-sky-50 p-4 rounded-xl text-backgroundBlue">
                Total Tasks : {progressData.total ? progressData.total : 0}
              </div>
              <div className="w-full flex flex-row gap-2">
                <div className="w-[49%] text-lg flex items-center justify-center pt-4 pb-4 rounded-xl bg-lime-100 text-lime-600">
                  <div>
                    Completed :{" "}
                    {progressData.completed ? progressData.completed : 0}
                  </div>
                </div>
                <div className="w-[49%] text-lg flex items-center justify-center pt-4 pb-4 rounded-xl bg-red-100 text-red-500">
                  <div>
                    Remaining :{" "}
                    {progressData.completed && progressData.total
                      ? progressData.total - progressData.completed
                      : 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 w-3/4">
          <div className="text-2xl font-medium text-blue tracking-wide w-full flex items-center justify-center">
            Event Details
          </div>
          <div className="flex flex-col gap-4 mt-6 text-lg mb-10">
            <div className="flex flex-row items">
              <span className="text-gray-500 font-semibold">Start Date : </span>{" "}
              &nbsp; &nbsp;{" "}
              <span>{course.startDate.toLocaleDateString("en-GB")}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold">End Date : </span>{" "}
              &nbsp; &nbsp;{" "}
              <span>{course.endDate.toLocaleDateString("en-GB")}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold">
                programStatus :{" "}
              </span>{" "}
              &nbsp; &nbsp;{" "}
              <span
                className={`font-semibold pt-1 pb-1 pl-4 pr-4 rounded-full ${
                  course.programStatus === "Ongoing"
                    ? "text-backgroundBlue bg-sky-100"
                    : course.programStatus === "Completed"
                    ? "text-lime-600 bg-lime-100"
                    : course.programStatus === "Cancelled"
                    ? "text-red-600 bg-red-100"
                    : null
                }`}
              >
                {course.programStatus}
              </span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold">Batch : </span>{" "}
              &nbsp; &nbsp; <span>{course.batch}</span>
            </div>
            <div>
              <span className="text-gray-500 font-semibold">Location : </span>{" "}
              &nbsp; &nbsp; <span>{course.location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
