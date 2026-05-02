export function getFirebaseErrorMessages(code) {
  const errors = {
    "auth/invalid-credential": "Incorrect email or password",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-email": "Invalid email format",
    "auth/email-already-in-use": "Email is already in use",
    "auth/invalid-email": "Invalid email format",
    "auth/weak-password": "Password should be at least 6 characters",
    "auth/user-not-found": "No account found with this email",
    "auth/invalid-email": "Invalid email format",
  };

  return errors[code] || "Something went wrong. Please try again";
}
