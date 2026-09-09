import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import api from '@/lib/api';
import { normalizeReport, Report, ReportStatus, Urgency } from '@/lib/normalizeReport';
import { useAuth } from '@/context/auth-context';

export type { Report, ReportStatus, Urgency };

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
  assignedStaff?: string | null;
};

type ReportsContextType = {
  reports: Report[];
  isLoading: boolean;
  addReport: (data: NewReportInput) => Promise<Report>;
  getReport: (id: string) => Report | undefined;
  updateReport: (id: string, updates: ReportUpdate) => Promise<void>;
  refresh: () => Promise<void>;
};

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data } = await api.get('/reports');
      setReports(data.map(normalizeReport));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) refresh();
    else setReports([]);
  }, [user?.id]);

  const addReport = async (data: NewReportInput): Promise<Report> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    formData.append('building', data.building);
    formData.append('room', data.room);
    formData.append('description', data.description);
    formData.append('urgency', data.urgency);

    if (data.photoUri) {
      const filename = data.photoUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      formData.append('photo', { uri: data.photoUri, name: filename, type } as any);
    }

    const { data: apiReport } = await api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    const newReport = normalizeReport(apiReport);
    setReports((prev) => [newReport, ...prev]);
    return newReport;
  };

  const getReport = (id: string) => reports.find((r) => r.id === id);

  const updateReport = async (id: string, updates: ReportUpdate) => {
    const payload: Record<string, string | null> = {};
    if (updates.status) payload.status = updates.status;
    if (updates.assignedStaff !== undefined) payload.assigned_to = updates.assignedStaff;

    const { data } = await api.patch(`/reports/${id}`, payload);
    const updated = normalizeReport(data);
    setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  return (
    <ReportsContext.Provider value={{ reports, isLoading, addReport, getReport, updateReport, refresh }}>
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used within ReportsProvider');
  return ctx;
}