/* eslint-disable react/prop-types */
import { useState } from 'react';
import { X, UserPen, CheckCircle, User, Mail, Award, Phone, Calendar, MapPin, Plus, Trash } from 'lucide-react';
import { handleAddTrainer } from '../../services/AdminOperations';
import { showToast } from '../../hooks/useToast';

export default function AddTrainerPanel({ isOpen, onRequestClose, onAddTrainerSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '',
        specialization: '',
        address: '',
        skills: []
    });
    const token = localStorage.getItem("Token")

    const [errors, setErrors] = useState({});
    const [skillInput, setSkillInput] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required.';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number.';
        }

        if (!formData.age.trim()) newErrors.age = 'Age is required.';
        if (!formData.gender.trim()) newErrors.gender = 'Gender is required.';
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required.';
        if (!formData.address.trim()) newErrors.address = 'Address is required.';


        if (formData.skills.length === 0) {
            newErrors.skills = 'At least one skill is required.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleSkillInputChange = (e) => setSkillInput(e.target.value);

    const addSkill = () => {
        if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                skills: Array.isArray(prev.skills) ? [...prev.skills, skillInput.trim()] : [skillInput.trim()],
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (index) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        console.log('Saving Trainer Data:', formData);

        try {
            const response = await handleAddTrainer(token,formData);

            if (response.success) {
                onAddTrainerSuccess()
                console.log('Trainer added:', response);
                showToast("New Trainer added successfully.", "success");


                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    age: '',
                    gender: '',
                    specialization: '',
                    address: '',
                    skills: []
                });
            }
            else {
                console.log('Error adding trainer:', response);
                showToast("Error adding trainer.", "error");
            }

            onRequestClose();
        } catch (error) {
            console.error('Error while saving trainer:', error);
        }
    };

    const handleClose = () => {
        console.log('Panel closed');
        onRequestClose();
    };

    return (
        <div className={`add-trainer-panel ${isOpen ? 'add-trainer-panel--open' : 'add-trainer-panel--close'}`}>
            <div className="add-trainer-panel__header">
                <h2 className="add-trainer-panel__title">Add Trainer</h2>
                <button className="add-trainer-panel__close-icon" onClick={handleClose}>
                    <X color="#333" size={24} />
                </button>
            </div>
            <form className="add-trainer-panel__form">
                <div className="add-trainer-panel__form-group">
                    <label>
                        <User style={{ marginRight: '8px' }} />
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter trainer's name"
                        required
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
                <div className="add-trainer-panel__form-group">
                    <label>
                        <Mail style={{ marginRight: '8px' }} />
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter trainer's email"
                        required
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="add-trainer-panel__form-group">
                    <label>
                        <Phone style={{ marginRight: '8px' }} />
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        required
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                <div className="add-trainer-panel__form-group">
                    <label>
                        <Calendar style={{ marginRight: '8px' }} />
                        Age
                    </label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Enter age"
                        required
                    />
                    {errors.age && <span className="error-text">{errors.age}</span>}
                </div>
                <div className="add-trainer-panel__form-group">
                    <label>
                        <UserPen style={{ marginRight: '8px' }} />
                        Gender
                    </label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="" disabled>Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <span className="error-text">{errors.gender}</span>}
                </div>
                <div className="add-trainer-panel__form-group">
                    <label>
                        <MapPin style={{ marginRight: '8px' }} />
                        Address
                    </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter address"
                        rows="3"
                        required
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                </div>
                <div className="add-trainer-panel__form-group">
                    <label>
                        <Award style={{ marginRight: '8px' }} />
                        Specialization
                    </label>
                    <select
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select specialization</option>
                        {[
                            'Web Development',
                            'Blockchain',
                            'Artificial Intelligence',
                            'Data Science',
                            'Cybersecurity',
                            'Cloud Computing',
                            'Internet of Things (IoT)',
                            'Machine Learning',
                            'DevOps'
                        ].map((specialization, index) => (
                            <option key={index} value={specialization}>
                                {specialization}
                            </option>
                        ))}
                    </select>
                    {errors.specialization && <span className="error-text">{errors.specialization}</span>}
                </div>

                <div className="add-trainer-panel__form-group">
                    <label>
                        <Award style={{ marginRight: '8px' }} />
                        Skills
                    </label>
                    <div className="add-trainer-panel__skills-input">
                        <input
                            type="text"
                            value={skillInput}
                            onChange={handleSkillInputChange}
                            placeholder="Enter a skill"
                        />
                        <button type="button" onClick={addSkill}>
                            <Plus size={"1.2rem"} />
                        </button>
                    </div>
                    {errors.skills && <span className="error-text">{errors.skills}</span>}
                    <div className="add-trainer-panel__skills-list">
                        {Array.isArray(formData.skills) &&
                            formData.skills.map((skill, index) => (
                                <div key={index} className="skill-item">
                                    <span>{skill}</span>
                                    <button
                                        style={{ marginLeft: "1.5rem",background:"transparent" }}
                                        className="skills-trash-button"
                                        type="button"
                                        onClick={() => removeSkill(index)}
                                    >
                                        <Trash color='#e74c3c' size={"1rem"} />
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="add-trainer-panel__actions">
                    <button
                        type="button"
                        className="add-trainer-panel__save-button"
                        onClick={handleSave}
                    >
                        <CheckCircle size={"1rem"} style={{ marginRight: '5px' }} />
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
