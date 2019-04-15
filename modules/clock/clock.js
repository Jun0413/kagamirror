let clockhandler = 0; // interval handler for datetime
const months = [
    "January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October",
    "November", "December"
];

const clockHTML = 
`<div class="date"></div>
<div class="clocktime">
<div class="clock">
  <div class="clock__second"></div>
  <div class="clock__minute"></div>
    <div class="clock__hour"></div>
  <div class="clock__axis"></div>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
    <section class="clock__indicator"></section>
</div>
<div class="digitime"></div>
</div>`;

function startClocking(containerElement) {
    console.log("[execute] startClocking()");
    // add HTML + CSS
    $("head").append('<link rel="stylesheet" href="../modules/clock/clock.css" id="style-clock">');
    containerElement.innerHTML = clockHTML;

    // start clock panel
    var currentSec = getSecondsToday();
    var seconds = (currentSec / 60) % 1;
    var minutes = (currentSec / 3600) % 1;
    var hours = (currentSec / 43200) % 1;  
    setTime(60 * seconds, "second");
    setTime(3600 * minutes, "minute");
    setTime(43200 * hours, "hour");

    // display and update date time
    updateDate();
    updateTime();
    clockhandler = setInterval(updateTime, 1000);
}

/**
 * Run the clock panel
 */
function setTime(left, hand) {
    $(".clock__" + hand).css("animation-delay", "" + left * -1 + "s");
}
function getSecondsToday() {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let diff = now - today; 
    return Math.round(diff / 1000);
}

function updateTime() {
    let date = new Date();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (hour == 0)
    {
        updateDate();
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    $(".digitime").html(`${hour}:${minute}`); 
}

function updateDate() {
    let date = new Date();
    let dateString = date.toDateString();
    let tmp = dateString.split(" ");
    tmp[1] = months[date.getMonth()];
    dateString = tmp.join(" ");
    $(".date").html(`${dateString}`);
}

function stopClocking() {
    clearInterval(clockhandler);
    clockhandler = 0;
    $("head").find("link#style-clock").remove();
}
