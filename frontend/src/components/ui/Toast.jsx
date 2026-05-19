// components/ui/Toast.jsx
import { useUiStore } from "../../store/ui.store";

const colors = {
  success: "bg-green-500",
  error:   "bg-red-500",
  info:    "bg-indigo-500",
};

const Toast = () => {
  const toasts = useUiStore((s) => s.toasts);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            ${colors[t.type]} text-white text-sm
            px-4 py-3 rounded-lg shadow-lg
            animate-slide-in min-w-[220px]
          `}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default Toast;