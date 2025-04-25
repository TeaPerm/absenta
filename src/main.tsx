import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import Router from "./pages/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          toastOptions={{
            style: {
              background: "#0284c7",
              border: "1px solid oklch(90.1% 0.058 230.902)",
            },
          }}
        />
        <Router />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
