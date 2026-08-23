import { createContext, ReactNode, useContext, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertState = {
  title: string;
  message?: string;
  buttons: AlertButton[];
} | null;

type AppAlertContextType = {
  showAlert: (title: string, message?: string, buttons?: AlertButton[]) => void;
};

const AppAlertContext = createContext<AppAlertContextType | undefined>(undefined);

export function AppAlertProvider({ children }: { children: ReactNode }) {
  const [alert, setAlert] = useState<AlertState>(null);

  const showAlert = (title: string, message?: string, buttons?: AlertButton[]) => {
    setAlert({
      title,
      message,
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
    });
  };

  const handlePress = (btn: AlertButton) => {
    setAlert(null);
    btn.onPress?.();
  };

  return (
    <AppAlertContext.Provider value={{ showAlert }}>
      <View style={{ flex: 1, width: '100%', height: '100%', position: 'relative' }}>
        {children}
        {alert && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(42,16,21,0.55)',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              zIndex: 1000,
              elevation: 1000,
            }}
          >
            <View
              style={{
                backgroundColor: '#FAF7F2',
                borderRadius: 16,
                padding: 20,
                width: '100%',
                maxWidth: 340,
              }}
            >
              <Text style={{ color: '#2A1015', fontSize: 16, fontWeight: '700', marginBottom: alert.message ? 8 : 16 }}>
                {alert.title}
              </Text>
              {!!alert.message && (
                <Text style={{ color: 'rgba(42,16,21,0.7)', fontSize: 13, lineHeight: 18, marginBottom: 18 }}>
                  {alert.message}
                </Text>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8, flexWrap: 'wrap' }}>
                {alert.buttons.map((btn, i) => (
                  <Pressable
                    key={i}
                    onPress={() => handlePress(btn)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 9,
                      borderRadius: 8,
                      backgroundColor:
                        btn.style === 'destructive' ? '#FEE2E2' : btn.style === 'cancel' ? 'transparent' : '#A1000B',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '600',
                        color: btn.style === 'destructive' ? '#DC2626' : btn.style === 'cancel' ? '#2A1015' : '#FFFFFF',
                      }}
                    >
                      {btn.text}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    </AppAlertContext.Provider>
  );
}

export function useAppAlert() {
  const ctx = useContext(AppAlertContext);
  if (!ctx) throw new Error('useAppAlert must be used within AppAlertProvider');
  return ctx;
}
