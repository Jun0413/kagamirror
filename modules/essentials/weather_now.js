let handler = 0;
const url = "http://api.openweathermap.org/data/2.5/weather?id=1880251&APPID=875ddb05b8b2d307c74f84117d523f3e";

function updateWeather(display) {
    let weatherRequest = new XMLHttpRequest();
    weatherRequest.open("GET", url, true);
    weatherRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                let response = JSON.parse(this.response);
                let weather = response.weather[0].main;
                let temp = response.main.temp;
                display(weather, temp);
                console.log("weather is updated");
            } else {
                console.log("could not load weather");
            }
        }
    };
    weatherRequest.send();
}

exports.displayWeatherNow = (display) => {

    updateWeather(display);
    handler = setInterval(_ => {
        updateWeather(display);
    }, 3 * 60 * 60 * 1000);

};

exports.stopWeatherNow = (remove) => {
    clearInterval(handler);
    handler = 0;
    remove();
};