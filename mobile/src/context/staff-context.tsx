import { createContext, ReactNode, useContext, useState } from 'react';

export type StaffStatus = 'Available' | 'Busy' | 'Off-duty';

export type Staff = {
  id: string;
  name: string;
  role: string;
  activeJobs: number;
  status: StaffStatus;
};

const initialStaff: Staff[] = [
  { id: 's1', name: 'Dave Miller', role: 'General Maintenance', activeJobs: 3, status: 'Available' },
  { id: 's2', name: 'Sarah Jenkins', role: 'Electrician', activeJobs: 1, status: 'Busy' },
  { id: 's3', name: 'Marcus Brody', role: 'Plumber', activeJobs: 0, status: 'Available' },
  { id: 's4', name: 'John Davis', role: 'HVAC Specialist', activeJobs: 4, status: 'Off-duty' },
];

type StaffContextType = {
  staff: Staff[];
  staffOptions: string[];
  addStaff: (name: string, role: string) => Staff;
};

const StaffContext = createContext<StaffContextType | undefined>(undefined);

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>(initialStaff);

  const addStaff = (name: string, role: string) => {
    const newStaff: Staff = {
      id: Date.now().toString(),
      name,
      role,
      activeJobs: 0,
      status: 'Available',
    };
    setStaff((prev) => [...prev, newStaff]);
    return newStaff;
  };

  const staffOptions = staff.map((s) => `${s.name} (${s.role})`);

  return (
    <StaffContext.Provider value={{ staff, staffOptions, addStaff }}>
      {children}
    </StaffContext.Provider>
  );
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error('useStaff must be used within StaffProvider');
  return ctx;
}
