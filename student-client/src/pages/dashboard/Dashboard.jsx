import { useSelector } from "react-redux";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays } from "date-fns";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import React, { useState, useEffect } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import bronze from "../../assets/images/bronze.png";
import { FaCheckCircle } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { RiProgress2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaRankingStar } from "react-icons/fa6";
import { BiWorld } from "react-icons/bi";
import { TbFileReport } from "react-icons/tb";
import { SiLeetcode } from "react-icons/si";
import { AiFillFile } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";

import { TbHexagonLetterAFilled } from "react-icons/tb";
import { TbHexagonLetterQFilled } from "react-icons/tb";
import { TbHexagonLetterVFilled } from "react-icons/tb";
import { HiOutlineExternalLink } from "react-icons/hi";

export default function Dashboard() {
  const student = useSelector((state) => state.student);
  const programs = student.program_id;
  console.log(programs);
  const activityData = [
    { date: "2025-03-30", count: 1 },
    { date: "2025-04-01", count: 3 },
    { date: "2025-04-04", count: 4 },
    { date: "2025-04-06", count: 2 },
  ];
  const [Easyprogress, setEasyProgress] = useState(50);
  const [Mediumprogress, setMediumProgress] = useState(23);
  const [HardProgress, setHardProgress] = useState(12);
  const [rampexProgress, setRampexProgress] = useState({
    easy: 10,
    medium: 20,
    hard: 30,
    total: 60,
    monthly: 20,
    streak: 5,
    badge: "Bronze",
  });
  const navigate = useNavigate();
  const [codingTab, setCodingTab] = useState("submissions");
  const [courseTab, setCourseTab] = useState("ongoing");

  const onGoingCourses = () => {
    return programs
      .filter((program) => program.programStatus === "Ongoing")
      .map((program) => (
        <div
          key={program._id}
          className="flex flex-row w-full rounded-lg  justify-between items-center bg-gray-200 p-4 select-none cursor-pointer hover:bg-gray-300"
          onClick={() => {
            navigate(`/courses/${program._id}`);
          }}
        >
          <div>
            <div className="text-base font-semibold">{program.name}</div>
            <div className="text-xs">{program.description}</div>
            <div className="text-xs mt-2">
              {new Date(program.startDate).toLocaleDateString()} -{" "}
              {new Date(program.endDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <FaLink />
          </div>
        </div>
      ));
  };
  const completedCourses = () => {
    return programs
      .filter((program) => program.programStatus === "Completed")
      .map((program) => (
        <div
          key={program._id}
          className="flex flex-row w-full rounded-lg  justify-between items-center bg-gray-200 p-4 select-none cursor-pointer hover:bg-gray-300 transition-all"
          onClick={() => {
            navigate(`/courses/${program._id}`);
          }}
        >
          <div>
            <div className="text-base font-semibold">{program.name}</div>
            <div className="text-xs">{program.description}</div>
            <div className="text-xs mt-2">
              {new Date(program.startDate).toLocaleDateString()} -{" "}
              {new Date(program.endDate).toLocaleDateString()}
            </div>
          </div>
          <div>
            <FaLink />
          </div>
        </div>
      ));
  };
  const ProgressBar = ({ progress, color }) => {
    return (
      <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden mb-4">
        <div
          className={`${color} h-full flex items-center justify-end transition-all duration-500 text-white font-semibold pr-2`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="overflow-y-auto h-full w-full">
      <div className="flex flex-row w-full p-4">
        <div className="flex flex-col w-[65%] p-4 gap-4">
          <div className="flex flex-row w-full gap-4 ">
            <div className="flex flex-row  w-1/2 bg-gray-100 h-50 rounded-xl ">
              <div className="w-[40%] flex flex-col items-center justify-center ">
                <div className="h-30 flex items-center  w-full">
                  <CircularProgressbar
                    value={12}
                    strokeWidth={7}
                    styles={buildStyles({
                      trailColor: "",
                      pathColor: "var(--backgroundBlue)",
                      pathTransitionDuration: 0.5,
                      textColor: "black",
                      textSize: "20px",
                      textStyle: {
                        fontWeight: "bold",
                      },
                    })}
                    text="12%"
                    className="h-9/10 aspect-square flex items-center justify-center"
                  ></CircularProgressbar>
                </div>
                <div className="font-medium text-base ">120/1200</div>
              </div>
              <div className="flex flex-col flex-1 pt-6 pb-6">
                <div className="text-sm flex-1 w-9/10  rounded-xl flex flex-col pl-3 pr-3 justify-center">
                  <div className="pt-2 flex flex-row justify-between">
                    <div>Easy</div>
                    <div>12/500</div>
                  </div>
                  <ProgressBar progress={Easyprogress} color={"bg-green-500"} />
                </div>
                <div className="text-sm flex-1 w-9/10  rounded-xl flex flex-col pl-3 pr-3 justify-center">
                  <div className="pt-2 flex flex-row justify-between">
                    <div>Medium</div>
                    <div>12/500</div>
                  </div>
                  <ProgressBar
                    progress={Mediumprogress}
                    color={"bg-yellow-500"}
                  />
                </div>
                <div className="text-sm flex-1 w-9/10 rounded-xl flex flex-col pl-3 pr-3 justify-center">
                  <div className="pt-2 flex flex-row justify-between">
                    <div>Hard</div>
                    <div>12/500</div>
                  </div>
                  <ProgressBar
                    progress={HardProgress}
                    color={"bg-orange-500"}
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2 h-50 bg-gray-100 rounded-lg p-4 flex flex-col">
              <div className="text-lg font-semibold text-backgroundBlue flex flex-row items-center justify-between">
                <div>
                  Badges : <span className="text-blue pl-2 ">4</span>{" "}
                </div>
                <div className="cursor-pointer">
                  <HiOutlineExternalLink className="h-5 w-5" color="gray" />
                </div>
              </div>
              <div className="flex flex-row justify-evenly items-center flex-1 ">
                <div className="h-full w-1/3 flex flex-col items-center justify-center">
                  <TbHexagonLetterAFilled
                    className="h-4/10 w-full"
                    color="var(--backgroundBlue)"
                  />
                  <div className="text-xs font-semibold text-gray-500 mt-2">
                    Beginner
                  </div>
                </div>
                <div className="h-full w-1/3 flex flex-col items-center justify-center">
                  <TbHexagonLetterQFilled
                    className="h-6/10 w-full"
                    color="var(--blue)"
                  />
                  <div className="text-xs font-semibold text-gray-500 mt-2">
                    Over Archiever
                  </div>
                </div>
                <div className="h-full w-1/3 flex flex-col items-center justify-center">
                  <TbHexagonLetterVFilled
                    className="h-4/10 w-full"
                    color="var(--backgroundBlue)"
                  />
                  <div className="text-xs font-semibold text-gray-500 mt-2">
                    Competator
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-xl flex flex-col p-4 pb-0 gap-2 h-60 justify-center">
            <div className="font-semibold text-lg text-backgroundBlue flex flex-row items-center justify-between ">
              <div className="mt-1 mb-1">Activity Map</div>
              <div className="text-gray-500 text-sm flex flex-row gap-2 items-center">
                <div>
                  Active Days :{" "}
                  <span className="text-blue">{activityData.length} </span>
                </div>
                <div className="h-5 border-x-2 border-gray-200 rounded-full "></div>
                <div>
                  Total Submissions : <span className="text-blue">10 </span>
                </div>
              </div>
            </div>
            <div style={{ transform: "scale(1)", transformOrigin: "top left" }}>
              <Tooltip id="heatmap-tooltip" />
              <CalendarHeatmap
                startDate={subDays(new Date(), 365)}
                endDate={new Date()}
                values={activityData}
                showWeekdayLabels={true}
                gutterSize={1}
                tooltipDataAttrs={(value) => {
                  if (!value?.date) return null;
                  return {
                    "data-tooltip-id": "heatmap-tooltip",
                    "data-tooltip-content": `${value.date}: ${
                      value.count || 0
                    } activities`,
                  };
                }}
                transformDayElement={(rect, value) => {
                  let fill = "#e5e7eb";
                  if (value?.count >= 1 && value.count < 2) fill = "#0086d1";
                  else if (value?.count < 4) fill = "#0173e6";
                  else if (value?.count >= 4) fill = "#1b1464";

                  return React.cloneElement(rect, {
                    width: 9,
                    height: 9,
                    rx: 2,
                    ry: 2,
                    style: { fill },
                  });
                }}
              />
            </div>
          </div>
          <div className="w-full h-150 bg-gray-100 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex flex-row gap-4 items-center">
              <div
                className={`rounded-lg w-40 flex flex-row gap-2 p-2 items-center ${
                  codingTab === "submissions"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200"
                } select-none cursor-pointer`}
                onClick={() => setCodingTab("submissions")}
              >
                <TbFileReport
                  className="h-7 w-7"
                  color={codingTab === "submissions" ? "#fff" : "#333"}
                />
                <div className=" text-sm">Submissions</div>
              </div>
              <div className="h-9 border-x-1  rounded-full border-gray-400"></div>
              <div
                className={`rounded-lg w-40  flex flex-row gap-2 p-2 items-center ${
                  codingTab === "solved"
                    ? "bg-gray-600 text-white"
                    : "bg-gray-200"
                } select-none cursor-pointer`}
                onClick={() => setCodingTab("solved")}
              >
                <IoCheckmarkCircleSharp
                  className="h-7 w-7"
                  color={codingTab === "solved" ? "#fff" : "#333"}
                />
                <div className=" text-sm">Solved</div>
              </div>
            </div>
            {codingTab === "submissions" ? (
              <div className="h-150 w-full overflow-y-auto">
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <AiFillFile className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Print Star Pattern - using for loops</div>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div className="h-7 flex items-center justify-center w-20 text-sm bg-lime-200 rounded-full text-lime-700">Solved</div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <AiFillFile className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Generate Random number using random function</div>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div className="h-7 flex items-center justify-center w-20 text-sm bg-lime-200 rounded-full text-lime-700">Solved</div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <AiFillFile className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Find pattern in a string under O(nlog n) time</div>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div className="h-7 flex items-center justify-center w-20 text-sm bg-lime-200 rounded-full text-lime-700">Solved</div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <AiFillFile className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Print Star Pattern - using for loops</div>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div className="h-7 flex items-center justify-center w-24 text-sm bg-red-200 rounded-full text-red-700">UnSolved</div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <AiFillFile className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Generate Random number using random function</div>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div className="h-7 flex items-center justify-center w-24 text-sm bg-red-200 rounded-full text-red-700">UnSolved</div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <AiFillFile className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Find pattern in a string under O(nlog n) time</div>
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    <div className="h-7 flex items-center justify-center w-24 text-sm bg-red-200 rounded-full text-red-700">UnSolved</div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
              </div>
              
            ) : codingTab === "solved" ? (
              <div className="h-150 w-full overflow-y-auto">
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <IoCheckmarkDone className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Print Star Pattern - using for loops</div>
                  </div>
                  <div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <IoCheckmarkDone className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Generate Random number using random function</div>
                  </div>
                  <div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
                <div className="flex flex-row justify-between h-15 w-full bg-gray-200 rounded-lg mb-4 items-center p-4 gap-4 hover:bg-gray-300 cursor-pointer relative">
                  <div className="flex flex-row items-center gap-4" >
                  <IoCheckmarkDone className="h-5 w-5" color="#444"/>
                  <div className="text-sm font-medium">Find pattern in a string under O(nlog n) time</div>
                  </div>
                  <div>
                    <IoIosArrowForward  className="h-5 w-5" color="#444"/>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="flex flex-col w-[35%] p-4 pl-0 gap-4">
          <div className="flex flex-col w-full h-114 bg-gray-100 rounded-xl">
            <div className="flex flex-col w-full items-center pt-10 p-4">
              <div>
                <CgProfile className="h-20 w-full" />
              </div>
              <div className="text-xl font-semibold text-backgroundBlue mt-2">
                {student.name}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                Email : {student.email}
              </div>
            </div>
            <div className="flex flex-col flex-1 bg-gray-200 m-4 rounded-xl p-4">
              <div className="flex flex-row justify-between items-center mb-4">
                <div className="text-lg font-semibold text-backgroundBlue">
                  Rankings
                </div>
                <FaRankingStar
                  className="h-8 w-8"
                  color="var(--backgroundBlue)"
                />
              </div>
              <div className="w-full border-t-1 border-gray-700 mb-4"></div>
              <div className="font-medium text-sm text-gray-500 mb-2">
                College : {student.collegeId.name}
              </div>
              <div className="font-medium text-gray-800 mb-2">
                College Ranking :{" "}
                <span className="text-backgroundBlue font-semibold">120</span>{" "}
              </div>
              <div className="font-medium text-sm text-gray-500 mb-4">
                {" "}
                You Beat 90% of the students
              </div>
              <div className="w-full border-t-1 border-gray-700 mb-4"></div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-base font-medium ">
                  Global Ranking :{" "}
                  <span className="text-backgroundBlue font-semibold">
                    1002030
                  </span>
                </div>
                <div>
                  {" "}
                  <BiWorld className="h-6 w-6" color="var(--backgroundBlue)" />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full h-150 bg-gray-100 rounded-xl p-4 flex flex-col gap-4 items-center">
            <div className="font-semibold text-blue text-lg">Course Details</div>
            <div className="flex flex-row w-full gap-4">
              <div className={`w-1/2 h-20 rounded-xl bg-gray-200 flex flex-col justify-center items-center gap-1 ${courseTab === "ongoing" ? "bg-gray-300" : ""} select-none cursor-pointer`} onClick={() => setCourseTab("ongoing")}>
                <div className="font-semibold">On Going</div>
                <RiProgress2Fill className="h-5 w-5" color="var(--backgroundBlue)" />
              </div>
              <div className={`w-1/2 h-20 rounded-xl bg-gray-200 flex flex-col justify-center items-center gap-1 ${courseTab === "completed" ? "bg-gray-300" : ""} select-none cursor-pointer`} onClick={() => setCourseTab("completed")}>
                <div className="font-semibold">Completed</div>
                <RiProgress2Fill className="h-5 w-5" color="var(--backgroundBlue)" />
              </div>
            </div>
            <div className="w-full h-130 overflow-y-auto">
            {
              courseTab === "ongoing"
                ? onGoingCourses()
                : completedCourses()
            }
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
