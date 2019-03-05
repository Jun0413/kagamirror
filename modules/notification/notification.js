const notificationVendor = "EEE Notifications";
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
    $(".notification-message").fadeOut("slow", function() {
        $(this).html(notificationText).fadeIn("slow");
    });
    $(".notification-title-right").fadeOut("slow", function() {
        $(this).html(notificationPostDate).fadeIn("slow");
    });
}

function stopNotificationContent() {
    $(".notification-message").fadeOut("slow");
    $(".notification-title-right").fadeOut("slow");
}