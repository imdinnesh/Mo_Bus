export const OTP_VALIDITY_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds
export const RESEND_COOLDOWN_DURATION = 30 * 1000 // 30 seconds in milliseconds

export interface OTPSession {
  otpSentAt: number
  resendCooldownStartedAt?: number
}

export function getOTPSession(): OTPSession | null {
  const session = localStorage.getItem("otp-session")
  return session ? JSON.parse(session) : null
}

export function saveOTPSession(session: OTPSession) {
  localStorage.setItem("otp-session", JSON.stringify(session))
}

export function clearOTPSession() {
  localStorage.removeItem("otp-session")
}

export function isOTPValid(session: OTPSession): boolean {
  const now = Date.now()
  return now - session.otpSentAt < OTP_VALIDITY_DURATION
}

export function isResendAllowed(session: OTPSession): boolean {
  if (!session.resendCooldownStartedAt) return true
  const now = Date.now()
  return now - session.resendCooldownStartedAt >= RESEND_COOLDOWN_DURATION
}

export function startResendCooldown(session: OTPSession): OTPSession {
  return {
    ...session,
    resendCooldownStartedAt: Date.now(),
  }
}
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
}

export function getDeviceId(): string {
  let deviceId = localStorage.getItem("device_id")
  if (!deviceId) {
    deviceId = crypto.randomUUID()
    localStorage.setItem("device_id", deviceId)
  }
  return deviceId
}

export function clearDeviceId() {
  localStorage.removeItem("device_id")
}

export function getTimeRemaining(session: OTPSession): number {
  const now = Date.now()
  return Math.max(0, OTP_VALIDITY_DURATION - (now - session.otpSentAt))
}

export function getCooldownRemaining(session: OTPSession): number {
  if (!session.resendCooldownStartedAt) return 0
  const now = Date.now()
  return Math.max(0, RESEND_COOLDOWN_DURATION - (now - session.resendCooldownStartedAt))
}

export function createOTPSession(): OTPSession {
  const now = Date.now()
  const session = {
    otpSentAt: now,
    resendCooldownStartedAt: now,
  }
  saveOTPSession(session)
  return session
}

export function updateCooldownInSession() {
  const session = getOTPSession()
  if (!session) return

  delete session.resendCooldownStartedAt
  saveOTPSession(session)
}

