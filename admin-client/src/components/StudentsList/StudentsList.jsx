/* eslint-disable react/prop-types */
import { X } from "lucide-react";
import "./StudentsList.css";
import { useEffect, useState } from "react";

export default function StudentsList({ program, onClose }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (program?.students) {
      setStudents(program.students);
    }
  }, [program]);

  return (
    <div className="student-list-view">
      <div className="student-list-view-header">
        <div style={{ fontWeight: 650, fontSize: "1.5rem" }}>
          Students Details
        </div>
        <X size={"1.7rem"} onClick={onClose} className="close-button" />
      </div>
      <div className="student-list">
        {students.length > 0 ? (
          <table className="student-table">
            <thead>
              <tr>
                <th>S.no</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.age}</td>
                  <td>{student.gender}</td>
                  <td
                    style={{ color: "#6e4bc5", cursor: "pointer" }}
                    onClick={() => setSelectedStudent(student)}
                  >
                    More Details
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No students available.</p>
        )}
      </div>

      {selectedStudent && (
        <div className="student-details-modal">
          <div className="student-modal-header">
            <div
              style={{
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              {selectedStudent.name}&apos;s Details
            </div>
            <X
              onClick={() => setSelectedStudent(null)}
              className="close-button"
            />
          </div>

          <div className="student-modal-content">
            <p>
              <strong>Email:</strong> {selectedStudent.email || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {selectedStudent.phone || "N/A"}
            </p>
            <p>
              <strong>Age:</strong> {selectedStudent.age || "N/A"}
            </p>
            <p>
              <strong>Gender:</strong> {selectedStudent.gender || "N/A"}
            </p>
            <p>
              <strong>College:</strong>{" "}
              {selectedStudent?.college?.name || "N/A"}
            </p>
            <p>
              <strong>Roll No:</strong> {selectedStudent?.rollNo || "N/A"}
            </p>
            <p>
              <strong>College:</strong> {selectedStudent?.registerNo || "N/A"}
            </p>
            <p>
              <strong>College:</strong> {selectedStudent?.userStatus || "N/A"}
            </p>
            <div className="platform-links">
              <strong>Profiles:</strong>
              {selectedStudent.platforms?.leetcode && (
                <a
                  href={selectedStudent.platforms.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="leetcode"
                >
                  🔷 LeetCode
                </a>
              )}
              {selectedStudent.platforms?.hackerrank && (
                <a
                  href={selectedStudent.platforms.hackerrank}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hackerrank"
                >
                  🟩 HackerRank
                </a>
              )}
              {selectedStudent.platforms?.codechef && (
                <a
                  href={selectedStudent.platforms.codechef}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="codechef"
                >
                  🍛 CodeChef
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
