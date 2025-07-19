import { LayoutDashboard, Users, LogOut, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import {useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebarstore from '../../store/sidebarstore';
import useAuthStore from "../../store/authstore";
export default function Sidebar({navigate}) {
  const {isOpen,toggleSidebar}=Sidebarstore();
  const location = useLocation();
  const clearTrainer = useAuthStore((state) => state.clearTrainer);
  const isActive = (path) => location.pathname.startsWith(path);

  const handleNavigation = (path) => {
    navigate(path);
  };

 

  const handleLogout = () => {
    localStorage.removeItem('trainerToken');
    console.log("Logged Out");
    clearTrainer();
    navigate("/");
  };
  
  return (
    <div 
      className={`flex flex-col justify-between fixed top-0 left-0 h-screen bg-[#111827] transition-all duration-300 ease-in-out
        ${isOpen ? 'w-[270px]' : 'w-[60px]'} p-4 pt-6 pb-6`}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-4 text-white text-2xl font-bold">
          <div 
            className="flex cursor-pointer"
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <ArrowLeft className="w-5 h-5 text-white" />
            ) : (
              <ArrowRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
          {isOpen && <span>TrackWise</span>}
        </div>

        {isOpen && (
          <div className="flex flex-col gap-6 mt-[20%]">
            <div
              className={`flex items-center gap-4 p-3 cursor-pointer transition-all duration-300
                ${isActive('/dashboard') 
                  ? 'bg-[#1f2937] text-white rounded-md' 
                  : 'text-gray-400 hover:bg-[#1f2937] hover:text-white hover:rounded-md'}`}
              onClick={() => handleNavigation('/dashboard')}
            >
              <LayoutDashboard
                className={`w-6 h-6 ${isActive('/dashboard') ? 'text-white' : 'text-gray-400'}`}
              />
              <span className="font-medium">Dashboard</span>
            </div>

            <div
              className={`flex items-center gap-4 p-3 cursor-pointer transition-all duration-300
                ${isActive('/students') 
                  ? 'bg-[#1f2937] text-white rounded-md' 
                  : 'text-gray-400 hover:bg-[#1f2937] hover:text-white hover:rounded-md'}`}
              onClick={() => handleNavigation('/students')}
            >
              <Users
                className={`w-6 h-6 ${isActive('/students') ? 'text-white' : 'text-gray-400'}`}
              />
              <span className="font-medium">Students</span>
            </div>

            <div
              className={`flex items-center gap-4 p-3 cursor-pointer transition-all duration-300
                ${isActive('/programs') 
                  ? 'bg-[#1f2937] text-white rounded-md' 
                  : 'text-gray-400 hover:bg-[#1f2937] hover:text-white hover:rounded-md'}`}
              onClick={() => handleNavigation('/programs')}
            >
              <BookOpen
                className={`w-6 h-6 ${isActive('/programs') ? 'text-white' : 'text-gray-400'}`}
              />
              <span className="font-medium">Programs</span>
            </div>
          </div>
        )}
      </div>

      {isOpen && (
        <div className="pt-8 border-t border-[#2d3748]">
          <div
            className="flex items-center gap-4 p-3 cursor-pointer text-gray-400 hover:bg-[#1f2937] hover:text-white hover:rounded-md transition-all duration-300"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6" />
            <span className="font-medium">Log Out</span>
          </div>
        </div>
      )}
    </div>
  );
}