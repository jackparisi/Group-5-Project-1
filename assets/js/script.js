// Document ready function to ensure functions just run after everything is loaded in the document.
$(document).ready(function(){

    // Global variables for the API keys that will be used in different AJAX calls.
    var APIWeatherKey = "b37332257de420fc6dfcda2bbba28fbd";
    var APIParkKey = "IeMPkZS36TxiVcv1TUIT5yzANx6szGLJE5BsDsZA";

    // Global variable to store user state input.
    var inputStateCode = "";

    // Global variable to save the city where the park is located, captured on address function, inside AJAX call for parks.
    var parkCity = "";

    // Global variable to hold park code.
    var parkCode = "";

    // Global variable to hold park alerts URL to be used in the event listener for the park button.
    var parkAlertsURL = "";

    // Global variable to hold park campground URL to be used in the event listener for the park button.
    var parkCampURL = "";

    // Global variable to hold park things to do URL to be used in the event listener for the park button.
    var parkThingsToDoURL = "";

    // Global variable to hold 5-day forecast URL to be used in the event listener for the park button.
    var fiveDayWeatherURL = "";

    // Array to store saved favorite parks.
    var favParkArray = [];
    // console.log(favParkArray);    

    // Event listner to the state options drop down menu.
    $("#stateCode").on("change", function(){
        var state = $(this).val();
        // console.log(state);
        // Update the global variable inputStateCode with the selected state.
        inputStateCode = state;
        // Call function getParks and use the select state in it.
        getParks(state);
    })

    // Call initial function.
    initial();
    
    // Function initial sets how the page should look when it is first loaded or refreshed by user.
    function initial(){
        // variable created to get items storage in the local storage and update favParkArray.
        var storedFav = JSON.parse(localStorage.getItem("favParkArray"));
        // If the saved objected in the local storage is not empty, then push the saved information to the favParkArray.
        if (storedFav !== null){
            favParkArray = storedFav;
        }
        // Call function that created button with the elements in the favParkArray.
        createFavoritesBtn();        
    }
    
    // Function that saves the favorite parks in the local storage.
    function storeParks(){
        localStorage.setItem("favParkArray", JSON.stringify(favParkArray));
    }

    // Function that list all parks for the selected state, from input on #stateCode listner event.
    function getParks(state){
    // Park API URL query by state code.
    var parkURL = "https://developer.nps.gov/api/v1/parks?api_key=" + APIParkKey + "&stateCode=" + state;
    // AJAX call for parks.
    $.ajax({
        url: parkURL,
        method: "GET"
    }).then(function(parkRes){
        // console.log(parkRes);
        
        // Remove the div with class statePark to avoide duplication of buttons.
        $(".statePark").remove();

        // Create new div with class statePark.
        var stateParkDiv = $("<div class='statePark'>");

        // Attach new div to the div id left.
        $("#left").append(stateParkDiv);
        
        // forEach function that loops through API response.
        parkRes.data.forEach(function(data){
          
            // Create a button with the name of each park returned in the response, and add class parkBtn.
            var newParkBtn = $("<button class='parkBtn'>").text(data.name);

            // Add a data-name attribute with each park name.
            newParkBtn.attr("data-name", data.parkCode);

            // forEach function to loop through the address array and take the city name to add as a value to each button.
            data.addresses.forEach(function(address){
                // console.log(address.city);
                newParkBtn.attr("value", address.city);                
                })

            // Append the button to section id left (we can change it later).
            $(".statePark").append(newParkBtn);
            
        })
        
    })}

    // Function that looks for the park alerts.
    function parkAlerts(url){
        // console.log(url)
    // AJAX call for park alerts
        $.ajax({
            url: url,
            method: "GET"
        }).then(function(alertRes){
            // console.log(alertRes);

            // Created new div and h3.
            var newAlertDiv = $("<div class='alertDiv'>");
            var newAlertH3 = $("<h3>").text("Park Alerts");

            // Append the new h3 to the new div.
            newAlertDiv.append(newAlertH3);

            // Append the new div to the div with class alert. 
            $(".alert").append(newAlertDiv);

            // In case the API return without any information for that park, then display a message.
            if (alertRes.data.length === 0){
                var newAlertP1 = $("<p>").text("There are no alert messages for this park at this time.");
                newAlertDiv.append(newAlertP1);
            }
            else {
                // If API has a populated response, than loop through it.
                alertRes.data.forEach(function(alert){
                    // Create new h4, p, and if there is an url it also creates a "a" tag.
                    var newAlertH4 = $("<h4>").text(alert.title);
                    var newAlertP = $("<p>").text(alert.description);
                    if (alert.url !== ""){var newAlertA = $("<a>").attr("href", alert.url).text(alert.title);}
                    // Append the new tags to the new div.
                    newAlertDiv.append(newAlertH4, newAlertP, newAlertA);  
                })
            }
        })
    }

    // Function that looks for the park campground information.
    function parkCamp(url){
        // console.log(url);
    // AJAX call for park campgrounds
        $.ajax({
            url: url,
            method: "GET"
        }).then(function(campRes){
            // console.log(campRes);

            // Created new div and h3.
            var newCampDiv = $("<div class='campDiv'>");
            var newCampH3 = $("<h3>").text("Campgrounds");

            // Append the new h3 to the new div.
            newCampDiv.append(newCampH3);

            // Append the new div to the div with class camp. 
            $(".camp").append(newCampDiv);

            // In case the API return without any information for that park, then display a message.
            if (campRes.data.length === 0){
                var newCampP1 = $("<p>").text("There is no campground information for this park.");
                newCampDiv.append(newCampP1);
            }
            else{
                // If API has a populated response, than loop through it.
                campRes.data.forEach(function(camp){
                    // Create new h4, p, and if there is an url for reservation it also creates a "a" tag.
                    var newCampH4 = $("<h4>").text(camp.name);
                    var newCampP = $("<p>").text(camp.description);
                    if (camp.reservationUrl !== ""){var newCampA = $("<a>").attr("href", camp.reservationUrl).text("Click Here for Reservation")}
                    // Append the new tags to the new div.
                    newCampDiv.append(newCampH4, newCampP, newCampA);
                })
            }
        })
    }

    // Function that looks for the park activities.
    function thingsTodo(url){
        // console.log(url);
    // AJAX call for park to do
        $.ajax({
            url: url,
            method: "GET"
        }).then(function(toDoRes){
            // console.log(toDoRes);

            // variable to save the response path.
            var activities = toDoRes.data;

            // Created new div and h3.
            var toDoDiv = $("<div class='toDoDiv'>");
            var actHead = $("<h3>").text("Park Activites");

            // Append the new h3 to the new div.
            toDoDiv.append(actHead);

            // Append the new div to the div with class toDo. 
            $(".toDo").append(toDoDiv);

            // In case the API return without any information for that park, then display a message.
            if (toDoRes.data.length === 0){
                var toDoP = $("<p>").text("There are no activities listed for this park at his time.")
                toDoDiv.append(toDoP);
            }
            else{
                // Create a new ul tag and add class list to it.
                var actList = $("<ul class='list'>");
                // Append the new ul tag to the div created at variable toDoDiv.          
                toDoDiv.append(actList);
                // If API has a populated response, than loop through it.
                for(var i=0; i < activities.length; i++){
                    // console.log(activities[i].activities[0].name + activities[i].title);
                    // Create a new list item for each activity type along with the activity title.
                    var listItem = $("<li>").text(activities[i].activities[0].name + " - " + activities[i].title);
                    // Append each new list item to the ul tag.
                    actList.append(listItem);
                }
            }
        })
    }

    // Event listner to the button that saves the favorite parks.
    $(document).on("click", ".favBtn", function(event){
        event.preventDefault();

        // Create a new object to save the information for the favorite park.
        // Grab current parkName, parkCode, parkCity and inputStateCode to be added in the new favorite parks buttons.
        var newFavorite = {
            text: parkName,
            dataName: parkCode,
            value: parkCity,
            dataState: inputStateCode,
        };

        // Create a variable with a boolean "true" to be used as a check before creating a button.
        var notFound = true

        // forEach loop through the favParkArray objects looking if the parkName inside the object property "text" already exist with that same name. If it does, then update the variable notFound to false.
        favParkArray.forEach(function(fav){
            if(fav.text === newFavorite.text){
            notFound = false}
        })
        
        // If notFound is true than push the object to the favParkArray.
        if(notFound){
         favParkArray.push(newFavorite);
        }
        // console.log(favParkArray);
        
        // Call function to store the new object in the local storage.
        storeParks();
        // Call function that creates a new button for each favorite park.
        createFavoritesBtn();
    })

    // Function that creates a new button for each favorite park.
    function createFavoritesBtn(){

        // Create a new div.
        var newFavDiv = $("<div class='favButtons'>");
        // Inside div with class favParkList find buttons with class favButtons and remove them. This is to avoid duplication.
        $(".favParkList").find(".favButtons").remove();
        
        // forEach loop through each object inside the favParkArray to create a new button.
        favParkArray.forEach(function(favLoop){

            // Create a button, give class favParkBtn, add text and attributes saved in the object properties so the favorite park function just like the park buttons.
            var favoritesBtn = $("<button class='favParkBtn'>").text(favLoop.text).attr("data-name", favLoop.dataName).attr("value", favLoop.value).attr("data-state", favLoop.dataState);
            // Append the new buttons to the div created at variable newFavDiv.
            newFavDiv.append(favoritesBtn);
        })
        // Append the new div to the div with class favParkList.
        $(".favParkList").append(newFavDiv);
    }

    // Event listener for the button created inside the parkRes.data.forEach loop.
    $(document).on("click", ".parkBtn", function (event){
        event.preventDefault();
        // Empty divs before appending the following to clean them before add new information.
        $(".alert").empty();
        $(".camp").empty();
        $(".toDo").empty();

        // Updates parkCode accordingly with the button clicked.
        parkCode = $(this).attr("data-name");
        // console.log(parkCode);

        // Grab button value to update the global variable parkCity.
        parkCity = $(this).val();
        // console.log(parkCity);

        // Grab button text to update the global variable parkName.
        parkName = $(this).text();
        
        // Create a new h3 with the park name.
        var parkNameH3 = $("<h3 class='header'>").text(parkName + " National Park");
        
        // Everytime a park name button is clicked the header is updated with the current clicked park name.
        $("header").empty().append(parkNameH3);

        // Create a button that gives the user the option to save the current park as favorite.
        var favBtn = $("<button class='favBtn'>").text("Save this park as Favorite");
        // Attach this button to the div with class favBtnDiv.
        $(".favBtnDiv").empty().append(favBtn);       

        // Update weather URL with currenty city.
        fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial" + "&appid=" + APIWeatherKey + "&q=" + parkCity;
        // Call function forecast.
        forecast(fiveDayWeatherURL);

        // Update things to do URL with current state code and park code.
        parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        // Call function thingsTodo.
        thingsTodo(parkThingsToDoURL);

        // Update campgrounds URL with current state code and park code.
        parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        // Call function parkCamp.
        parkCamp(parkCampURL);

        // Update alerts URL with current state code and park code.
        parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        // Call function parkAlerts.
        parkAlerts(parkAlertsURL);
    })

    // Event listener for the favorite parks button. Very similar to the event listner to the button "parkBtn"; however, here we do not need to create a button to save park as favorite, as it is already saved as favorite.
    $(document).on("click", ".favParkBtn", function (event){
        event.preventDefault();
        // Empty divs before appending the following to clean them before add new information.
        $(".alert").empty();
        $(".camp").empty();
        $(".toDo").empty();
        $(".favBtnDiv").empty();

        // Updates parkCode accordingly with the button clicked.
        parkCode = $(this).attr("data-name");
        // console.log(parkCode);

        // Updates parkCode accordingly with the button clicked.
        parkState = $(this).attr("data-state");
        // console.log(parkState);

        // Grab button value to update the global variable parkCity.
        parkCity = $(this).val();
        // console.log(parkCity);

        // Grab button text to update the global variable parkName.
        parkName = $(this).text();
        
        // Create a new h3 with the park name.
        var parkNameH3 = $("<h3 class='header'>").text(parkName + " National Park");
        
        // Everytime a park name button is clicked the header is updated with the current clicked park name.
        $("header").empty().append(parkNameH3);

        // Update weather URL with currenty city.
        fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial" + "&appid=" + APIWeatherKey + "&q=" + parkCity;
        // Call function forecast.
        forecast(fiveDayWeatherURL);

        // Update things to do URL with current state code and park code.
        parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey+ "&stateCode=" + parkState + "&parkCode=" + parkCode;
        // Call function thingsTodo.
        thingsTodo(parkThingsToDoURL);

        // Update campgrounds URL with current state code and park code.
        parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey+ "&stateCode=" + parkState + "&parkCode=" + parkCode;
        // Call function parkCamp.
        parkCamp(parkCampURL);

        // Update alerts URL with current state code and park code.
        parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey+ "&stateCode=" + parkState + "&parkCode=" + parkCode;
        // Call function parkAlerts.
        parkAlerts(parkAlertsURL);
    })

    // Function created to clean the favorite parks buttons.
    $(".cleanFav").on("click", function (event){
        event.preventDefault();
        // Clean local storage.
        localStorage.clear();
        // Remove the buttons for the saved favorite parks.
        $(".favParkBtn").remove();
    })
    
    // FFunction that looks for the forecast data.
    function forecast(url){
        // console.log(url);
        // AJAX call for the 5 days forecast.
        $.ajax({
            url: url,
            method: "GET"
        }).then(function(fiveDayRes){
            // console.log(fiveDayRes);

            // Variable to hold the forecast array.
            var forecastArray = fiveDayRes.list
            // Create a new h2 tag.
            var newDayH3 = $("<h2>").text("5-Day Forecast");
            // Create a new h3 tag with the current park city name.
            var newDayH2 = $("<h3>").text(parkCity);
            // Create a div with a class named card-deck to place the forecast result.
            var newCardDeck = $("<div class='card-deck'>");

            // Clean the div with id forecast-weather and append the new h2, h3, and div.
            $("#forecast-weather").empty().append(newDayH3, newDayH2, newCardDeck);

            // For loop to take the one day out of forecast array.
            for (var i=0; i < forecastArray.length; i+=8){
                // Create a new div with class card-body to place each day inside one.
                var newDivCardBody = $("<div class='card-body'>");

                // variable to hold date and format it to javaScript.
                var date = new Date (forecastArray[i].dt_txt);
                // console.log(date);
                var displayDate = $("<p id='date'>").text(date.getMonth()+1 + "-" + date.getDate() + "-" + date.getFullYear());

                // variable to hold icon name.
                var icon = forecastArray[i].weather[0].icon;
                // console.log(icon);

                // Create a new img tag, and add an attribute with the image address along with the icon name held in the forDayIcon variable.
                var imgDayIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + icon + ".png");           

                // variable to hold temperature.
                var temp = $("<p>").text("Temperature: " + forecastArray[i].main.temp + " ℉");
                // console.log(temp);

                // variable to hold wind speed.
                var windSpeed = $("<p>").text("Wind Speed: " + forecastArray[i].wind.speed + " mph");;
                // console.log(windSpeed);

                // variable to hold humidity.
                var humidity = $("<p>").text("Humidity: " + forecastArray[i].main.humidity + "%");
                // console.log(humidity);

                // Append the new tags to the div created at variable newDivCardBody.
                newDivCardBody.append(displayDate, imgDayIcon, temp, windSpeed, humidity);
                // Append the div newDivCardBody to the div created at variable newCardDeck.
                newCardDeck.append(newDivCardBody);
            }
        })
    }
})