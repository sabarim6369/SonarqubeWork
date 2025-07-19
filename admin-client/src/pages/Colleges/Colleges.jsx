import { useState, useEffect, useCallback, useMemo } from "react";
import AddCollege from "../../components/AddCollegePanel/AddCollegePanel";
import "./Colleges.css";
import { Search } from "lucide-react";
import { getAllColleges } from "../../services/AdminOperations";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import ViewCollege from "../../components/ViewCollege/ViewCollege";

export default function Colleges() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [addCollegeModalIsOpen, setAddCollegeModalIsOpen] = useState(false);
  const [error] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const token = useMemo(() => localStorage.getItem("Token"), []);
  const dispatch = useDispatch();

  const colleges = useSelector((state) => state.admin.colleges, shallowEqual);

  const fetchAllColleges = async () => {
    await getAllColleges(token, dispatch);
  };

  useEffect(() => {
    fetchAllColleges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (colleges) {
      if (searchQuery) {
        const filtered = colleges.filter((college) => {
          return (
            college.collegeId?.toString().includes(searchQuery) ||
            college.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            college.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (typeof college.specialization === "string" &&
              college.specialization
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
          );
        });
        setFilteredColleges(filtered);
      } else {
        setFilteredColleges(colleges);
      }
    }
  }, [searchQuery, colleges]);

  const handleViewMore = useCallback((college) => {
    setSelectedCollege(college);
    setModalIsOpen(true);
  }, []);

  return (
    <div className="colleges-container">
      <div className="colleges-header">
        <div className="colleges-header-text">
          <div className="vertical-bar-title"></div>
          <div className="colleges-title">Manage Colleges</div>
        </div>
        <div className="colleges-header-left">
          <div className="colleges-searchbar-container">
            <Search size="1.7rem" color="#9CA3AF" />
            <input
              className="colleges-search-bar"
              type="text"
              placeholder="Search colleges, programs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            className="colleges-add-button"
            onClick={() => setAddCollegeModalIsOpen(true)}
            aria-label="Add a new college"
          >
            Add College
          </div>
        </div>
      </div>
      <div className="colleges-content">
        {error && <div className="error-message">{error}</div>}
        {(filteredColleges && filteredColleges.length === 0) ||
        (filteredColleges && filteredColleges.every((college) => !college)) ? (
          <div className="no-items-found-text">No colleges available</div>
        ) : (
          <table className="colleges-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Collegename</th>
                <th>Email</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filteredColleges) &&
              filteredColleges.length > 0 ? (
                filteredColleges.map((college, index) => (
                  <tr key={college._id}>
                    <td>{index + 1}</td>
                    <td>{college.name || "N/A"}</td>
                    <td>{college.email || "N/A"}</td>
                    <td>{college.location}</td>
                    <td>
                      <div
                        className={`colleges-table-status-container ${
                          college.programsAssigned?.some(
                            (program) =>
                              program.programStatus?.toLowerCase() === "ongoing"
                          )
                            ? "colleges-table-status-active"
                            : "colleges-table-status-inactive"
                        }`}
                      >
                        {college.programsAssigned?.some(
                          (program) =>
                            program.programStatus?.toLowerCase() === "ongoing"
                        )
                          ? `Assigned (${
                              college.programsAssigned.filter(
                                (program) =>
                                  program.programStatus?.toLowerCase() ===
                                  "ongoing"
                              ).length
                            } Ongoing)`
                          : "Not Assigned"}
                      </div>
                    </td>
                    <td>
                      <button
                        className="view-more-button"
                        onClick={() => handleViewMore(college)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-items-found-text">
                    No colleges available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <AddCollege
        isOpen={addCollegeModalIsOpen}
        onRequestClose={() => setAddCollegeModalIsOpen(false)}
        onAddTrainerSuccess={() => {
          setAddCollegeModalIsOpen(false);
        }}
      />
      {modalIsOpen && selectedCollege && (
        <ViewCollege
          onClose={() => {
            setModalIsOpen(false);
            setSelectedCollege(null);
          }}
          college={selectedCollege}
        />
      )}
    </div>
  );
}