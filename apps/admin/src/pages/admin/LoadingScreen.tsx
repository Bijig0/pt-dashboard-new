import { LoadingSpinner } from "../../context/ToastContext";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 min-h-screen text-center">
      <LoadingSpinner />
      <div className="text-sm font-semibold text-gray-500">Loading...</div>
    </div>
  );
}
