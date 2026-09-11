import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppAlert } from '@/components/app-alert';
import { useAuth } from '@/context/auth-context';

export default function SignUpScreen() {
  const router = useRouter();
  const { showAlert } = useAppAlert();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCreateAccount = async () => {
    if (!fullName.trim() || !email.trim() || !studentId.trim() || !password) {
      showAlert('Missing info', 'Please fill in all fields.');
      return;
    }
    if (!email.includes('@')) {
      showAlert('Invalid email', 'Please enter a valid campus email address.');
      return;
    }
    if (password.length < 8) {
      showAlert('Weak password', 'Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      showAlert("Passwords don't match", 'Please re-enter matching passwords.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: fullName.trim(),
        email: email.trim(),
        student_id: studentId.trim(),
        password,
        password_confirmation: confirmPassword,
      });
      showAlert('Account created!', 'Welcome to UM Fixhub.', [
        { text: 'Continue', onPress: () => router.replace('/home') },
      ]);
    } catch (err: any) {
      console.log('SIGNUP ERROR:', JSON.stringify(err.toJSON ? err.toJSON() : err));
      console.log('SIGNUP ERROR RESPONSE:', JSON.stringify(err.response?.data));
      const errors = err.response?.data?.errors as Record<string, string[]> | undefined;
      const message = errors ? Object.values(errors)[0]?.[0] : 'Could not create account.';
      showAlert('Sign up failed', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ alignItems: 'center' }} className="flex-1 bg-cream">
      <ScrollView
        style={{ width: '100%', maxWidth: 430 }}
        contentContainerClassName="px-6 pt-2 pb-8"
        showsVerticalScrollIndicator={false}
      >
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
        <Text className="text-ink text-2xl font-bold mb-1">Create an Account</Text>
        <Text className="text-ink/60 text-sm mb-6 leading-5">
          Please fill in your correct student or faculty credentials.
        </Text>

        {/* Full Name */}
        <Text className="text-ink text-sm font-medium mb-1.5">Full Name</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="e.g. Lorena Odiong"
          placeholderTextColor="#8A7B7E"
          className="bg-white border border-ink/10 rounded-xl px-4 py-3.5 text-ink mb-4"
        />

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

        {/* Student ID */}
        <Text className="text-ink text-sm font-medium mb-1.5">Student / Staff ID</Text>
        <TextInput
          value={studentId}
          onChangeText={setStudentId}
          placeholder="e.g. 696969"
          placeholderTextColor="#8A7B7E"
          className="bg-white border border-ink/10 rounded-xl px-4 py-3.5 text-ink mb-4"
        />

        {/* Password */}
        <Text className="text-ink text-sm font-medium mb-1.5">Password</Text>
        <View className="flex-row items-center bg-white border border-ink/10 rounded-xl px-4 mb-4">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Create strong password"
            placeholderTextColor="#8A7B7E"
            secureTextEntry={!showPassword}
            className="flex-1 py-3.5 text-ink"
          />
          <Pressable onPress={() => setShowPassword((v) => !v)}>
            <Text className="text-ink/50 text-xs font-medium">{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>

        {/* Confirm Password */}
        <Text className="text-ink text-sm font-medium mb-1.5">Confirm Password</Text>
        <View className="flex-row items-center bg-white border border-ink/10 rounded-xl px-4 mb-8">
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter password"
            placeholderTextColor="#8A7B7E"
            secureTextEntry={!showConfirm}
            className="flex-1 py-3.5 text-ink"
          />
          <Pressable onPress={() => setShowConfirm((v) => !v)}>
            <Text className="text-ink/50 text-xs font-medium">{showConfirm ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>

        {/* Submit */}
        <Pressable
          onPress={handleCreateAccount}
          disabled={submitting}
          className="bg-maroon rounded-xl py-3.5 items-center mb-4"
        >
          <Text className="text-white font-semibold">{submitting ? 'Creating account...' : 'Create Account'}</Text>
        </Pressable>

        <View className="flex-row justify-center">
          <Text className="text-ink/60 text-xs">Already have an account? </Text>
          <Pressable onPress={() => router.push('/login')}>
            <Text className="text-maroon text-xs font-semibold">Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}