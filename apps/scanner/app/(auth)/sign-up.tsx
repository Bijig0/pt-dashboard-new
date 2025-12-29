import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input, Alert } from '../../components/ui';
import { useSignUp } from '../../hooks';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signUpMutation = useSignUp();

  // Navigate on success
  useEffect(() => {
    if (signUpMutation.isSuccess) {
      router.replace('/(tabs)');
    }
  }, [signUpMutation.isSuccess]);

  // Set error on failure
  useEffect(() => {
    if (signUpMutation.error) {
      setError(signUpMutation.error.message);
    }
  }, [signUpMutation.error]);

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError(null);
    signUpMutation.mutate({ email, password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 rounded-2xl bg-blue-100 items-center justify-center mb-4">
              <Ionicons name="person-add" size={40} color="#2563eb" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
            <Text className="text-gray-500 mt-2">Sign up to get started</Text>
          </View>

          {/* Error Alert */}
          {error && (
            <Alert type="error" message={error} className="mb-6" />
          )}

          {/* Form */}
          <View className="space-y-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              containerClassName="mb-4"
            />

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-1.5">Password</Text>
              <View className="relative">
                <Input
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password-new"
                  value={password}
                  onChangeText={setPassword}
                  className="pr-12"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={24}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              containerClassName="mb-6"
            />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              isLoading={signUpMutation.isPending}
              size="lg"
              className="w-full"
            />
          </View>

          {/* Sign in link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
