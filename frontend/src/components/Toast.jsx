import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="toast toast-top toast-end">
      <div className={`alert ${type === "error" ? "alert-error" : "alert-success"}`}>
        <span>{message}</span>
      </div>
    </div>
  );
}

export default Toast;