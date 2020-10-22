// Created global variables for the API keys that will be used in different AJAX calls.
var APIWeatherKey = "b37332257de420fc6dfcda2bbba28fbd";
var APIParkKey = "IeMPkZS36TxiVcv1TUIT5yzANx6szGLJE5BsDsZA";

// Created a variable to change the API response units of measurement.
var imperialUnit = "&units=imperial";

// Created global variables to store user input.
var inputCity = "Orlando";
var inputStateCode = "FL";

// Check with team
var parkLimitResult = "&limit=10"; 

// Check with team
var parkSelected = "";

// park queries field: parkCode, stateCode, limit(results up to 50), start(get the next limit result), q (a string to search for), sort (A comma delimited list of fields to sort the results by)
var parkURL = "https://developer.nps.gov/api/v1/parks?api_key=" + APIParkKey + parkLimitResult + "&q" + inputStateCode;

// park alerts queries field: parkCode, stateCode, limit, start, q
var parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey + parkLimitResult + "&q" + inputStateCode;

// park campgrounds queries field: parkCode, stateCode, limit, start, q
var parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey + parkLimitResult + "&q" + inputStateCode;

// park events queries field: parkCode, organization, subject, portal, tagsAll, tagsOne, tagsNone, stateCode, dateStart, dateEnd, eventTyoe, id (ent id), q, pageSize, pageNumber, expandRecurring
var parkEventsURL = "https://developer.nps.gov/api/v1/events?api_key=" + APIParkKey + "&q" + inputStateCode;

//no infor for plants and wildlife

// to be considered, park to do queries field: id (things to do id), parkCode, stateCode, limit, start, q, sort
var parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey + "&q" + inputStateCode;

// URL to take 5 days forecast, need to discuss about taking city and state
var fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?appid=" + APIWeatherKey + imperialUnit + "&q" + inputCity + "," + inputStateCode;

// AJAX call for parks
$.ajax({
    url: parkURL,
    method: "GET"
}).then(function(parkRes){
    console.log(parkRes);
})

// AJAX call for park alerts
$.ajax({
    url: parkAlertsURL,
    method: "GET"
}).then(function(alertRes){
    console.log(alertRes);
})

// AJAX call for park campgrounds
$.ajax({
    url: parkCampURL,
    method: "GET"
}).then(function(campRes){
    console.log(campRes);
})

// AJAX call for park event
$.ajax({
    url: parkEventsURL,
    method: "GET"
}).then(function(eventRes){
    console.log(eventRes);
})

// AJAX call for park to do
$.ajax({
    url: parkThingsToDoURL,
    method: "GET"
}).then(function(toDoRes){
    console.log(toDoRes);
})

// AJAX call to 5 days forecast
$.ajax({
    url: fiveDayWeatherURL,
    method: "GET"
}).then(function(fiveDayRes){
    console.log(fiveDayRes);

    // Variable to hold the forecast array
    var forecastArray = fiveDayRes.list

    // For loop to take the one day out of forecast array
    for (var i=0; i < forecastArray.length; i+=8){

        // variable to hold date and format to javaScript
        var date = new Date (forecastArray[i].dt_txt);
        console.log(date);

        // variable to hold icon name
        var icon = forecastArray[i].weather[0].icon;
        console.log(icon);

        // variable to hold min temperature
        var minTemp = forecastArray[i].main.temp_min;
        console.log(minTemp);

        // variable to hold max temperature
        var maxTemp = forecastArray[i].main.temp_max;
        console.log(maxTemp);

        // variable to hold humidity
        var humidity = forecastArray[i].main.humidity;
        console.log(humidity);

    }
})