import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import api from '@/lib/api';

type Draft = {
  title?: string;
  category?: string;
  building?: string;
  room?: string;
  description?: string;
  urgency?: string;
};

type Msg = { role: 'user' | 'model'; text: string; draft?: Draft | null };

const GREETING: Msg = {
  role: 'model',
  text: "Hi! I'm the UM FixHub campus assistant. Ask me anything, or I can help you check your reports or draft a new one.",
};

export function ChatWidget() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;

    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setInput('');
    setSending(true);

    try {
      const { data } = await api.post('/chat', { message: text, history });
      setMessages((prev) => [...prev, { role: 'model', text: data.reply, draft: data.draft || null }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: err.response
            ? 'Sorry, something went wrong. Try again.'
            : 'Cannot reach the server. Check your connection.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const useDraft = (draft: Draft) => {
    setOpen(false);
    router.push({
      pathname: '/report/form',
      params: {
        category: draft.category ?? 'Other',
        title: draft.title ?? '',
        building: draft.building ?? '',
        room: draft.room ?? '',
        description: draft.description ?? '',
        urgency: draft.urgency ?? 'Medium',
      },
    });
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityLabel="Open campus assistant"
        style={{ position: 'absolute', right: 20, bottom: 84 }}
        className="w-14 h-14 rounded-full bg-maroon items-center justify-center shadow-lg"
      >
        <Text className="text-white text-2xl">💬</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <SafeAreaView className="flex-1 bg-cream">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className="flex-1"
          >
            <View className="flex-row items-center justify-between px-5 py-3 bg-maroon">
              <View>
                <Text className="text-white text-base font-bold">Campus Assistant</Text>
                <Text className="text-white/70 text-[11px]">Ask questions or draft a report</Text>
              </View>
              <Pressable onPress={() => setOpen(false)} className="w-9 h-9 rounded-full bg-white/15 items-center justify-center">
                <Text className="text-white text-base">✕</Text>
              </Pressable>
            </View>

            <ScrollView
              ref={scrollRef}
              className="flex-1"
              contentContainerClassName="px-4 py-4 gap-3"
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              {messages.map((m, i) => (
                <View key={i} className={m.role === 'user' ? 'items-end' : 'items-start'}>
                  <View
                    style={{ maxWidth: '85%' }}
                    className={`rounded-2xl px-3.5 py-2.5 ${m.role === 'user' ? 'bg-maroon' : 'bg-white border border-ink/10'}`}
                  >
                    <Text className={`text-sm leading-5 ${m.role === 'user' ? 'text-white' : 'text-ink'}`}>{m.text}</Text>
                    {m.draft && (
                      <Pressable onPress={() => useDraft(m.draft!)} className="mt-2 bg-mustard/25 rounded-lg py-2 items-center">
                        <Text className="text-maroon text-xs font-bold">Use this draft →</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              ))}
              {sending && <Text className="text-ink/40 text-xs">Thinking...</Text>}
            </ScrollView>

            <View className="flex-row items-center gap-2 px-4 py-3 border-t border-ink/10 bg-white">
              <TextInput
                value={input}
                onChangeText={setInput}
                onSubmitEditing={send}
                placeholder="Type a message..."
                placeholderTextColor="#8A7B7E"
                returnKeyType="send"
                className="flex-1 bg-cream border border-ink/10 rounded-xl px-4 py-3 text-ink text-sm"
              />
              <Pressable
                onPress={send}
                disabled={sending}
                className={`rounded-xl px-4 py-3 ${sending ? 'bg-maroon/50' : 'bg-maroon'}`}
              >
                <Text className="text-white text-sm font-semibold">Send</Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}