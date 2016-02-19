$(document).ready(function() {
  createOverlay();
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
      fadeOverlay();
    }
});
}

function updateWeatherUI() {
  var now = weatherData.currently;
  var nowHour = dateFormat(now.time * 1000, "HH");
  var gradient = gradients[nowHour][0];
  var date = dateFormat(now.time * 1000, "dddd, mmmm dS, yyyy");
  var location = locationData.city + ", " + locationData.countryCode;
  var icon = conditionCodes[now.icon];
  var currentTemp = Math.round(now.temperature) + "°";
  var summary = now.summary;
  $('.accented').css({color: gradients[nowHour][1]});
  updateWeatherUILabels(gradient, date, location, icon, currentTemp, summary);
}

function updateTodayForecastUI() {
  var timeNow = currentTime.getTime();
  var data = weatherData.hourly.data;
  var maxItems = 10;
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

function updateWeatherUILabels(gradient, date, location, icon, temp, summary ) {
  $('.current-weather').addClass(gradient);
  $('.current-weather .date').html(date);
  $('.current-weather .location').html(location);
  $('#climacon').removeClass().addClass('climacon ' + icon);
  $('.current-weather .temperature').html(temp);
  $('.current-weather .description').html(summary);
}

function updateTodayForecastUILabels(time, temp, icon, summary) {
  $('.forecast-today tbody').append("<tr><td>" + time + "</td><td class='temperature'>" + temp + "</td><td class='climacon-cell'><span class='climacon " + icon + "'></span></td><td>" + summary + "</td></tr>");
}

function updateFiveDayForecastUILabels(day, conditionIcon, minTemp, maxTemp) {
  var $dayForecast = $('.five-day');
  $dayForecast.append('<div class="day"><p>' + day + '</p><p class="climacon ' + conditionIcon + '"></p><p><span class="max">' + maxTemp + '°</span> <span class="min">' + minTemp + '°</span></p></div>');
}

function createOverlay() {
  $('.overlay').addClass(gradients[12][0]);
}

function fadeOverlay() {
  $('.overlay').animate({
    opacity: 0
  }, 1000, function() {
    $(this).css({display:'none'});
  });
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

var gradients = {
 0: ['sky-gradient-00', '#20202c'],
 1: ['sky-gradient-01', '#20202c'],
 2: ['sky-gradient-02', '#20202c'],
 3: ['sky-gradient-03', '#3a3a52'],
 4: ['sky-gradient-04', '#515175'],
 5: ['sky-gradient-05', '#8a76ab'],
 6: ['sky-gradient-06', '#cd82a0'],
 7: ['sky-gradient-07', '#eab0d1'],
 8: ['sky-gradient-08', '#ebb2b1'],
 9: ['sky-gradient-09', '#b1b5ea'],
 10: ['sky-gradient-10', '#94dfff'],
 11: ['sky-gradient-11', '#67d1fb'],
 12: ['sky-gradient-12', '#38a3d1'],
 13: ['sky-gradient-13', '#246fa8'],
 14: ['sky-gradient-14', '#1e528e'],
 15: ['sky-gradient-15', '#5b7983'],
 16: ['sky-gradient-16', '#265889'],
 17: ['sky-gradient-17', '#e9ce5d'],
 18: ['sky-gradient-18', '#b26339'],
 19: ['sky-gradient-19', '#B7490F'],
 20: ['sky-gradient-20', '#240E03'],
 21: ['sky-gradient-21', '#2F1107'],
 22: ['sky-gradient-22', '#4B1D06'],
 23: ['sky-gradient-23', '#150800'],
 24: ['sky-gradient-24', '#150800']
};













