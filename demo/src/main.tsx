import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/AuthProvider.tsx";
import LogProvider from "./context/LogsProvider.tsx";
import { CookiesProvider } from "react-cookie";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <CookiesProvider>
        <LogProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LogProvider>
      </CookiesProvider>
    </BrowserRouter>
  </StrictMode>
);
