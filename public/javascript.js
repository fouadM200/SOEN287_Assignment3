function time() {
    let calendar = new Date();
    let day = calendar.getDay();
    let month = calendar.getMonth();
    let date = calendar.getDate();
    let year = calendar.getFullYear();
    let hour = String(calendar.getHours());
    let ampm = hour >= 12 ? 'p.m.' : 'a.m.';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    let minute = String(calendar.getMinutes()).padStart(2, "0");
    let second = String(calendar.getSeconds()).padStart(2, "0");
    let fullcalendar = "";

    switch(day) {
        case 0:
            day = "Sunday";
            break;
        case 1:
            day = "Monday";
            break;
        case 2:
            day = "Tuesday";
            break;
        case 3:
            day = "Wednesday";
            break;
        case 4:
            day = "Thursday";
            break;
        case 5:
            day = "Friday";
            break;
        case 6:
            day = "Saturday";
            break;
    }

    switch(month) {
        case 0:
            month = "January";
            break;
        case 1:
            month = "February";
            break;
        case 2:
            month = "March";
            break;
        case 3:
            month = "April";
            break;
        case 4:
            month = "May";
            break;
        case 5:
            month = "June";
            break;
        case 6:
            month = "July";
            break;
        case 7:
            month = "August";
            break;
        case 8:
            month = "September";
            break;
        case 9:
            month = "October";
            break;
        case 10:
            month = "November";
            break;
        case 11:
            month = "December";
            break;
    }

    fullcalendar = "<b>Current date and time:</b><br>" + day + ", " + month + " " + date + ", " + year + "<br>" + 
                String(hour).padStart(2, "0") + ":" + minute+ ":" + second + " " + ampm;

    document.getElementById("time").innerHTML = fullcalendar;
}

window.onload = function() {
    time();
    setInterval(time, 1000); // Upcalendar time every second
}