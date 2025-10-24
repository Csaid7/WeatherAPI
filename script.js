let weatherData = null;
// icon mapping
// Icon mapping
const iconMap = {
    'clear-day': '☀️',
    'clear-night': '🌙',
    'cloudy': '☁️',
    'partly-cloudy-day': '⛅',
    'partly-cloudy-night': '☁️',
    'rainy': '🌧️',
    'possibly-rainy-day': '🌦️',
    'possibly-rainy-night': '🌧️',
    'snowy': '❄️',
    'foggy': '🌫️',
    'windy': '💨',
    'thunderstorm': '⛈️'
};

// API Configuration
const STATION_ID = "81414"; // 
const TOKEN = "97b936d4-e681-4890-bc79-5d58010ea333";
const API_URL = 'https://swd.weatherflow.com/swd/rest/better_forecast';
// Get references to HTML elements

const refreshBtn = document.getElementById('refreshBtn');
const toggleAutoBtn = document.getElementById('toggleAutoBtn');
const statusDiv = document.getElementById('status');

// URLSearchParams formats the parameters we want to send to the API
// we will send the station id, token, units,etc.
// try .. catch  means if there is an error, it will be caught and handled(like if the API is down)
//Await fetch(fullURL) getting data from the API
async function fetchWeatherData() {
    // weatherData = data;
    // console.log('API Response:', data);

    const params = new URLSearchParams({
        station_id: STATION_ID,
        token: TOKEN,
        units_temp: 'f',
        units_wind: 'mph',
        units_pressure: 'inhg',
        units_precip: 'in',
        units_distance: 'mi',
    });
    //takes the url and add the parameters to it 
    const fullURL = `${API_URL}?station_id=${STATION_ID}&token=${TOKEN}&units_temp=f&units_wind=mph&units_pressure=inhg&units_precip=in&units_distance=mi`;
    //updata the status div to show fetching data
    statusDiv.textContent = 'Status: Fetching data...';
    try {
        // makes http request to the API
        const repsonse = await fetch(fullURL);
        //transform the response into json format
        const data = await repsonse.json();

        weatherData = data;
        console.log('Weather Data:', data);

        // TEST
        console.log('API Response:', data);
        // update status to data loaded
        statusDiv.textContent = 'Status: Data loaded!';
        // calls functions to update the UI with the fetched data
         updateCurrentConditions(data);
         updateHourlyForecast(data);
         updateDailyForecast(data);

    }catch (error) {
        statusDiv.textContent = `Status: Error fetching data - ${error.message}`;
        console.error('Fetch error:', error);
    }
}
function updateCurrentConditions(data) {
    const current = data.current_conditions;

    // Update temperature
    document.getElementById('temperature').textContent = current.air_temperature;
    
    // update icon
   const iconElement = document.getElementById('Condition-icon');
iconElement.textContent = iconMap[current.icon] || '🌡️';
    // Update pressure
    document.getElementById('pressure').textContent = current.sea_level_pressure;
    
    // Update wind
    document.getElementById('wind').textContent = `${current.wind_avg} mph ${current.wind_direction_cardinal}`;
    
    // Update precip probability - FIXED!
    document.getElementById('precip').textContent = current.precip_probability;
    
    // Update condition text
    document.getElementById('condition-text').textContent = current.conditions;
    
}
function updateHourlyForecast(data) {
    const hourlyData = data.forecast.hourly;
    const hourlyDiv = document.getElementById('hourly');

    hourlyDiv.innerHTML = ''; // Clear existing content

    // Loop through hourly data and create elements
    for(let i = 0; i< 10; i++){
        const hour = hourlyData[i];

        const hourDiv = document.createElement('div');
        hourDiv.textContent = `Hour ${hour.local_hour}: ${hour.air_temperature}°F, Precip: ${hour.precip_probability}%`;
         hourlyDiv.appendChild(hourDiv)
    }
}
function updateDailyForecast(data) {
    const dailyData = data.forecast.daily;
    const dailyDiv = document.getElementById('daily');
    dailyDiv.innerHTML = ''; // Clear existing content

    for(let i = 0; i < dailyData.length; i++) {
        const day = dailyData[i];

        const dayDiv = document.createElement('div');
        dayDiv.textContent = `Day ${day.day_num}: High ${day.air_temp_high}°F, Low ${day.air_temp_low}°F, Precip: ${day.precip_probability}%`;
        dailyDiv.appendChild(dayDiv);
    }   
}


///later......
refreshBtn.addEventListener('click', function() {
    console.log('Refresh button clicked');
    fetchWeatherData();
} );

 let autoIntervalId = null;
 const intervalInput = document.getElementById('autoInterval');
 
 toggleAutoBtn.addEventListener('click', function()  {
 // check if auto refresh is already enabled
    if (autoIntervalId === null){
    // get the value from the input
    const seconds =  intervalInput.value;
        // validate the input
    if(seconds === '' || seconds < 20 || seconds > 120){
        alert ('Please enter a valid number between 20 and 120 seconds.');
        return;// exit the function if invalid
    }
    const milliseconds = seconds * 1000;
    
    autoIntervalId = setInterval(fetchWeatherData, milliseconds);
    toggleAutoBtn.textContent = 'Disable Auto';  // Change button text
    console.log('Auto refresh enabled every', seconds, 'seconds');

    }else{
        clearInterval(autoIntervalId);
        autoIntervalId = null;
        toggleAutoBtn.textContent = 'Enable Auto'; // Change button text
        console.log('Auto refresh disabled');

    }

 });


 fetchWeatherData();