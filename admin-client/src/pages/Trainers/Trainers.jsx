import { useState, useEffect, useCallback } from 'react';
import TrainerPreviewPanel from '../../components/TrainerPreviewPanel/TrainerPreviewPanel';
import AddTrainerPanel from '../../components/AddTrainerPanel/AddTrainerPanel';
import './trainers.css';
import { Search } from 'lucide-react';
import { getAllTrainers } from '../../services/AdminOperations';
import Loader from '../../components/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setTrainers } from '../../redux/actions/adminActions';

export default function Trainers() {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [filteredTrainers, setFilteredTrainers] = useState([]);
    const [addTrainerModalIsOpen, setAddTrainerModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem("Token");
    const dispatch = useDispatch();

    const trainers = useSelector((state) => state.admin.trainers || []);


    useEffect(() => {
        console.log(trainers)
    }, [trainers])

    const fetchAllTrainers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            await getAllTrainers(token, dispatch);

        } catch (err) {
            console.error("Error fetching trainers:", err);

            setError('An error occurred while fetching trainers');
        } finally {
            setLoading(false);
        }
    }, [token, dispatch]);

    useEffect(() => {
        fetchAllTrainers();
    }, [fetchAllTrainers]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = trainers?.filter((trainer) => {
                const specialization = trainer?.specialization;
                return (
                    trainer.trainerId.toString().includes(searchQuery) ||
                    trainer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    trainer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (typeof specialization === "string" &&
                        specialization.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            });
            setFilteredTrainers(filtered);
        } else {
            setFilteredTrainers(trainers);
        }
    }, [searchQuery, trainers]);

    const handleViewMore = useCallback((trainer) => {
        setSelectedTrainer(trainer);
        setModalIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalIsOpen(false);
        setSelectedTrainer(null);
    }, []);

    return (
        <div className="trainers-container">
            <div className="trainers-header">
                <div className="trainers-header-text">
                    <div className='vertical-bar-title'></div>
                    <div className="trainers-title">Manage Trainers</div>
                </div>
                <div className='trainers-header-left'>
                    <div className="trainers-searchbar-container">
                        <Search size="1.7rem" color="#9CA3AF" />
                        <input
                            className="trainers-search-bar"
                            type="text"
                            placeholder="Search trainers, programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div
                        className="trainers-add-button"
                        onClick={() => setAddTrainerModalIsOpen(true)}
                        aria-label="Add a new trainer"
                    >
                        Add Trainer
                    </div>
                </div>
            </div>
            <div className="trainers-content">
                {error && <div className="error-message">{error}</div>}
                {(filteredTrainers && filteredTrainers.length === 0) || (filteredTrainers && filteredTrainers.every(trainer => !trainer)) ? (
                    <div className='no-items-found-text'>No trainers available</div>
                ) : (
                    <table className="trainers-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Specialization</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTrainers.map((trainer) => (
                                <tr key={trainer.trainerId}>
                                    <td>{trainer.trainerId}</td>
                                    <td>{trainer.name}</td>
                                    <td>{trainer.email}</td>
                                    <td>{trainer.specialization}</td>
                                    <td style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",

                                    }}>
                                        <div
                                            className={`trainers-table-status-container ${trainer.programsAssigned?.some(
                                                (program) =>
                                                    program.programStatus?.toLowerCase() === "ongoing"
                                            )
                                                ? "trainers-table-status-active"
                                                : "trainers-table-status-inactive"
                                                }`}
                                        >
                                            {trainer.programsAssigned?.some(
                                                (program) =>
                                                    program.programStatus?.toLowerCase() === "ongoing"
                                            )
                                                ? `Assigned (${trainer.programsAssigned.filter(
                                                    (program) =>
                                                        program.programStatus?.toLowerCase() === "ongoing"
                                                ).length} Ongoing)`
                                                : "Not Assigned"}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="view-more-button"
                                            onClick={() => handleViewMore(trainer)}
                                        >
                                            View More
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            {selectedTrainer && (
                <TrainerPreviewPanel
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    trainer={selectedTrainer}
                    onEditTrainerSuccess={fetchAllTrainers}
                    onTrainerDeleted={fetchAllTrainers}
                />
            )}
            <AddTrainerPanel
                isOpen={addTrainerModalIsOpen}
                onRequestClose={() => setAddTrainerModalIsOpen(false)}
                onAddTrainerSuccess={fetchAllTrainers}
            />
        </div>
    );
}
