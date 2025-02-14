import { useTheme } from "../../App";
import "./Spinner.css";

const Spinner = () => {
  const { darkMode } = useTheme();

  return (
    <div className='loading-spinner'>
      <div className="spinner"></div>
    </div>
  );
};

export default Spinner;
