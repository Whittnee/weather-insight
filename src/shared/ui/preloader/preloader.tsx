import type { FC } from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { useTheme } from "../../../app/themes/theme-context";

export const Preloader: FC = () => {
  const { theme } = useTheme();
  return (
    <div className={styles.preloader}>
      <div
        className={clsx(styles.circle, { [styles.dark]: theme === "dark" })}
      ></div>
    </div>
  );
};
