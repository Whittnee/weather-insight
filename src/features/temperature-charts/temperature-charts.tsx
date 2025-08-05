import { useEffect, useState, type FC } from "react";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTheme } from "@/app/themes/theme-context";
import type { TLocation } from "@/shared/types/location";
import { getLocations } from "@/shared/api/locations";
import { locations } from "@/shared/assets/locations";
import { Preloader } from "@/shared/ui/preloader";
import clsx from "clsx";
import { ThemeToggle } from "@/features/theme-toggle";
import { ranges } from "@/shared/assets/ranges";

export const TemperatureCharts: FC = () => {
  const [charts, setCharts] = useState<TLocation[]>([]);
  const [range, setRange] = useState<number>(
    () => Number(localStorage.getItem("temp-range")) || 24
  );
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const responses = await getLocations(locations);
      const parsedData: TLocation[] = responses.map((res, idx) => {
        const { time, temperature_2m } = res.data.hourly;

        let sliced = time.map((t: string, i: number) => ({
          time: new Date(t).getHours() + ":00",
          date: new Date(t).toLocaleDateString(),
          temperature: temperature_2m[i],
        }));

        sliced = sliced.slice(-range);

        if (range > 24) {
          const grouped: Record<string, number[]> = {};
          sliced.forEach(
            (item: { time: string; date: string; temperature: number }) => {
              if (!grouped[item.date]) grouped[item.date] = [];
              grouped[item.date].push(item.temperature);
            }
          );

          sliced = Object.entries(grouped).map(([date, temps]) => ({
            time: date,
            temperature: +(
              temps.reduce((a, b) => a + b, 0) / temps.length
            ).toFixed(1),
          }));
        }

        return {
          name: locations[idx].name,
          data: sliced,
        };
      });

      setCharts(parsedData);
      setIsLoading(false);
    };

    fetchData();
  }, [range]);

  const changeRange = (hours: number) => {
    setRange(hours);
    localStorage.setItem("temp-range", String(hours));
  };

  return isLoading ? (
    <div className={styles.preloader}>
      <Preloader />
    </div>
  ) : (
    <div className={clsx(styles.wrapper, { [styles.dark]: theme === "dark" })}>
      <motion.h1
        className={clsx(styles.title, { [styles.dark]: theme === "dark" })}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: "easeOut" }}
      >
        Weather Insight
      </motion.h1>
      <motion.div
        className={styles.topBar}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, ease: "easeOut" }}
      >
        <div className={styles.controls}>
          {ranges.map((r) => (
            <button
              key={r.label}
              onClick={() => changeRange(r.hours)}
              className={clsx(
                styles.button,
                { [styles.dark]: theme === "dark" },
                { [styles.active]: range === r.hours }
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </motion.div>

      <div className={styles.container}>
        {charts.map((chart) => (
          <motion.div
            key={chart.name}
            className={clsx(styles.card, { [styles.dark]: theme === "dark" })}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ease: "easeOut" }}
          >
            <h2>{chart.name}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="var(--accent-color)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
