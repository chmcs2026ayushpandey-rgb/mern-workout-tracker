import { createContext, useContext } from "react";
import { Toaster, toast } from "react-hot-toast";

const ToastContext = createContext(toast);

export function ToastProvider({ children }) {
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#1a1a2e", color: "#fff" } }}
      />
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
