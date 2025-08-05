import type { FC } from "react";
import { useTheme } from "../../app/themes/theme-context";
import styles from "./styles.module.scss";
import clsx from "clsx";

export const ThemeToggle: FC = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={clsx(styles.button, {[styles.dark]: theme === 'dark'})}
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};
