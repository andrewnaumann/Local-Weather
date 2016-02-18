$(document).ready(function() {
  getLocalWeather();
});

  var API_KEY = "5dae11cfc0f09c4d4389e45ff5375087";
  var apiURL = "https://api.forecast.io/forecast/";
  var callbackFunction = "callback=weatherDataCallback";
  var currentTime = new Date();
  var weatherData = {};
  var locationData;


function getLocalWeather() {
    $.getJSON('http://ip-api.com/json', function(data) {
      locationData = data;
      getWeatherDataFromLatLon(data.lat, data.lon);
    });
}

function getWeatherDataFromLatLon(lat, lon) {
  var queryURL = apiURL + API_KEY + "/" + lat + "," + lon;
  $.ajax({
    url: queryURL,
 
    // The name of the callback parameter
    jsonp: "callback",
 
    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    
    data: {
      units: 'si'
    },
 
    // Work with the response
    success: function( response ) {
      weatherData = response;
      updateWeatherUI();
      updateTodayForecastUI();
      updateFiveDayForecastUI();
    }
});
}

function updateWeatherUI() {
  var now = weatherData.currently;
  var date = dateFormat(now.time * 1000, "dddd, mmmm dS, yyyy");
  var location = locationData.city + ", " + locationData.countryCode;
  var icon = conditionCodes[now.icon];
  var currentTemp = Math.round(now.temperature) + "°";
  var summary = now.summary;
  
  updateWeatherUILabels(date, location, icon, currentTemp, summary);
}

function updateTodayForecastUI() {
  var timeNow = currentTime.getTime();
  var data = weatherData.hourly.data;
  var maxItems = 5;
  for (var i = 0; i < data.length; i++) {
    var forecastTime = data[i].time * 1000;
    var forecastTemperature = Math.round(data[i].temperature) + "°";
    var forecastSummary = data[i].summary;
    var todaysDay = dateFormat(timeNow, "dd");
    var forecastDay = dateFormat(forecastTime, "dd");
    var forecastIcon = conditionCodes[data[i].icon];
    if ( forecastTime > timeNow && i <= maxItems) {
      var forecastTime = dateFormat(forecastTime, "h:MM TT");
      updateTodayForecastUILabels(forecastTime, forecastTemperature, forecastIcon, forecastSummary );
    }
  }
}

function updateFiveDayForecastUI() {
  var data = weatherData.daily.data;
  for(var i = 0; i < 5; i++) {
    var forecastDay = dateFormat(data[i].time * 1000, "ddd");
    var forecastConditionIcon = conditionCodes[data[i].icon];
    var minTemp = Math.round(data[i].temperatureMin);
    var maxTemp = Math.round(data[i].temperatureMax);
    updateFiveDayForecastUILabels(forecastDay, forecastConditionIcon, minTemp, maxTemp);
  }
}

function updateWeatherUILabels(date, location, icon, temp, summary ) {
  $('.current-weather .date').html(date);
  $('.current-weather .location').html(location);
  $('#climacon').removeClass().addClass('climacon ' + icon);
  $('.current-weather .temperature').html(temp);
  $('.current-weather .description').html(summary);
}

function updateTodayForecastUILabels(time, temp, icon, summary) {
  $('.forecast-today tbody').append("<tr><td>" + time + "</td><td>" + temp + "</td><td class='climacon-cell'><span class='climacon " + icon + "'></span></td><td>" + summary + "</td></tr>");
}

function updateFiveDayForecastUILabels(day, conditionIcon, minTemp, maxTemp) {
  var $dayForecast = $('.five-day');
  $dayForecast.append('<div class="day"><p>' + day + '</p><p class="climacon ' + conditionIcon + '"></p><p>' + minTemp + '° / ' + maxTemp + '° </p></div>');
}

var conditionCodes = {
  'clear-day': 'sun',
  'clear-night': 'moon',
  rain: 'rain',
  snow: 'snow',
  sleet: 'sleet',
  wind: 'wind',
  fog: 'fog',
  cloudy: 'cloud',
  'partly-cloudy-day': 'cloud sun',
  'partly-cloudy-night': 'cloud moon',
  hail: 'hail',
  thunderstorm: 'lightning',
  tornado: 'tornado'
};













