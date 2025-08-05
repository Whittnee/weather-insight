import { useEffect, type FC } from "react";
import { TemperatureCharts } from "@/features/temperature-charts";
import { useTheme } from "@/app/themes/theme-context";
import styles from "./app.module.scss";
import clsx from "clsx";

const App: FC = () => {
  const { theme } = useTheme();

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    };

    setVh();
  }, []);

  return (
    <div className={clsx(styles.app, { [styles.dark]: theme === "dark" })}>
      <main className={styles.main}>
        <TemperatureCharts />
      </main>
    </div>
  );
};

export default App;
