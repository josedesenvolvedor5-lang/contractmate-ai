import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCpsz-CCV_IRcIaN3gDQwzi-VyhW9dhVuk",
  authDomain: "analise-d6dad.firebaseapp.com",
  projectId: "analise-d6dad",
  storageBucket: "analise-d6dad.firebasestorage.app",
  messagingSenderId: "573397705528",
  appId: "1:573397705528:web:b2cfa00905c35bf8bc17cd",
  measurementId: "G-QTDPLQW093",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
