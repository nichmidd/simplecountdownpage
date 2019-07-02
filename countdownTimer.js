function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var seconds = Math.floor((t / 1000) % 60);
    var minutes = Math.floor((t / 1000 / 60) % 60);
    var hours = Math.floor((t / (1000 * 60 * 60)));
    return {
        'total': t,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function initialiseTable() {
    html = "<table><tr>";
    for (var i=1; i<raceEvents.length; i++) {
        html += "<td id='name"+i+"'></td>";
        html += "<td id='timeRemaining"+i+"'></td>";
        html += "</tr><tr>";
    };
    html += "</tr></table>";
    document.getElementById("upcomingEvents").innerHTML = html;
}

function initializeClock(id, endtime) {
    var clock = document.getElementById(id);
    var hoursSpan = clock.querySelector('.hours');
    var minutesSpan = clock.querySelector('.minutes');
    var secondsSpan = clock.querySelector('.seconds');

    initialiseTable();

    function updateClock() {
        // show current time
        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59
        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;
        var time = h + ":" + m + ":" + s;
        document.getElementById("currentTime").innerText = time;

        //update upcoming table
        for (var i=1; i<raceEvents.length; i++) {
            var nameElm = "name"+i;
            var timeElm = "timeRemaining"+i; 
            document.getElementById(nameElm).innerHTML = raceEvents[i].name;
            var t = getTimeRemaining(raceEvents[i].starttime);
            var hoursL = ('0' + t.hours).slice(-2);
            var minutesL = ('0' + t.minutes).slice(-2);
            var secondsL = ('0' + t.seconds).slice(-2);
            var timeL = hoursL+":"+minutesL+":"+secondsL;
            document.getElementById(timeElm).innerHTML = timeL
        }

        // calc and display remaining time
        var t = getTimeRemaining(endtime);
        document.getElementById("clockdivText").innerHTML = "<u>"+raceEvents[0].name+"</u>";
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
        if (t.total <= 0) {
            if (raceEvents.length <= 0) {
                clearInterval(timeinterval);
            }
            raceEvents.shift();
            initialiseTable();
            endtime = new Date(Date.parse(raceEvents[0].starttime));
        }
    }

    updateClock();
    var timeinterval = setInterval(updateClock, 1000);
}

var raceEvents = JSON.parse(events);
document.getElementById("header").innerHTML = title;
document.getElementById("footer").innerHTML = "<h3>"+footer+"</h3>";
var deadline = new Date(Date.parse(raceEvents[0].starttime));
initializeClock('clockdiv', deadline);