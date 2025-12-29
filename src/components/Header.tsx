import { useState, useEffect, useRef } from "react";
import "../styles/Header.scss";
import logo from "../assets/images/logo.svg";
import iconMoon from "../assets/images/icon-moon.svg";
import iconSun from "../assets/images/icon-sun.svg";
import iconArrow from "../assets/images/icon-arrow-down.svg";
import Switch from "./Switch";

const Header = function () {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
          <div className="theme_options">
            <NavItem />

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

const NavItem = function () {
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("Sans Serif");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = function (option: string) {
    setSelectedOption(option);
    setOpen(false);
  };

  const getClassName = function () {
    let className = "option_one";

    if (selectedOption === "Sans Serif") className = "option_one";
    if (selectedOption === "Serif") className = "option_two";
    if (selectedOption === "Mono") className = "option_three";

    return className;
  };

  return (
    <div className="navItem" ref={dropdownRef}>
      <p className={getClassName()}>{selectedOption}</p>

      <img
        src={iconArrow}
        alt="icon"
        loading="lazy"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="dropdown">
          <p onClick={() => handleSelect("Sans Serif")} className="option_one">
            Sans Serif
          </p>
          <p onClick={() => handleSelect("Serif")} className="option_two">
            Serif
          </p>
          <p onClick={() => handleSelect("Mono")} className="option_three">
            Mono
          </p>
        </div>
      )}

      <div className="vertical_divisor"></div>
    </div>
  );
};

export default Header;
