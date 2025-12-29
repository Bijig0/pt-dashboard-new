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
import { useSignIn } from '../../hooks';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInMutation = useSignIn();

  // Navigate on success
  useEffect(() => {
    if (signInMutation.isSuccess) {
      router.replace('/(tabs)');
    }
  }, [signInMutation.isSuccess]);

  // Set error on failure
  useEffect(() => {
    if (signInMutation.error) {
      setError(signInMutation.error.message);
    }
  }, [signInMutation.error]);

  const handleSignIn = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError(null);
    signInMutation.mutate({ email, password });
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
        <View className="flex-1 px-6 pt-20 pb-8">
          {/* Header */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-2xl bg-blue-100 items-center justify-center mb-4">
              <Ionicons name="scan" size={40} color="#2563eb" />
            </View>
            <Text className="text-3xl font-bold text-gray-900">Welcome back</Text>
            <Text className="text-gray-500 mt-2">Sign in to continue</Text>
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

            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-1.5">Password</Text>
              <View className="relative">
                <Input
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
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

            <Button
              title="Sign In"
              onPress={handleSignIn}
              isLoading={signInMutation.isPending}
              size="lg"
              className="w-full"
            />
          </View>

          {/* Sign up link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Skip for demo */}
          <TouchableOpacity
            onPress={() => router.replace('/(tabs)')}
            className="mt-8 py-3"
          >
            <Text className="text-center text-gray-400">
              Skip for now (Demo Mode)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
