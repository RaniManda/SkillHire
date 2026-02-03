const BASE_URL = "http://127.0.0.1:8000/auth";

/* ================= SEND OTP ================= */
export const sendOtpApi = async (email) => {
  try {
    const res = await fetch(`${BASE_URL}/api/send-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Failed to send OTP" };
    }

    return { message: data.message || "OTP sent to email" };
  } catch (err) {
    return { error: "Server not responding" };
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtpApi = async (email, otp) => {
  try {
    const res = await fetch(`${BASE_URL}/api/verify-otp/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Invalid OTP" };
    }

    return { message: data.message || "OTP verified" };
  } catch (err) {
    return { error: "Server not responding" };
  }
};

/* ================= REGISTER ================= */
export const registerApi = async ({ username, email, password, role, otp }) => {
  try {
    const res = await fetch(`${BASE_URL}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, role, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Registration failed" };
    }

    return { message: data.message || "Account created successfully!" };
  } catch (err) {
    return { error: "Server not responding" };
  }
};

/* ================= LOGIN ================= */
export const loginApi = async (email, password) => {
  try {
    const res = await fetch(`${BASE_URL}/api/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Invalid email or password" };
    }

    // Return message and user data for role-based navigation
    return {
      message: data.message || "Login successful",
      user: data.user || null, // Should contain { role: "student" | "recruiter" }
    };
  } catch (err) {
    return { error: "Server not responding" };
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPasswordApi = async (email, otp, newPassword) => {
  try {
    const res = await fetch(`${BASE_URL}/api/reset-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp, new_password: newPassword }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Password reset failed" };
    }

    return { message: data.message || "Password reset successfully" };
  } catch (err) {
    return { error: "Server not responding" };
  }
};
