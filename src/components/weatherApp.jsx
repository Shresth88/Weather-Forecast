import { useEffect, useState } from "react";
import axios from "axios";
import cloudy from '../assets/images/cloudy.png';
import loading from '../assets/images/loading.gif';
import rainy from '../assets/images/rainy.png';
import snowy from '../assets/images/snowy.png';
import sunny from '../assets/images/sunny.png';
import { API_KEY } from '../apiKey';
import './weatherApp.css';
import { 
    IconDropletHalfFilled, 
    IconMapPinFilled, 
    IconSearch, 
    IconWind, 
    IconClipboardTextFilled 
} from "@tabler/icons-react";
import dayjs from "dayjs";

const API_URL = `https://api.openweathermap.org/data/2.5/weather`;

const weatherImages = {
    Clear: sunny,
    Clouds: cloudy,
    Rain: rainy,
    Snow: snowy,
    Haze: cloudy,
    Mist: cloudy
};

const backgroundImages = {
    Clear: "linear-gradient(to right, #f3b07c, #fcd283)",
    Clouds: "linear-gradient(to right, #57d6d4, #f71eec)",
    Rain: "linear-gradient(to right, #5bc8fb, #80eaff)",
    Snow: "linear-gradient(to right, #aff2ff, #fff)",
    Haze: "linear-gradient(to right, #57d6d4, #71eeec)",
    Mist: "linear-gradient(to right, #57d6d4, #71eeec)",
};

const WeatherApp = function () {
    const [city, setCity] = useState("New Delhi");
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchResult();
    }, []);

    const fetchResult = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_URL, {
                params: { q: city, appid: API_KEY, units: "Metric" },
            });

            if (response?.data) {
                setData(response.data);
                updateSearchHistory(city);
            } else {
                setData({ notFound: "City not found. Please try again." });
            }
        } catch (error) {
            setData({ notFound: error.response?.status === 404 ? "City not found. Please try again." : "Something went wrong. Please try later." });
        }
        setIsLoading(false);
    };

    const updateSearchHistory = (newCity) => {
        setSearchHistory((prev) => {
            const updatedHistory = [newCity, ...prev.filter(c => c !== newCity)].slice(0, 5);
            return updatedHistory;
        });
    };

    const handleInputChange = (e) => {
        setCity(e.target.value);
    };

    const handleEnterPress = (e) => {
        if (e.key === "Enter") {
            fetchResult();
        }
    };

    const handleSearchIconClick = () => {
        fetchResult();
    };

    const handleClickOutsideSidebar = (event) => {
      if (isSidebarOpen && !event.target.closest(".sidebar") && !event.target.closest(".history-icon")) {
          setIsSidebarOpen(false);
      }
  };
  

    const handleCityClick = (selectedCity) => {
        setCity(selectedCity);
        fetchResult();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const weatherName = data.weather?.[0]?.main;
    const backgroundImage = data.weather ? backgroundImages[weatherName] : backgroundImages["Clear"];
    const date = dayjs().format("DD MMM YY");

    return (
        <div className="container" style={{ backgroundImage }}>
            <div className="weather-app" onClick={handleClickOutsideSidebar} style={{ backgroundImage: backgroundImage.replace ? backgroundImage.replace('to right', 'to top') : null }}>
                <div className="top-bar">
                    <IconClipboardTextFilled className="history-icon" onClick={toggleSidebar} />
                </div>

                <div className={`sidebar ${isSidebarOpen ? "open" : ""}`} style={{ backgroundImage }}>
                    <h3>Recent Searches</h3>
                    <ul>
                        {searchHistory.map((item, index) => (
                            <li key={index} onClick={() => handleCityClick(item)}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="search">
                    <div className="search-top">
                        <IconMapPinFilled />
                        <p>{city}</p>
                    </div>

                    <div className="search-bar">
                        <input onChange={handleInputChange} placeholder="Enter Location" onKeyDown={handleEnterPress} type="text" />
                        <IconSearch color="#333" onClick={handleSearchIconClick} />
                    </div>
                </div>

                {isLoading ? (
                    <img className="loader" src={loading} alt="loader" />
                ) : data.notFound ? (
                    <p className="error-message">{data.notFound}</p>
                ) : (
                    <>
                        <div className="weather">
                            <img src={weatherImages[weatherName ?? "Clear"]} />
                            <div className="weather-type">
                                {weatherName && <p>{weatherName}</p>}
                            </div>
                            <div className="weather-temp">
                                {data?.main && <p>{Math.floor(data.main.temp)}°</p>}
                            </div>
                        </div>
                        <div className="weather-date">
                            <p>{date}</p>
                        </div>
                        <div className="weather-data">
                            <div className="humidity">
                                <h4>Humidity</h4>
                                <IconDropletHalfFilled color="#fff" />
                                {data?.main?.humidity && <p>{data.main.humidity}%</p>}
                            </div>
                            <div className="wind">
                                <h4>Wind</h4>
                                <IconWind color="#fff" />
                                {data.wind && <p>{data.wind.speed} km/h</p>}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherApp;
