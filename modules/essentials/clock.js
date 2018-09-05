function updateClock(display) {
    let date = new Date();
    let dateString = date.toDateString();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    display(dateString, hour, minute, second);
}

let handler = 0;

exports.startClocking = (display) => {
    updateClock(display);
    handler = setInterval(_ => {
        updateClock(display)
    }, 1000);
};

exports.stopClocking = (remove) => {
    clearInterval(handler);
    handler = 0;
    remove();
};