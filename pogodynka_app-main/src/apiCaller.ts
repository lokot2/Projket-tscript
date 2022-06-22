import { IForecastData, IWeatherData } from './interface';

export const DATA_KEY = "weather_data"
const API_KEY = "db7377f93359ecf8f4deebf40f3cd76f";

export class ApiCaller {
    constructor() {
        this.callData();
    }

    async callData(city?: string) {
        if(city) {
            const weather = await this.getWeatherData(city);
            if(weather && weather.cod === 200) {
                this.saveData(weather);
            }

            return weather.cod;
        } 
    }
    // Data refresh rate and return a new city weather data
    async refreshData(): Promise<IWeatherData[]> {
        const currentCities = (JSON.parse(localStorage.getItem(DATA_KEY)) as IWeatherData[])
            ?.map(v => v.name) || [];
        const newCities = Promise.all(currentCities.map(async (city) => {
            const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
            const weatherResp = await fetch(apiURL);
            const weatherData: IWeatherData = await weatherResp.json();
            this.saveData(weatherData);

            return weatherData;
        }));
        return newCities;
    }
    // Generate weather data for the city API call.
    async getWeatherData(city: string): Promise<IWeatherData> {
        const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        const weatherResp = await fetch(apiURL);
        const weatherData: IWeatherData = await weatherResp.json();

        return weatherData;
    }
    // Getting the forecast data from open weather map
    async getForecastData(lat: number, long: number): Promise<IForecastData> {
        const apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=minutely,hourly&appid=${API_KEY}&units=metric`;
        const forecastResp = await fetch(apiURL);
        const forecastData: IForecastData = await forecastResp.json();
        forecastData.daily = forecastData.daily.slice(0, 10);

        return forecastData;
    }
    // Save data to local storage and avoid refresh if there is data.
    saveData(data: IWeatherData) {
        const currentData = this.getData();
        const indexInLS = currentData.findIndex((val) => val.id === data.id);
        if(indexInLS !== -1) {
            currentData[indexInLS] = data;
            localStorage.setItem(DATA_KEY, JSON.stringify(currentData));
            return;
        }

        localStorage.setItem(DATA_KEY, JSON.stringify([...currentData, data]));
    }

    getData(): IWeatherData[] {
        const data = localStorage.getItem(DATA_KEY);
        if (data)
            return JSON.parse(data);
        return [];
    }
}
