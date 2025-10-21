// API Configuration
const STATION_ID = "81414"; // 
const TOKEN = "97b936d4-e681-4890-bc79-5d58010ea333 ";
const API_URL = ' https://swd.weatherflow.com/swd/rest/better_forecast';
// Get references to HTML elements

const refreshBtn = document.getElementById('refreshBtn');
const toggleAutoBtn = document.getElementById('autoInterval');
const statusDiv = document.getElementById('status');

// URLSearchParams formats the parameters we want to send to the API
// we will send the station id, token, units,etc.
// try .. catch  means if there is an error, it will be caught and handled(like if the API is down)
//Await fetch(fullURL) getting data from the API