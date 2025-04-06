import { useTheme } from "../../App";

const Spinner = () => {
  const { darkMode } = useTheme();

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full h-8 w-8 border-4 ${
          darkMode ? 'border-gray-500' : 'border-[#155990]'
        } border-t-transparent`}
      ></div>
    </div>
  );
};

export default Spinner;

{/*import { useTheme } from "../../App";

const Spinner = () => {
  const { darkMode } = useTheme();

  return (
    <div className="fixed inset-0 min-h-screen w-screen flex justify-center items-center bg-white dark:bg-gray-900 z-50">
      <div
        className={`animate-spin rounded-full h-12 w-12 border-4 ${
          darkMode ? 'border-gray-500' : 'border-[#155990]'
        } border-t-transparent`}
      ></div>
    </div>
  );
};

export default Spinner; */}