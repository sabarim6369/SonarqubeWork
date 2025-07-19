import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import { BACKEND_URI } from "../../utils/connectivity";
import { useDispatch } from "react-redux"
import { setStudent } from "../../redux/slices/student";


export default function AddCourse() {
  const [courseCode, setCourseCode] = useState("");
  const [course, setCourse] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const dispatch = useDispatch()
  

  const handleSubmit = async () => {
    if (!courseCode) {
      alert("Please enter a course code");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BACKEND_URI}/student/get-course?courseCode=${courseCode}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data)
      if (response.data.status === "found") {
        setCourse(response.data.program);
        setNotFound(false);
      } else {
        setCourse(null);
        setNotFound(true);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      alert("Failed to fetch course details");
    }
  };

  const handleJoinCourse = async () => {
    console.log("handleJoin")
    if(!course._id){
      alert("course not found");
      return;
    }
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(`${BACKEND_URI}/student/set-course`,
        {course : course},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if(response) {
        dispatch(setStudent(response.data.student));
        window.history.back()
      }

    }catch (error) {
      console.error("Error fetching course:", error);
      alert("Failed to fetch course details");
    }
  }

  return (
    <div className="h-full w-full flex flex-col p-20">
      <div className="flex items-center gap-2 text-4xl font-bold text-blue h-20">
        <ChevronLeft
          color="var(--backgroundBlue)"
          className="h-20 w-20 cursor-pointer"
          onClick={() => window.history.back()}
        />
        <div>Add Course</div>
      </div>
      <div className="flex flex-col flex-1 mt-3 ml-20">
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-xl font-semibold">Enter Course Code :</div>
          <div className="flex flex-row gap-4">
            <input
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-60 p-3 rounded-lg border-blue border-3 text-lg tracking-widest"
              placeholder="Course Code"
            />
            <div
              className="h-full pl-4 pr-4 bg-backgroundBlue rounded-lg items-center justify-center flex text-xl text-white font-semibold select-none cursor-pointer transition-all hover:bg-blue"
              onClick={handleSubmit}
            >
              Submit
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-between mt-5">
            {notFound ? (
              <div className="text-red-500 text-xl font-semibold">
                No Course Found with Course Code
              </div>
            ) : course ? (
              <div className="flex-1 flex-col  flex">
                <div className="font-semibold text-2xl text-blue pb-4 border-b-2 border-gray-400">
                  Course Details
                </div>
                <div className="flex-1 w-full overflow-y-scroll no-scrollbar gap-4 flex flex-col mt-4">
                  <div className="text-xl text-gray-700 flex flex-row ">
                    <div className="text-4xl font-semibold">{course.name}</div>
                  </div>
                  <div className="text-xl text-gray-700 mt-3 flex flex-row ">
                    <div className="font-semibold text-blue mr-5">Description : </div>
                    <div>{course.description}</div>
                  </div>
                  <div className="text-xl text-gray-700 mt-3 flex flex-row">
                    <div className="font-semibold text-blue mr-5">Start Date:</div>
                    <div>
                      {new Date(course.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-xl text-gray-700 mt-3 flex flex-row">
                    <div className="font-semibold text-blue mr-5">End Date:</div>
                    <div>
                      {new Date(course.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-xl text-gray-700 mt-3 flex flex-row ">
                    <div className="font-semibold text-blue mr-5">Venue : </div>
                    <div>{course.venue}</div>
                  </div>
                  <div className="text-xl text-gray-700 mt-3 flex flex-row ">
                    <div className="font-semibold text-blue mr-5">Location : </div>
                    <div>{course.location}</div>
                  </div>
                  <div className="text-xl text-gray-700 mt-3 flex flex-row ">
                    <div className="font-semibold text-blue mr-5">ProgramStatus : </div>
                    <div>{course.programStatus}</div>
                  </div>
                </div>
                <div className="flex flex-row w-[100%] p-5 pl-0">
                  <div className="p-5 bg-backgroundBlue rounded-lg text-white font-semibold cursor-pointer" onClick={() => handleJoinCourse()}>
                    JOIN COURSE
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
