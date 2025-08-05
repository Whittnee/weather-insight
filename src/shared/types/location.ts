type TWeatherPoint = {
  time: string;
  temperature: string;
} 

export type TLocation = {
  name: string;
  data: TWeatherPoint[]
}