const fetchTemperature = function(location) {
    const url = `https://api.weatherapi.com/v1/current.json?key=1095ded630a7496d9d643409230909&q=${location}`;
    console.log("After url");
    fetch(url)
        .then(response => {
            // if (!response.ok) {
            //     throw new Error('Network response was not ok');
            // }
            console.log("response = " + response)
            return response.json();
        })
        .then(data => { 
            const {current, location} = data;
            const {temp_c, temp_f, feelslike_c, feelslike_f, wind_kph} = current;
            const {name, region, country} = location;
            console.log("Before post history");
            console.log(location);
            postHistory(name, 10, 10, 29);
            getSearchHistoryAsync();
            if (document.getElementById("temp-unit").textContent == "Celcius") {
                if (country == "United States of America") {
                    updateInformation(name + ", " + region, `${temp_c}°C`, `${feelslike_c}°C`, 90, wind_kph); 
                } else {
                    updateInformation(name + ", " + country, `${temp_c}°C`, `${feelslike_c}°C`, 90, wind_kph); 
                }
            } else {
                if (country == "United States of America") {
                    updateInformation(name + ", " + region, `${temp_f}°F`, `${feelslike_f}°F`, 90, wind_kph);
                } else {
                    updateInformation(name + ", " + country, `${temp_f}°F`, `${feelslike_f}°F`, 90, wind_kph);
                }
            }
             
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
};

const fetchForecast = function(location) {
    const dateObject = new Date();
    const startDate = `${dateObject.getFullYear()}-${dateObject.getMonth()}-${dateObject.getDay()}`;
    const endDate = `${dateObject.getFullYear()}-${dateObject.getMonth()}-${dateObject.getDay() + 3}`;

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=967AVBAKJWAC5LWKPFPC7QFD7`;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                updateForecast("N/A", "N/A", "N/A", "N/A", "N/A", "N/A");
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const {days} = data;
            console.log(days[0].tempmax);
            updateForecast(days[0].tempmax, days[0].tempmin, days[1].tempmax, days[1].tempmin, 
                days[2].tempmax, days[2].tempmin);
        });
};

const logLocation = function(input) {
    const city = input.value;
    if (input.value == 0) {
        console.log("Empty parameter");
    } else {
        fetchTemperature(city);
        fetchForecast(city);
        updateDays();
    }
};

document.getElementById('search-button').addEventListener('click', function() {
    const input = document.getElementById('location-input');
    const information = logLocation(input);
    // fetchForecast();
    //getSearchHistory();
    //getSearchHistoryAsync();
});

const updateInformation = function(location, temperature, condition, humidity, windSpeed) {
    document.getElementById("current-location").textContent = location;
    document.getElementById("current-temp").textContent = temperature;
    document.getElementById("current-condition").textContent = condition;
    document.getElementById("current-humidity").textContent = humidity;
    document.getElementById("current-wind").textContent = windSpeed;
};

const updateForecast = function(day1_MAX, day1_MIN, day2_MAX, day2_MIN, day3_MAX, day3_MIN) {
        document.getElementById("Temp-1-MAX").textContent = day1_MAX;
        document.getElementById("Temp-2-MAX").textContent = day2_MAX;
        document.getElementById("Temp-3-MAX").textContent = day3_MAX;
        document.getElementById("Temp-1-MIN").textContent = day1_MIN;
        document.getElementById("Temp-2-MIN").textContent = day2_MIN;
        document.getElementById("Temp-3-MIN").textContent = day3_MIN;
}

const toggleUnit = function() {
    getSearchHistory();
    fetchTemperature(document.getElementById("current-location").textContent);
    if (document.getElementById("temp-unit").textContent == "Celcius") {
        document.getElementById("temp-unit").textContent = "Fahrenheit";
    } else {
        document.getElementById("temp-unit").textContent = "Celcius";
    }
};

document.getElementById("temp-unit").addEventListener('click', function() {
    toggleUnit();
});

const updateDays = function() {
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const nextDay = days[(date.getDay() + 1) % 6];
    const twoDays = days[(date.getDay() + 2) % 6];
    const threeDays = days[(date.getDay() + 3) % 6];
    document.getElementById("DayAfter1").textContent = nextDay;
    document.getElementById("DayAfter2").textContent = twoDays;
    document.getElementById("DayAfter3").textContent = threeDays;
}

// //Runs the updateDays function as soon as the webpage loads
// (function() {
//     updateDays();
// });

/*
const getSearchHistory = function() {
    console.log("inside the fetch");
    fetch("http://127.0.0.1:8080/WeatherWeb/weatherHistory")
        .then(response => {
            if (!response.ok()) {
                throw new Error("Error in API Fetch");
            }
            return response.text();
        }) 
        .then(data => {
            console.log(data);
        })
}
*/


async function getSearchHistoryAsync() {
    console.log("inside the fetch");
    const response = await fetch("http://127.0.0.1:8080/WeatherWeb/weatherHistory");
    const data = await response.text();
    console.log(data);
    document.getElementById("JSON-String").textContent = data;
}

// const units = document.getElementById("temp-unit").textContent;
// const temp_f = units == "Fahrenheit" ? document.getElementById("current-temp").textContent : (Number)(document.getElementById("current-temp").textContent) * 9 / 5 + 32;
// const temp_c = units == "Fahrenheit" ? (temp_f - 32) * 5 / 9 : document.getElementById("current-temp");
// const condition = document.getElementById("current-condition").textContent;
// const humidity = document.getElementById("current-humidity").textContent;
// const windSpeed = document.getElementById("current-wind").textContent;
// const location = document.getElementById("current-location").textContent;


async function postHistory(l, c, f, w) {

    // const formData = new URLSearchParams();
    // formData.append('temp_c', c);
    // formData.append('temp_f', f);
    // formData.append('location', l);
    // formData.append('windSpeed', w);
    query_string = "location=" + l + "&";
    query_string = query_string + "temp_c=" + c + "&"
    query_string = query_string + "temp_f=" + f + "&"
    query_string = query_string + "windSpeed=" + w 



    // const postWeather = await fetch("http://127.0.0.1:8080/WeatherWeb/weatherHistory", {
    const postWeather = await fetch("http://127.0.0.1:8080/WeatherWeb/weatherHistory?" + query_string, {

        method: 'POST'
        // body: formData,
        // headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }
        // body: JSON.stringify({
        //     location: l,
        //     temp_c: c,
        //     temp_f: f,
        //     windSpeed: w
        // }
        // ) 
    })
};



//postWeather();