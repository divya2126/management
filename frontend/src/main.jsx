import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "antd/dist/reset.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="268325763646-64ato9un63m92p921uf83itmtohfdt65.apps.googleusercontent.com">
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>,
);
