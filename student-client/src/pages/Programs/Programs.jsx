import { useEffect, useState } from "react";
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"


export default function Course() {
  const student = useSelector((state) => state.student)
  const [courses, setCourses] = useState([])
  const navigation = useNavigate()

  useEffect(() => {
    setCourses(student.program_id)
    console.log(student.program_id)
  }, [student])
  return (
    <div className="h-full w-full flex flex-col p-20">
      <div className="font-bold text-4xl text-blue flex justify-between items-center ">
        <div>Enrolled Courses</div>
        <div className="h-20 aspect-square bg-blue rounded-full flex items-center justify-center hover:scale-105 cursor-pointer transition-all" onClick={() => navigation("/courses/add")}>
          <Plus color="white" className="h-3/6 w-3/6" />
        </div>
      </div>
      <div className="flex-1 overflow-y-scroll flex-wrap no-scrollbar gap-10 flex mt-5 ">

        {

          courses.map((course, index) => {
            console.log(course)
            return (
              <div
                className="h-100 w-100 border rounded-3xl border-cyan-50 flex flex-col p-10 shadow-[8px_8px_20px_2px_rgba(59,130,246,0.2)] hover:shadow-[10px_10px_20px_2px_rgba(59,130,246,0.2)] transition-all bg-cyan-50 cursor-pointer"
                key={index}
                onClick={() => navigation(`/courses/${course._id}`)}
              >
                <div className="font-semibold text-blue text-2xl mb-1">{course.name}</div>
                <div className="text-base mb-5">{course.description}</div>
                <div className="font-semibold text-blue">Program Id : {course.programId}</div>
                <div className="font-semibold text-blue">Batch : {course.batch}</div>
                <div className="mb-5"><span className="font-semibold text-blue ">Status : </span><span>{course.programStatus}</span></div>
                <div>
                  <span className="font-semibold text-blue">Start Date: </span>
                  <span>{new Date(course.startDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue">End Date: </span>
                  <span>{new Date(course.endDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue">Location:  </span>
                  <span>{course.location}</span>
                </div>

              </div>
            )

          })
        }
      </div>

    </div>
  );
}
