export type Staff = {
  id: string;
  name: string;
  role: string;
  activeJobs: number;
  status: 'Available' | 'Busy' | 'Off-duty';
};

export const STAFF: Staff[] = [
  { id: 's1', name: 'Dave Miller', role: 'General Maintenance', activeJobs: 3, status: 'Available' },
  { id: 's2', name: 'Sarah Jenkins', role: 'Electrician', activeJobs: 1, status: 'Busy' },
  { id: 's3', name: 'Marcus Brody', role: 'Plumber', activeJobs: 0, status: 'Available' },
  { id: 's4', name: 'John Davis', role: 'HVAC Specialist', activeJobs: 4, status: 'Off-duty' },
];

export const STAFF_OPTIONS = STAFF.map((s) => `${s.name} (${s.role})`);
