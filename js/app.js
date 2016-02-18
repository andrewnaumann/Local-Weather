$(document).foundation();

$(document).ready(function() {
  getLocalWeather();
});

  var API_KEY = 'a73d37a70600c365418eb2fb677e0a11';
  var apiURL = "http://api.openweathermap.org/data/2.5/";
  var locationData;
  var weatherData = [];
  var forecastData = [];
  var fiveDayForecastData = [];
  var now = new Date();
  now = now.getTime();

function getLocalWeather() {
    $.getJSON('http://ip-api.com/json', function(data) {
      locationData = data;
      getWeatherDataFromLatLon(data.lat, data.lon);
    });
}

function getWeatherDataFromCity(city, countryCode) {
  var queryURL = apiURL + "weather?" + "q=" + city + "," + countryCode + "&units=metric" + "&appid=" + API_KEY;
  $.getJSON(queryURL, function(data) {
    weatherData.push(data);
    getForecastDataFromID(data.id);
//    getFiveDayForecastFromId(data.id);
    updateWeatherUI();
  });
}

function getWeatherDataFromLatLon(latitude, longitude) {
  var queryURL = apiURL + "weather?" + "lat=" + latitude + "&lon=" + longitude + "&units=metric" + "&appid=" + API_KEY;
  $.getJSON(queryURL, function(data) {
    
    if (data.cod === "404") {
      console.log("lat + lon search failed, searching by city");
      getWeatherDataFromCity(locationData.city, locationData.countryCode);
    } else {    
      weatherData.push(data);
      getForecastDataFromID(data.id);
//      getFiveDayForecastFromId(data.id);
      updateWeatherUI();
    }
  });
}

function getForecastDataFromLatLon(latitude, longitude) {
  var queryURL = apiURL + "forecast?" + "lat=" + latitude + "&lon=" + longitude + "&units=metric" + "&appid=" + API_KEY;
  $.getJSON(queryURL, function(data) {
    forecastData.push(data);
  });
}

function getForecastDataFromID(cityID) {
  var queryURL = apiURL + "forecast?" + "id=" + cityID + "&units=metric" + "&appid=" + API_KEY;
  $.getJSON(queryURL, function(data) {
    forecastData.push(data);
    todayForecast(forecastData[0]);
  });
}

function getFiveDayForecastFromId(cityID) {
  var queryURL = apiURL + "forecast/daily?" + "id=" + cityID + "&cnt=5" + "&units=metric" + "&appid=" + API_KEY;
  $.getJSON(queryURL, function(data) {
    fiveDayForecastData.push(data);
    fiveDayForecast(fiveDayForecastData[0]);
  });
}

function updateWeatherUI() {
  var data = weatherData[0];
  var weatherDate = new Date(data.dt * 1000);
  var climaconClass = iconForConditions(now, data.sys.sunrise, data.sys.sunset, data.weather[0].id);
  weatherDate = dateFormat(weatherDate, "dddd, mmmm dS, yyyy");
    $('.date').html(weatherDate);
    $('.location').html(data.name + ", " + data.sys.country);
    $('#climacon').removeClass().addClass("climacon " + climaconClass);
    $('.temperature').html(Math.round(data.main.temp) + "°");
    $('.forecast-description').html(data.weather[0].description);
}

function updateForecastUI(time, temperature, condition, icon) {
  var $todayForecast = $(".forecast-today tbody");
  $todayForecast.append("<tr><td class='time'>" + time + "</td><td class='temperature'>" + temperature + "</td><td class='icon'><span class='climacon " + icon + "'></span></td><td class='condititon'>" + condition + "</td></tr>");
}

//function updateFiveDayForecastUI(day, conditionIcon, minTemp, maxTemp) {
//  var $dayForecast = $('.five-day');
//  $dayForecast.append('<div class="day"><p>' + day + '</p><p class="climacon' + conditionIcon +"'></p><p>' + minTemp + ' / ' + maxTemp + ' </p></div>');
//}



function todayForecast(forecastData) {
  var data = forecastData;
  for (var i = 0; i < data.list.length; i++) {
    var forecastTime = data.list[i].dt * 1000;
    var forecastTemperature = Math.round(data.list[i].main.temp) + "°";
    var forecastCondition = data.list[i].weather[0].main;
    var todaysDay = dateFormat(now, "dd");
    var forecastDay = dateFormat(forecastTime, "dd");
    var forecastIcon = iconForConditions(forecastTime, weatherData[0].sys.sunrise, weatherData[0].sys.sunset, data.list[i].weather[0].id);;
    if ( forecastTime > now && todaysDay === forecastDay) {
      var forecastTime = dateFormat(data.list[i].dt * 1000, "h:MM TT");
      updateForecastUI(forecastTime, forecastTemperature, forecastCondition, forecastIcon );
    }
  }
}

//function fiveDayForecast(forecastData) {
//  var data = forecastData;
//  for(var i = 0; i < data.cnt; i++) {
//    var forecastDay = dateFormat(data.list[i].dt * 1000, "ddd");
//    var forecastConditionIcon = basicIconForConditions(data.list[i].weather[0].main);
//    var minTemp = Math.round(data.list[i].temp.min);
//    var maxTemp = Math.round(data.list[i].temp.max);
//    updateFiveDayForecastUI(forecastDay,forecastConditionIcon, minTemp, maxTemp);
//  }
//}

function basicIconForConditions(id) {
  if (id === 800) {
    return "sun";
  }
  return conditionCodes[id];
}

function iconForConditions(conditionTime, sunrise, sunset, id) {
  if (conditionTime > sunrise * 1000 && conditionTime < sunset * 1000) {
    if (id === 800) {
      return "sun";
    }
    return conditionCodes[id] + " sun";
  } else {
    if (id === 800) {
      return "moon";
    }
    return conditionCodes[id] + " moon";
  }
}


var conditionCodes = {
  200: "lightning",
  201: "lightning",
  202: "lightning",
  210: "lightning",
  211: "lightning",
  212: "lightning",
  221: "lightning",
  230: "lightning",
  231: "lightning",
  232: "lightning",
  300: "drizzle",
  301: "drizzle",
  302: "drizzle",
  310: "drizzle",
  311: "drizzle",
  312: "drizzle",
  313: "drizzle",
  314: "drizzle",
  321: "drizzle",
  500: "showers",
  501: "rain",
  502: "rain",
  503: "downpour",
  504: "downpour",
  511: "sleet",
  520: "showers",
  521: "showers",
  522: "rain",
  531: "showers",
  600: "flurries",
  601: "flurries",
  602: "snow",
  611: "sleet",
  612: "sleet",
  615: "sleet",
  616: "sleet",
  620: "sleet",
  621: "sleet",
  622: "sleet",
  701: "haze",
  711: "haze",
  721: "haze",
  731: "haze",
  741: "fog",
  751: "haze",
  761: "haze",
  762: "haze",
  771: "haze",
  781: "tornado",
  800: "clear",
  801: "cloud",
  802: "cloud",
  803: "cloud",
  804: "cloud",
  900: "tornado",
  901: "wind cloud",
  902: "wind cloud",
  903: "thermometer low",
  904: "thermometer high",
  905: "wind",
  906: "hail",
  951: "clear",
  952: "wind",
  953: "wind",
  954: "wind",
  955: "wind",
  956: "wind",
  957: "wind",
  958: "wind",
  959: "wind",
  960: "lightning",
  961: "lightning",
  962: "wind cloud",
}