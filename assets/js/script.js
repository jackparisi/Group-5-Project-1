// Document ready function to ensure functions just run after everything is loaded in the document.
$(document).ready(function(){

    // Created global variables for the API keys that will be used in different AJAX calls.
    var APIWeatherKey = "b37332257de420fc6dfcda2bbba28fbd";
    var APIParkKey = "IeMPkZS36TxiVcv1TUIT5yzANx6szGLJE5BsDsZA";

    // Created global variable to store user state input.
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

    // Array to store saved favorite parks
    var favParkArray = [];
    console.log(favParkArray);

    

    // Event listner to the state options drop down menu
    $("#stateCode").on("change", function(){
        var state = $(this).val();
        console.log(state);
        inputStateCode = state;
        getParks(state);
    })

    initial();
    
    // Function initial sets the original set for the start of the page.
    function initial(){
        // variable created to get items storage in the local storade and update favParkArray.
        var storedFav = JSON.parse(localStorage.getItem("favParkArray"));

        if (storedFav !== null){
            favParkArray = storedFav;
        }

        
    }
    
    // Function created to favorite parks.
    function storeParks(){
        localStorage.setItem("favParkArray", JSON.stringify(favParkArray));
    }

    function getParks(state){
    // park API URL query by state code.
    var parkURL = "https://developer.nps.gov/api/v1/parks?api_key=" + APIParkKey + "&stateCode=" + state;
    // AJAX call for parks
    $.ajax({
        url: parkURL,
        method: "GET"
    }).then(function(parkRes){
        console.log(parkRes);
        
        $(".statePark").remove();

        var stateParkDiv = $("<div class='statePark'>");

        $("#left").append(stateParkDiv);
                
        parkRes.data.forEach(function(data){
          
            // Create a button with the name of each park returned in the response, and add class parkBtn.
            var newParkBtn = $("<button class='parkBtn'>").text(data.name);

            // Add a data-name attribute with each park name.
            newParkBtn.attr("data-name", data.parkCode);

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

            // Append the new div to the div with id middle. 
            $("#middle").append(newAlertDiv);

            // In case the API return without any information for that park, then display a message.
            if (alertRes.data.length === 0){
                var newAlertP1 = $("<p>").text("There is no alert message for this park.");
                newAlertDiv.append(newAlertP1);
            }
            else {

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

            // Append the new div to the div with id middle. 
            $("#middle").append(newCampDiv);

            // In case the API return without any information for that park, then display a message.
            if (campRes.data.length === 0){
                var newCampP1 = $("<p>").text("There is no campground information for this park.");
                newCampDiv.append(newCampP1);
            }
            else{
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

    function thingsTodo(){
    // AJAX call for park to do
        $.ajax({
            url: parkThingsToDoURL,
            method: "GET"
        }).then(function(toDoRes){
            console.log(toDoRes);
            var activities = toDoRes.data;
            var toDoDiv = $("<div class='toDo'>");
            var actHead = $("<h3>").text("Park Activites");
            toDoDiv.append(actHead);
            $("#middle").append(toDoDiv);

            if (toDoRes.data.length === 0){
                var toDoP = $("<p>").text("There is no activity listed for this park.")
                toDoDiv.append(toDoP);
            }
            else{
                var actList = $("<ul class='list'>");            
                toDoDiv.append(actList);
                for(var i=0; i < activities.length; i++){
                    console.log(activities[i].activities[0].name + activities[i].title);
                    var listItem = $("<li>").text(activities[i].activities[0].name + " - " + activities[i].title);
                    actList.append(listItem);
                }
            }
        })
    }

    $(document).on("click", ".favBtn", function(event){
        event.preventDefault();
         
        // var favoritesBtn = $("<button class='favParkBtn'>").text(parkName).attr("data-name", parkCode).attr("value", parkCity);

        // $(".favParkList").append(favoritesBtn);
        // favParkArray[0].text.push(parkName);
        // favParkArray[0].dataName.push(parkCode);
        // favParkArray[0].value.push(parkCity);

        var newFavorite = {
            text: parkName,
            dataName: parkCode,
            value: parkCity,
        };

        var notFound = true

        favParkArray.forEach(function(fav){
            if(fav.text === newFavorite.text){
            notFound = false}
        })
        
        if(notFound){
         favParkArray.push(newFavorite);
        }
        console.log(favParkArray);
        
        storeParks();
        
       var newFavDiv = $("<div class='favButtons'>");
        $(".favParkList").find(".favButtons").remove();
        
        favParkArray.forEach(function(favLoop){

            var favoritesBtn = $("<button class='favParkBtn'>").text(favLoop.text).attr("data-name", favLoop.dataName).attr("value", favLoop.value);
            

            newFavDiv.append(favoritesBtn);
        })

        $(".favParkList").append(newFavDiv);
    })

    // Event listener for the button created inside the parkRes.data.forEach loop.
    $(document).on("click", ".parkBtn", function (event){
        event.preventDefault();
        $("#middle").empty();

        // Updates parkCode accordingly with the button clicked.
        parkCode = $(this).attr("data-name");
        console.log(parkCode);
        parkCity = $(this).val();
        console.log(parkCity);
        parkName = $(this).text();
               
        var parkNameH3 = $("<h3>").text(parkName + " National Park");
        
        $("header").empty().append(parkNameH3);

        var favBtn = $("<button class='favBtn'>").text("Save this park as Favorite");
        $("#middle").append(favBtn);

       

        fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial" + "&appid=" + APIWeatherKey + "&q=" + parkCity;
        forecast();

        parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        thingsTodo();

        parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        parkCamp();

        parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        parkAlerts();
    })

    // Event listener for the favorite parks button.
    $(document).on("click", ".favParkBtn", function (event){
        event.preventDefault();
        $("#middle").empty();

        // Updates parkCode accordingly with the button clicked.
        parkCode = $(this).attr("data-name");
        console.log(parkCode);
        parkCity = $(this).val();
        console.log(parkCity);
        parkName = $(this).text();
               
        var parkNameH3 = $("<h3>").text(parkName + " National Park");
        
        $("header").empty().append(parkNameH3);

        fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial" + "&appid=" + APIWeatherKey + "&q=" + parkCity;
        forecast();

        parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        thingsTodo();

        parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        parkCamp();

        parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        parkAlerts();
    })

    // Function created to clean the favorite parks buttons.
    $(".cleanFav").on("click", function (event){
        event.preventDefault();

        localStorage.clear();
        favParkArray = [{text:[], dataName:[], value:[]}];
        $(".favParkBtn").remove();
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

            var newDayH3 = $("<h2>").text("5-Day Forecast");

            var newDayH2 = $("<h3>").text(parkCity);

            var newCardDeck = $("<div class='card-deck'>");

            $("#forecast-weather").empty().append(newDayH3, newDayH2, newCardDeck);

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
                var minTemp = $("<p>").text("Minimum Temperature: " + forecastArray[i].main.temp_min + " ℉");
                // console.log(minTemp);

                // variable to hold max temperature
                var maxTemp = $("<p>").text("Maximum Temperature: " + forecastArray[i].main.temp_max + " ℉");;
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