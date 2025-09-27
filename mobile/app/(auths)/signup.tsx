import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/schemas/auth.schema";
import { useAuthStore } from "@/store/auth.store";
import { toast } from 'sonner-native';

export default function Signup() {
  const router = useRouter();
  const { signup, loading, error} = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    signup(data);
    if (error) {
      toast.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.description}>
        Enter your details below to create your account
      </Text>

      {/* Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="John Doe"
              placeholderTextColor="#aaa"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="johndoe@example.com"
              placeholderTextColor="#aaa"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
      </View>

      {/* Password */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Password</Text>
        </View>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#aaa"
              style={styles.input}
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
      </View>

      {/* Signup button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Signup</Text>
        )}
      </TouchableOpacity>

      {/* Google signup */}
      <TouchableOpacity style={[styles.button, styles.googleButton]}>
        <Text style={[styles.buttonText, { color: "#000" }]}>
          Signup with Google
        </Text>
      </TouchableOpacity>

      {/* Login link */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => router.push("/(auths)/login")}>
          Sign in
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#0E1A12",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#fff",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1D2B20",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
  successText: {
    fontSize: 12,
    color: "lightgreen",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#FF6A3D",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF6A3D",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loginText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    color: "#ccc",
  },
  link: {
    color: "#FF6A3D",
    fontWeight: "600",
  },
});
