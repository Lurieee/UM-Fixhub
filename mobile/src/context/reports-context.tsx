import { createContext, ReactNode, useContext, useState } from 'react';

export type ReportStatus = 'Submitted' | 'In Progress' | 'Resolved';
export type Urgency = 'Low' | 'Medium' | 'High';

export type Message = {
  id: string;
  from: string;
  text: string;
  time: string;
};

export type Report = {
  id: string;
  refCode: string;
  title: string;
  category: string;
  building: string;
  room: string;
  description: string;
  urgency: Urgency;
  status: ReportStatus;
  reportedAt: string;
  reportedBy: string;
  assignedStaff: string | null;
  photoUri: string | null;
  messages: Message[];
};

const initialReports: Report[] = [
  {
    id: '1',
    refCode: '#CMP-2026-904',
    title: 'Broken Desk Chair',
    category: 'Furniture',
    building: 'Library',
    room: '302',
    description:
      'The wooden back support is entirely detached from the metal frame. It presents a tipping risk.',
    urgency: 'Medium',
    status: 'In Progress',
    reportedAt: 'Today, 9:40 AM',
    reportedBy: 'Lorena Smith (Student)',
    assignedStaff: 'Dave Miller (General Maintenance)',
    photoUri: null,
    messages: [
      {
        id: 'm1',
        from: 'Marcus (Maintenance Staff)',
        text:
          "Yoohoo, I've located the chair. I'm picking up a replacement leg unit from our warehouse now. Should be sorted shortly!",
        time: '10:20 AM',
      },
    ],
  },
  {
    id: '2',
    refCode: '#CMP-2026-874',
    title: 'Leaky Water Fountain',
    category: 'Plumbing',
    building: 'Student Union',
    room: 'Lobby',
    description: 'Water fountain drips continuously even when not in use.',
    urgency: 'Low',
    status: 'Resolved',
    reportedAt: 'Aug 14, 8:15 AM',
    reportedBy: 'Lorena Smith (Student)',
    assignedStaff: 'Marcus Brody (Plumber)',
    photoUri: null,
    messages: [],
  },
  {
    id: '3',
    refCode: '#CMP-2026-861',
    title: 'Classroom AC Not Working',
    category: 'Infrastructure',
    building: 'Science Annex',
    room: '101',
    description: 'The AC unit blows warm air only. Room becomes uncomfortably hot by midday.',
    urgency: 'Medium',
    status: 'Submitted',
    reportedAt: 'Oct 23, 1:05 PM',
    reportedBy: 'Miguel Santos (Student)',
    assignedStaff: null,
    photoUri: null,
    messages: [],
  },
  {
    id: '4',
    refCode: '#CMP-2026-859',
    title: 'Exposed Wire in Lab',
    category: 'Electrical',
    building: 'Engineering Hall',
    room: '204',
    description: 'A live wire is exposed near the workstation. Immediate safety hazard.',
    urgency: 'High',
    status: 'Submitted',
    reportedAt: 'Oct 22, 4:40 PM',
    reportedBy: 'Anna Cruz (Student)',
    assignedStaff: null,
    photoUri: null,
    messages: [],
  },
];

type NewReportInput = {
  title: string;
  category: string;
  building: string;
  room: string;
  description: string;
  urgency: Urgency;
  photoUri?: string | null;
};

type ReportUpdate = {
  status?: ReportStatus;
  urgency?: Urgency;
  assignedStaff?: string | null;
};

type ReportsContextType = {
  reports: Report[];
  addReport: (data: NewReportInput) => Report;
  getReport: (id: string) => Report | undefined;
  addMessage: (reportId: string, text: string) => void;
  updateReport: (id: string, updates: ReportUpdate) => void;
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(initialReports);

  const addReport = (data: NewReportInput) => {
    const id = Date.now().toString();
    const refCode = `#CMP-2026-${Math.floor(900 + Math.random() * 99)}`;
    const newReport: Report = {
      ...data,
      id,
      refCode,
      status: 'Submitted',
      reportedAt:
        'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: 'Lorena Smith (Student)',
      assignedStaff: null,
      photoUri: data.photoUri ?? null,
      messages: [],
    };
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const getReport = (id: string) => reports.find((r) => r.id === id);

  const addMessage = (reportId: string, text: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              messages: [
                ...r.messages,
                {
                  id: Date.now().toString(),
                  from: 'You',
                  text,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            }
          : r
      )
    );
  };

  const updateReport = (id: string, updates: ReportUpdate) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  return (
    <ReportsContext.Provider value={{ reports, addReport, getReport, addMessage, updateReport }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}
