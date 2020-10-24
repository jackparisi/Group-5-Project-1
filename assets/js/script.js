// Document ready function to ensure functions just run after everything is loaded in the document.
$(document).ready(function(){

    // Created global variables for the API keys that will be used in different AJAX calls.
    var APIWeatherKey = "b37332257de420fc6dfcda2bbba28fbd";
    var APIParkKey = "IeMPkZS36TxiVcv1TUIT5yzANx6szGLJE5BsDsZA";

    // Created global variable to store user state input.

    var inputStateCode = "";
    $("#stateCode").on("change", function(){
        var state = $(this).val();
        console.log(state);
        inputStateCode = state;
        getParks(state);
    })

    // Global variable to save the city where the park is located, captured on address function, inside AJAX call for parks.
    var parkCity = "";

    // Global variable to hold park code.
    var parkCode = "";

    // park queries field: parkCode, stateCode, limit(results up to 50), start(get the next limit result), q (a string to search for), sort (A comma delimited list of fields to sort the results by)
    //var parkURL = "https://developer.nps.gov/api/v1/parks?api_key=" + APIParkKey + "&stateCode=" + inputStateCode;

    // Global variable to hold park alerts URL to be used in the event listener for the park button.
    var parkAlertsURL = "";

    // Global variable to hold park campground URL to be used in the event listener for the park button.
    var parkCampURL = "";

    // Global variable to hold park events URL to be used in the event listener for the park button.
    var parkEventsURL = "";

    // Global variable to hold park things to do URL to be used in the event listener for the park button.
    var parkThingsToDoURL = "";

    // Global variable to hold 5-day forecast URL to be used in the event listener for the park button.
    var fiveDayWeatherURL = "";

    
    function getParks(state){
    // AJAX call for parks
    // park queries field: parkCode, stateCode, limit(results up to 50), start(get the next limit result), q (a string to search for), sort (A comma delimited list of fields to sort the results by)
    var parkURL = "https://developer.nps.gov/api/v1/parks?api_key=" + APIParkKey + "&stateCode=" + state;

    $.ajax({
        url: parkURL,
        method: "GET"
    }).then(function(parkRes){
        console.log(parkRes);
        
        var stateParkDiv = $("<div class='statePark'>");

        $("#left").append(stateParkDiv);
        
        $(".statePark").empty();
        parkRes.data.forEach(function(data){
          
            
            // Create a button with the name of each park returned in the response
            var newParkBtn = $("<button>").text(data.name);

            // Add a data-name attribute with each park name.
            newParkBtn.attr("data-name", data.parkCode);

            // Add class to the button.
            newParkBtn.addClass("parkBtn");

            data.addresses.forEach(function(address){
                // console.log(address.city);
                newParkBtn.attr("value", address.city);                
                })

            // Append the button to section id left (we can change it later).
            $(".statePark").append(newParkBtn);

                        
            
        })
        
    })}

    
    function parkAlerts(){
    // AJAX call for park alerts
        $.ajax({
            url: parkAlertsURL,
            method: "GET"
        }).then(function(alertRes){
            console.log(alertRes);

            // Created new div and h3
            var newAlertDiv = $("<div class='alert'>");
            var newAlertH3 = $("<h3>").text("Park Alerts");

            // Append the new h3 to the new div
            newAlertDiv.append(newAlertH3);

            // Empty the section with id park-names and append the new div. 
            $("#middle").append(newAlertDiv);

            alertRes.data.forEach(function(alert){
                // Create new h4, p, and if there is an url it also creates a "a" tag.
                var newAlertH4 = $("<h4>").text(alert.title);
                var newAlertP = $("<p>").text(alert.description);
                if (alert.url !== ""){var newAlertA = $("<a>").attr("href", alert.url).text(alert.title);}
                // Append the new tags to the new div.
                newAlertDiv.append(newAlertH4, newAlertP, newAlertA);  
            })
        })
    }

    function parkCamp(){
    // AJAX call for park campgrounds
        $.ajax({
            url: parkCampURL,
            method: "GET"
        }).then(function(campRes){
            console.log(campRes);
            // Created new div and h3
            var newCampDiv = $("<div class='camp'>");
            var newCampH3 = $("<h3>").text("Campgrounds");

            // Append the new h3 to the new div
            newCampDiv.append(newCampH3);

            // Empty the section with id park-names and append the new div. 
            $("#middle").empty().append(newCampDiv);

            campRes.data.forEach(function(camp){
                // Create new h4, p, and if there is an url for reservation it also creates a "a" tag.
                var newCampH4 = $("<h4>").text(camp.name);
                var newCampP = $("<p>").text(camp.description);
                if (camp.reservationUrl !== ""){var newCampA = $("<a>").attr("href", camp.reservationUrl).text("Click Here for Reservation")}
                // Append the new tags to the new div.
                newCampDiv.append(newCampH4, newCampP, newCampA);
            })
        })
    }

    function parkEvent(){
        // AJAX call for park event
        $.ajax({
            url: parkEventsURL,
            method: "GET"
        }).then(function(eventRes){
            console.log(eventRes);
        })
    }

    function thingsTodo(){
    // AJAX call for park to do
        $.ajax({
            url: parkThingsToDoURL,
            method: "GET"
        }).then(function(toDoRes){
            console.log(toDoRes);
            var activities = toDoRes.data;
            // console.log(toDoRes.data);
            var toDoDiv = $("<div class='toDo'>");
            $("#right").append(toDoDiv);
            var actList = $("<ul class='list'>");
            $(".toDo").empty().append(actList);
            for(var i=0; i < activities.length; i++){
                console.log(activities[i].activities[0].name + activities[i].title);
                var listItem = $("<li>").text(activities[i].activities[0].name + " - " + activities[i].title);
                actList.append(listItem);
            }
        })
    }

    // Event listener to the button created inside the parkRes.data.forEach loop.
    $(document).on("click", ".parkBtn", function (event){
        event.preventDefault();
        $("#park-names").empty();

        // Updates parkCode accordingly with the button clicked.
        parkCode = $(this).attr("data-name");
        console.log(parkCode);
        parkCity = $(this).val();
        console.log(parkCity);

        fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial" + "&appid=" + APIWeatherKey + "&q=" + parkCity;
        forecast();

        parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        thingsTodo();

        parkEventsURL = "https://developer.nps.gov/api/v1/events?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        parkEvent();

        parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        parkCamp();

        parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        parkAlerts();
    })

    function forecast(){
        // AJAX call to 5 days forecast
        $.ajax({
            url: fiveDayWeatherURL,
            method: "GET"
        }).then(function(fiveDayRes){
            // console.log(fiveDayRes);

            // Variable to hold the forecast array
            var forecastArray = fiveDayRes.list

            var newDayH3 = $("<h3>").text("5-Day Forecast");

            var newCardDeck = $("<div class='card-deck'>");

            $("#forecast-weather").empty().append(newDayH3, newCardDeck);

            // For loop to take the one day out of forecast array
            for (var i=0; i < forecastArray.length; i+=8){

                var newDivCardBody = $("<div class='card-body'>");

                // variable to hold date and format to javaScript
                var date = new Date (forecastArray[i].dt_txt);
                // console.log(date);
                var displayDate = $("<p>").text(date.getMonth()+1 + "-" + date.getDate() + "-" + date.getFullYear());

                // variable to hold icon name
                var icon = forecastArray[i].weather[0].icon;
                // console.log(icon);

                // Create a new img tag, and add an attribute with the image address along with the icon name held in the forDayIcon variable.
                var imgDayIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + icon + ".png");           

                // variable to hold min temperature
                var minTemp = $("<p>").text("Temperature: " + forecastArray[i].main.temp_min + " ℉");
                // console.log(minTemp);

                // variable to hold max temperature
                var maxTemp = $("<p>").text("Temperature: " + forecastArray[i].main.temp_max + " ℉");;
                // console.log(maxTemp);

                // variable to hold humidity
                var humidity = $("<p>").text("Humidity: " + forecastArray[i].main.humidity + "%");
                // console.log(humidity);

                newDivCardBody.append(displayDate, imgDayIcon, minTemp, maxTemp, humidity);

                newCardDeck.append(newDivCardBody);

            }
        })
    }

})