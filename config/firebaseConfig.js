import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCAK2VXxz31JKEC3Ls-2L6rahSMtUXn4ds",
  authDomain: "centavo-changer-monitoring.firebaseapp.com",
  projectId: "centavo-changer-monitoring",
  storageBucket: "centavo-changer-monitoring.firebasestorage.app",
  messagingSenderId: "647347749260",
  appId: "1:647347749260:web:cf4fcce885b32885e416a9",
  measurementId: "G-R7WE6X2QB8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
