const notificationVendor = "EEE Notifications";
const bellSVGHTML = `<svg viewbox="-10 -10 35 35"><path class="bell--bell" d="M14 12v1H0v-1l0.73-0.58c0.77-0.77 0.81-3.55 1.19-4.42 0.77-3.77 4.08-5 4.08-5 0-0.55 0.45-1 1-1s1 0.45 1 1c0 0 3.39 1.23 4.16 5 0.38 1.88 0.42 3.66 1.19 4.42l0.66 0.58z"></path><path class="bell--bellClapper" d="M7 15.7c1.11 0 2-0.89 2-2H5c0 1.11 0.89 2 2 2z"></path></svg><span class="bell--num"></span>`;
let notificationText;
let notificationPostDate;

function startNotification() {
    $(".notification-vendor").fadeOut("slow", function() {
        $(this).html(notificationVendor).fadeIn("slow");
    });
    startNotificationContent("There is no notification currently. Oh there actually is, enjoy recess week!",  null);
}

function stopNotification() {
    stopNotificationContent();
    $(".notification-vendor").fadeOut("slow");
}

function startNotificationContent(text, date) {
    notificationText = text;
    notificationPostDate = date ? "Posted on " + date : "";
    $(".bell").fadeOut("slow", function() {
        $(this).html(bellSVGHTML).fadeIn("slow");
    });
    $(".notification-message").fadeOut("slow", function() {
        $(this).html(notificationText).fadeIn("slow");
    });
    $(".notification-title-right").fadeOut("slow", function() {
        $(this).html(notificationPostDate).fadeIn("slow");
    });
}

function stopNotificationContent() {
    $(".bell").fadeOut("slow", function() { $(this).empty(); });
    $(".notification-message").fadeOut("slow", function() { $(this).empty(); });
    $(".notification-title-right").fadeOut("slow", function() { $(this).empty(); });
}