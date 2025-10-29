import { useState, useEffect } from "react";
import "../styles/Header.scss";
import logo from "../assets/images/logo.svg";
import iconMoon from "../assets/images/icon-moon.svg";
import iconSun from "../assets/images/icon-sun.svg";
import iconArrow from "../assets/images/icon-arrow-down.svg";
import Switch from "./Switch";

const Header = function () {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <header>
      <nav>
        <div className="font_selection_container">
          <img src={logo} alt="logo" loading="lazy" />
        </div>

        <div className="theme_container">
          <div>
            <p>San Serif</p>
            <img src={iconArrow} alt="icon" loading="lazy" />

            <div className="vertical_divisor"></div>

            <Switch isDarkMode={isDarkMode} onToggle={toggleDarkMode} />

            {isDarkMode ? (
              <img src={iconMoon} alt="icon moon" loading="lazy" />
            ) : (
              <img src={iconSun} alt="icon sun" loading="lazy" />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
