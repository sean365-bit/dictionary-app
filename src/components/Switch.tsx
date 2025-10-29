import "../styles/Switch.scss";

interface SwitchProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const Switch = ({ isDarkMode, onToggle }: SwitchProps) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={onToggle}
        id="checkbox"
      />
      <span className="slider round"></span>
    </label>
  );
};

export default Switch;
