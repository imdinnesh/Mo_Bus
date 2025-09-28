import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner-native";
import { useAuthStore } from "@/store/auth.store";
import { OtpFormData, otpSchema } from "@/schemas/auth.schema";

export default function OtpVerify() {
  const router = useRouter();
  const { loading, error,resendOtp,email,verifyOtp } = useAuthStore();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");
  const inputs = useRef<(TextInput | null)[]>([]);

  // Handle typing in each box
  const handleChange = (text: string, index: number) => {
    let currentOtp = otpValue.split("");

    if (text.length > 1) {
      // Handle paste (fill all boxes)
      const chars = text.slice(0, 6).split("");
      setValue("otp", chars.join(""), { shouldValidate: true });
      chars.forEach((c, i) => (inputs.current[i] as any)?.setNativeProps({ text: c }));
      inputs.current[chars.length - 1]?.focus();
      return;
    }

    if (/^\d$/.test(text)) {
      currentOtp[index] = text;
      const newOtp = currentOtp.join("").padEnd(6, "");
      setValue("otp", newOtp, { shouldValidate: true });

      // Move to next
      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otpValue[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // On submit
  const onSubmit = async (data: OtpFormData) => {
    // Simulate API call
    if(!email){
      toast.error("Email is missing. Cannot verify OTP.");
      return;
    }
    await verifyOtp(data.otp,email,{
      onSuccess(msg) {
        toast.success(msg);
        router.replace("/(auths)/login")
      },
      onError(err) {
        toast.error(err.statusDesc)
      }
    })
  };

  // Resend OTP
  const handleResend = async () => {
    if (email) {
      await resendOtp(email,{
        onSuccess(msg) {
          toast.success(msg);
        },
        onError(err) {
          toast.error(err.statusDesc)
        }
      });
    } else {
      toast.error("Email is missing. Cannot resend OTP.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.description}>
        Enter the 6-digit code sent to your email
      </Text>

      {/* OTP Boxes */}
      <Controller
        control={control}
        name="otp"
        render={({ field: { value } }) => (
          <View style={styles.otpContainer}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputs.current[index] = ref; }}
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  defaultValue={value[index] || ""}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
          </View>
        )}
      />

      {errors.otp && (
        <Text style={styles.errorText}>{errors.otp.message}</Text>
      )}

      {/* Verify button */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      {/* Resend OTP */}
      <TouchableOpacity
        style={[styles.button, styles.resendButton]}
        onPress={handleResend}
      >
        <Text style={[styles.buttonText, { color: "#000" }]}>
          Resend OTP
        </Text>
      </TouchableOpacity>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1D2B20",
    borderRadius: 12,
    width: 48,
    height: 56,
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
    textAlign: "center",
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
  resendButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
