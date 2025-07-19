import { create } from "zustand";

const Sidebarstore = create((set) => ({
  isOpen: true,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  
}));

export default Sidebarstore;
