import { useState, useEffect } from "react";
import { Pencil, Save, Lock } from "lucide-react";
import useAuthStore from "../../store/authstore";
import axios from 'axios';
import { toast } from "react-toastify";
import apiurl from "../../connectivity";
const TrainerProfile = () => {
    const { trainerId } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInputs, setPasswordInputs] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [trainer, setTrainer] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    address: "",
    phone: "",
    specialization: [],
    skills: [],
  });
  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const response = await axios.get(`${apiurl}/trainer/get-trainer`, {
          params: { trainerId },
        });
        const data = response.data.trainer;

        setTrainer({
          name: data.name || "",
          email: data.email || "",
          password: data.password || "", // Note: you probably shouldn't send passwords
          age: data.age || "",
          gender: data.gender || "",
          address: data.address || "",
          phone: data.phone || "",
          specialization: data.specialization || [],
          skills: data.skills || [],
        });
      } catch (err) {
        console.error("Failed to fetch trainer data", err);
      }
    };

    fetchTrainerData();
  }, [trainerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainer({ ...trainer, [name]: value });
  };

  const handlePasswordUpdate = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordInputs;
  
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
  
    if (newPassword.trim().length < 6) {
      toast.warning("Password should be at least 6 characters.");
      return;
    }
  
    try {
      await axios.post(`${apiurl}/trainer/changepassword`, {
        trainerId,
        currentPassword: oldPassword,
        newPassword,
      });
  
      setPasswordInputs({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordModal(false);
      toast.success("Password changed successfully!");
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to update password.";
      toast.error(message);
    }
  };
  
  const handleSaveProfile = async () => {
    console.log(trainerId)
    try {
      const updatedTrainer = {
    
        name: trainer.name,
        email: trainer.email,
        age: trainer.age,
        gender: trainer.gender,
        address: trainer.address,
        phone: trainer.phone,
        specialization: trainer.specialization,
        skills: trainer.skills,
      };
  
      await axios.put(`${apiurl}/trainer/edit-trainer/${trainerId}`, updatedTrainer);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to update profile.";
      toast.error(message);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-200 px-10 py-12 transition-all duration-300">
        <div className="flex justify-between items-center border-b pb-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 shadow-inner">
              {trainer.name[0]}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800">{trainer.name}</h2>
              <p className="text-lg text-gray-500">{trainer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition"
            >
              <Lock size={18} />
              Change Password
            </button>
            <button
onClick={() => {
    if (isEditing) {
      handleSaveProfile();
    } else {
      setIsEditing(true);
    }
  }}
                className={`flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition text-white ${
                isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isEditing ? <Save size={18} /> : <Pencil size={18} />}
              {isEditing ? "Save" : "Edit"}
            </button>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputField label="Full Name" name="name" value={trainer.name} onChange={handleChange} editable={isEditing} />
          <InputField label="Email Address" name="email" value={trainer.email} onChange={handleChange} editable={isEditing} />
          <InputField label="Age" name="age" type="number" value={trainer.age} onChange={handleChange} editable={isEditing} />
          <SelectField label="Gender" name="gender" value={trainer.gender} onChange={handleChange} editable={isEditing} options={["Male", "Female", "Other"]} />
          <InputField label="Phone Number" name="phone" value={trainer.phone} onChange={handleChange} editable={isEditing} />
          <InputField label="Address" name="address" value={trainer.address} onChange={handleChange} editable={isEditing} />
          <InputField
            label="Specialization (comma separated)"
            name="specialization"
            value={trainer.specialization.join(", ")}
            onChange={(e) => setTrainer({ ...trainer, specialization: e.target.value.split(",").map(s => s.trim()) })}
            editable={isEditing}
          />
          <InputField
            label="Skills (comma separated)"
            name="skills"
            value={trainer.skills.join(", ")}
            onChange={(e) => setTrainer({ ...trainer, skills: e.target.value.split(",").map(s => s.trim()) })}
            editable={isEditing}
          />
        </form>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Change Password</h3>
            <div className="space-y-4">
              <input
                type="password"
                placeholder="Old Password"
                value={passwordInputs.oldPassword}
                onChange={(e) => setPasswordInputs({ ...passwordInputs, oldPassword: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordInputs.newPassword}
                onChange={(e) => setPasswordInputs({ ...passwordInputs, newPassword: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={passwordInputs.confirmPassword}
                onChange={(e) => setPasswordInputs({ ...passwordInputs, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
              />
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button onClick={() => setShowPasswordModal(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 border rounded-xl hover:bg-gray-100">
                Cancel
              </button>
              <button onClick={handlePasswordUpdate} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, name, value, onChange, editable, type = "text" }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={!editable}
      className={`px-4 py-3 text-base rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"
      }`}
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, editable, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={!editable}
      className={`px-4 py-3 text-base rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        editable ? "bg-white" : "bg-gray-100 cursor-not-allowed"
      }`}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default TrainerProfile;
