import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import api from '@/lib/api';
import { Announcement, normalizeAnnouncement } from '@/lib/normalizeAnnouncement';
import { useAuth } from '@/context/auth-context';

export type { Announcement };

type AnnouncementsContextType = {
  announcements: Announcement[];
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const AnnouncementsContext = createContext<AnnouncementsContextType | undefined>(undefined);

export function AnnouncementsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data } = await api.get('/announcements');
      setAnnouncements(data.map(normalizeAnnouncement));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) refresh();
    else setAnnouncements([]);
  }, [user?.id]);

  return (
    <AnnouncementsContext.Provider value={{ announcements, isLoading, refresh }}>
      {children}
    </AnnouncementsContext.Provider>
  );
}

export function useAnnouncements() {
  const ctx = useContext(AnnouncementsContext);
  if (!ctx) throw new Error('useAnnouncements must be used within AnnouncementsProvider');
  return ctx;
}