const rootURL = 'https://api.openweathermap.org/data/2.5/weather?&appid=3a5fbdb21d0c6479ff9cff57c0e067bc';

export const fetchWeather = (lat, lon) => {
    const URL = rootURL+'&lat='+lat+'&lon='+lon+'&units=imperial';
    return fetch(URL)
        .then( res => res.json() )
        .then( json =>({
            temp: json.main.temp,
            wweather: json.weather[0].main,
        }))
};