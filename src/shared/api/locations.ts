import axios from "axios";
import type { TLocations } from "../assets/locations";

export const getLocations = async (locations: TLocations) => {
  const responses = await Promise.all(
    locations.map((location) => 
      axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&hourly=temperature_2m`
      )
    )
  );

  return responses
};
