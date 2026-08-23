import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppAlert } from '@/components/app-alert';

export default function LoginScreen() {
  const router = useRouter();
  const { showAlert } = useAppAlert();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = () => {
    if (!email.trim() || !password) {
      showAlert('Missing info', 'Please enter your campus email and password.');
      return;
    }
    if (!email.includes('@')) {
      showAlert('Invalid email', 'Please enter a valid campus email address.');
      return;
    }
    showAlert('Welcome back!', "You're logged in.", [
      { text: 'Continue', onPress: () => router.replace('/home') },
    ]);
  };

  const handleSendReset = () => {
    if (!resetEmail.trim() || !resetEmail.includes('@')) {
      showAlert('Invalid email', 'Please enter a valid campus email address.');
      return;
    }
    showAlert('Reset link sent', `If an account exists for ${resetEmail}, a password reset link has been sent.`);
    setShowForgot(false);
    setResetEmail('');
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <View style={{ width: '100%', maxWidth: 430 }} className="px-6 pt-2">
        {/* Back + header */}
        <View className="flex-row items-center mb-6">
          <Pressable onPress={() => router.back()} className="w-8 h-8 items-center justify-center">
            <Text className="text-ink text-xl">‹</Text>
          </Pressable>
          <View className="flex-row items-center gap-2 ml-1">
            <View className="w-7 h-7 rounded-md bg-maroon items-center justify-center">
              <Text className="text-mustard text-xs">🔧</Text>
            </View>
            <Text className="text-ink text-base font-bold">UM Fixhub</Text>
          </View>
        </View>

        {/* Heading */}
        <Text className="text-ink text-2xl font-bold mb-1">Welcome back!</Text>
        <Text className="text-ink/60 text-sm mb-6 leading-5">
          Enter your credentials to manage and track your maintenance reports.
        </Text>

        {/* Email */}
        <Text className="text-ink text-sm font-medium mb-1.5">Campus Email Address</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="e.g l.odiong.696969@umindanao.edu.ph"
          placeholderTextColor="#8A7B7E"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-white border border-ink/10 rounded-xl px-4 py-3.5 text-ink mb-4"
        />

        {/* Password */}
        <Text className="text-ink text-sm font-medium mb-1.5">Password</Text>
        <View className="flex-row items-center bg-white border border-ink/10 rounded-xl px-4 mb-2">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••••"
            placeholderTextColor="#8A7B7E"
            secureTextEntry={!showPassword}
            className="flex-1 py-3.5 text-ink"
          />
          <Pressable onPress={() => setShowPassword((v) => !v)}>
            <Text className="text-ink/50 text-xs font-medium">{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => setShowForgot((v) => !v)} className="self-end mb-2">
          <Text className="text-maroon text-xs font-semibold">Forgot Password?</Text>
        </Pressable>

        {showForgot && (
          <View className="bg-mustard/10 border border-mustard/30 rounded-xl p-4 mb-6">
            <Text className="text-ink text-xs font-medium mb-1.5">
              Enter your campus email and we&apos;ll send a reset link.
            </Text>
            <TextInput
              value={resetEmail}
              onChangeText={setResetEmail}
              placeholder="your.email@umindanao.edu.ph"
              placeholderTextColor="#8A7B7E"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white border border-ink/10 rounded-lg px-3 py-2.5 text-ink text-sm mb-3"
            />
            <Pressable onPress={handleSendReset} className="bg-maroon rounded-lg py-2.5 items-center">
              <Text className="text-white text-xs font-semibold">Send Reset Link</Text>
            </Pressable>
          </View>
        )}

        {!showForgot && <View className="mb-6" />}

        {/* Submit */}
        <Pressable onPress={handleLogin} className="bg-maroon rounded-xl py-3.5 items-center mb-4">
          <Text className="text-white font-semibold">Log In</Text>
        </Pressable>

        <View className="flex-row justify-center">
          <Text className="text-ink/60 text-xs">Don&apos;t have an account? </Text>
          <Pressable onPress={() => router.push('/signup')}>
            <Text className="text-maroon text-xs font-semibold">Sign Up</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push('/dashboard')} className="items-center mt-7 py-2">
          <Text className="text-ink/45 text-xs">Facilities staff? Open the staff portal</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
