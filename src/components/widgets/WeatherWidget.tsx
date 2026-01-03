import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, ThermometerSun, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  description: string;
}

const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="w-10 h-10 text-yellow-500" />;
  if (code <= 3) return <Cloud className="w-10 h-10 text-muted-foreground" />;
  if (code <= 67) return <CloudRain className="w-10 h-10 text-blue-400" />;
  if (code <= 77) return <Snowflake className="w-10 h-10 text-blue-200" />;
  return <CloudRain className="w-10 h-10 text-blue-500" />;
};

const getWeatherDescription = (code: number): string => {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  if (code <= 86) return 'Snow showers';
  return 'Thunderstorm';
};

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>('Loading...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await response.json();
      
      setWeather({
        temperature: Math.round(data.current.temperature_2m),
        weatherCode: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        feelsLike: Math.round(data.current.apparent_temperature),
        description: getWeatherDescription(data.current.weather_code),
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch weather');
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding for city name
          try {
            const geoResponse = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const geoData = await geoResponse.json();
            setLocation(geoData.city || geoData.locality || 'Your Location');
          } catch {
            setLocation('Your Location');
          }
          
          fetchWeather(latitude, longitude);
        },
        () => {
          // Default to New York if location denied
          setLocation('New York');
          fetchWeather(40.7128, -74.006);
        }
      );
    } else {
      setLocation('New York');
      fetchWeather(40.7128, -74.006);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="widget-card flex items-center justify-center min-h-[200px]"
      >
        <div className="animate-pulse text-muted-foreground">Loading weather...</div>
      </motion.div>
    );
  }

  if (error || !weather) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="widget-card"
      >
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-2">{error || 'Unable to load weather'}</p>
          <Button variant="secondary" size="sm" onClick={getLocation}>
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="widget-card"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-foreground">{location}</h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {getWeatherIcon(weather.weatherCode)}
          <div>
            <p className="text-4xl font-bold text-foreground">{weather.temperature}°C</p>
            <p className="text-sm text-muted-foreground">{weather.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <ThermometerSun className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-xs text-muted-foreground">Feels like</p>
            <p className="text-sm font-medium text-foreground">{weather.feelsLike}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-xs text-muted-foreground">Humidity</p>
            <p className="text-sm font-medium text-foreground">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Wind</p>
            <p className="text-sm font-medium text-foreground">{weather.windSpeed} km/h</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};