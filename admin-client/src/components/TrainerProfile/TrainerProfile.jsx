/* eslint-disable react/prop-types */
import { X } from 'lucide-react'
import React, { useEffect } from 'react'

export default function TrainerProfile({ trainer, setIsTrainerProfile }) {

    return (
        <div className="trainer-profile">
            <h2 className="trainer-profile-top">
                Trainer&apos;s Details
                <X style={{
                    cursor: "pointer"
                }} size={"1.7rem"} onClick={() => setIsTrainerProfile((prev) => !prev)} />
            </h2>
            <div className="trainer-profile-bottom">
                <div className="trainer-detail">
                    <strong>Name:</strong> {trainer?.name}
                </div>
                <div className="trainer-detail">
                    <strong>Email:</strong> {trainer?.email}
                </div>
                <div className="trainer-detail">
                    <strong>Age:</strong> {trainer?.age}
                </div>
                <div className="trainer-detail">
                    <strong>Gender:</strong> {trainer?.gender}
                </div>
                <div className="trainer-detail">
                    <strong>Address:</strong> {trainer?.address}
                </div>
                <div className="trainer-detail">
                    <strong>Phone:</strong> {trainer?.phone}
                </div>
                <div className="trainer-detail">
                    <strong>Specialization:</strong> {trainer?.specialization?.join(", ")}
                </div>
                <div className="trainer-detail">
                    <strong>Skills:</strong> {trainer?.skills?.join(", ")}
                </div>
                <div className="trainer-detail">
                    <strong>Programs Assigned:</strong> {trainer?.programsAssigned?.length || 0}
                </div>
            </div>
            <div style={{
                alignSelf: "flex-end",
                backgroundColor: "#8B5DFF",
                color: "#fff",
                padding: "0.5rem 0.7rem",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer"
            }} onClick={() => [
                setIsResetPassword(true)
            ]}>
                Reset Password
            </div>
        </div>
    )
}
