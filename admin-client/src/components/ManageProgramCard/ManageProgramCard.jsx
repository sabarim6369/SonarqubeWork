/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react';
import "./ManageProgramCard.css";
import { X } from 'lucide-react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { getAllColleges, handleDelete, handleProgramEdit } from '../../services/AdminOperations';
import { showToast } from '../../hooks/useToast';
import CustomCalendar from '../Calendar/CustomCalendar';
import StudentsList from '../StudentsList/StudentsList';

export default function ManageProgramCard({ program, onClose }) {
    const [editedProgram, setEditedProgram] = useState(program);
    const [originalProgram, setOriginalProgram] = useState(program);
    const [isEditable, setIsEditable] = useState(false);
    const trainers = useSelector((state) => state.admin.trainers);
    const [isStudentListView, setIsStudentListView] = useState(false);

    const token = localStorage.getItem("Token")
    const dispatch = useDispatch();

    const colleges = useSelector((state) => state.admin.colleges, shallowEqual);

  const fetchAllColleges = async () => {
    await getAllColleges(token, dispatch);
  };

  useEffect(() => {
    fetchAllColleges();
  },[])

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "trainerAssigned") {
            setEditedProgram((prevState) => ({
                ...prevState,
                trainerAssigned: trainers.find((trainer) => trainer._id === value),
            }));
        } else {
            setEditedProgram((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };


    useEffect(() => {
        if (program) {
            setEditedProgram(program);
        }
    }, [program]);

    const handleCancel = () => {
        setEditedProgram(originalProgram);
        setIsEditable(false);
    };

    const handleEditClick = () => {
        setOriginalProgram(editedProgram);
        setIsEditable(true);
    };

    const handleDeleteProgram = async () => {
        const response = await handleDelete(token, program._id, dispatch)
        if (response?.success) {
            showToast("Program deleted successfully", "success");
            onClose()
        } else {
            showToast("Error deleting program", "error");
        }
    }

    const handleSave = async () => {

        const startDate = new Date(editedProgram.startDate);
        const endDate = new Date(editedProgram.endDate);

        if (endDate < startDate) {
            alert("End date must be greater than or equal to the start date.");
            return;
        }

        const changes = {};

        Object.keys(editedProgram).forEach((key) => {
            if (editedProgram[key] !== originalProgram[key]) {
                changes[key] = editedProgram[key];
            }
        });

        if (editedProgram.trainerAssigned?._id !== originalProgram.trainerAssigned?._id) {
            changes.trainerAssigned = editedProgram.trainerAssigned._id;
        }


        if (Object.keys(changes).length === 0) {
            alert("No changes to save.");
            return;
        }

        try {
            const response = await handleProgramEdit(token, program._id, changes, dispatch);

            if (response?.success) {
                setIsEditable(false);
                showToast("Program updated successfully", "success");
            } else {
                showToast("Error updating program", "error");
            }
        } catch (error) {
            console.error("Error saving program changes:", error);
            alert("An error occurred while updating the program.");
        }
    };


    return (
        <>
            {
                isStudentListView ? <StudentsList program={program} onClose={() => {
                    setIsStudentListView(false);
                }} /> : (<div className="manage-program-card">
                    <div className="manage-program-card-header">
                        <h2 className="manage-program-card-title">Manage Program</h2>
                        <X
                            size={"1.7rem"}
                            style={{ cursor: "pointer" }}
                            onClick={onClose}
                        />
                    </div>

                    <div className="manage-program-card-details">
                        <div className="grid">
                            <div className="grid-item">
                                <label>Program Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editedProgram.name}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="grid-item">
                                <label>Description:</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={editedProgram.description}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="grid-item">
                                <label>College:</label>
                                {isEditable ? (
                                    <select
                                        name="college"
                                        value={editedProgram.college._id}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Select a College
                                        </option>
                                        {colleges?.map((college) => (
                                            <option key={college._id} value={college._id}>
                                                {college.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name="trainerAssigned"
                                        value={editedProgram.college.name}
                                        disabled
                                    />
                                )}
                            </div>
                            
                            <div className="grid-item">
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={editedProgram.startDate.slice(0, 10)}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="grid-item">
                                <label>End Date:</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={editedProgram.endDate.slice(0, 10)}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="grid-item">
                                <label>Batch:</label>
                                <input
                                    type="text"
                                    name="batch"
                                    value={editedProgram.batch}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="grid-item">
                                <label>Location:</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={editedProgram.location}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="grid-item">
                                <label>Status:</label>
                                <input
                                    type="text"
                                    name="programStatus"
                                    value={editedProgram.programStatus}
                                    onChange={handleChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className="grid-item">
                                <label>Trainer:</label>
                                {isEditable ? (
                                    <select
                                        name="trainerAssigned"
                                        value={editedProgram.trainerAssigned._id}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>
                                            Select Trainer
                                        </option>
                                        {trainers?.map((trainer) => (
                                            <option key={trainer._id} value={trainer._id}>
                                                {trainer.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        name="trainerAssigned"
                                        value={editedProgram.trainerAssigned.name}
                                        disabled
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="manage-program-card-footer">
                        {isEditable ? (
                            <>
                                <button
                                    className="manage-program-card-button"
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </button>
                                <button
                                    className="manage-program-card-button cancel"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className="manage-program-card-button"
                                    onClick={handleEditClick}
                                >
                                    Edit Program
                                </button>
                                <button onClick={handleDeleteProgram} style={{
                                    backgroundColor: "#EF4343",

                                }} className='manage-program-card-button'>
                                    Delete
                                </button>
                            </>
                        )}
                        <button onClick={() => {
                            setIsStudentListView(true)
                        }} className='manage-program-card-student-list-btn'>
                            View Students List
                        </button>
                    </div>

                </div>)
            }
        </>
    );
}
