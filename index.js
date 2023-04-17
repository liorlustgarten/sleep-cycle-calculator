let scheduleDiv = document.getElementById('schedule-text')
let scheduleButton = document.getElementById('get-schedule')
let scheduleTextID = 'sleep_schedule_id'
let hoursAsleepID = 'hours_asleep_id'
let hoursAwakeID = 'hours_awake_id'

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

function isDateRangeConflict(range1Start, range1End, range2Start, range2End){
    if (range1Start < range2End && range2Start < range1End) {
        return true
    }
    return false
}

function getNextLawnmowing(startTime){
    var dateTime = new Date(startTime.valueOf())

    var hours = dateTime.getHours();
    var mins = dateTime.getMinutes();
    var day = dateTime.getDay();
    var secs = dateTime.getSeconds();

    //temporarily hardcoding to monday 8am to 10am
    var monday = 1;
    var lawnmowingStartHour = 8;
    var lawnmowingEndHour = 10;
    if(day == monday){
        if(hours >= lawnmowingEndHour)
            dateTime.addHours(24)
    }

    var daysTillMonday = (monday - dateTime.getDay() + 7)%7;
    var hoursTilMow = daysTillMonday * 24 - hours - (mins / 60) - (secs / 60 /60)

    dateTime.addHours(lawnmowingStartHour + hoursTilMow)

    return dateTime
}

function isLawnmowerDuringSleep(sleepStart, sleepEnd){
    lawnmowerStart = getNextLawnmowing(sleepStart)
    lawnmowerEnd = new Date(lawnmowerStart.valueOf())
    lawnmowerEnd.addHours(2)
    return isDateRangeConflict(sleepStart, sleepEnd, lawnmowerStart, lawnmowerEnd)
}

function formatDate(date){
    const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true }
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleString('en-US', timeOptions) + " " + date.toLocaleDateString('en-US', dateOptions);
}

scheduleButton.addEventListener("click", evt => {
    let untilSleepInput = document.getElementById('until-sleep').value
    let sleepHoursInput = document.getElementById('hours-asleep').value
    let awakeHoursInput = document.getElementById('hours-awake').value
    if (isNaN(untilSleepInput) || isNaN(sleepHoursInput) || isNaN(awakeHoursInput)){
        scheduleDiv.innerHTML = `Make sure all inputs are numbers!`
    }
    else{
        let untilSleep = Number(untilSleepInput)
        let sleepHours = Number(sleepHoursInput)
        let awakeHours = Number(awakeHoursInput)
        var dateTime = new Date();
        htmlString = `<div class="current-time">It is currently ` + formatDate(dateTime) + `</div>`
        dateTime.addHours(untilSleep)
        for (let i = 1; i < 10; i++) {
            let sleepStart = new Date(dateTime.valueOf())
            dateTime.addHours(sleepHours)
            let sleepEnd = new Date(dateTime.valueOf())
            lawnmowingDateTime = getNextLawnmowing(sleepStart)
            htmlString += `<div class="sleep-title"> Sleep ` + i + `</div>` + 
            `<div class="sleep-start"> Fall asleep at `+ formatDate(sleepStart) + `</div>` +
            `<div class="sleep-end"> Wake up at ` + formatDate(sleepEnd) + `</div>`
            if(isLawnmowerDuringSleep(sleepStart, sleepEnd)){
                htmlString += `<div class="lawnmower-warning"> EARPLUG WARNING! This sleep may conflict with lawnmowing at `+formatDate(lawnmowingDateTime)+`</div>`
            }
            dateTime.addHours(awakeHours)
        }
        scheduleDiv.innerHTML = htmlString

        window.localStorage.setItem(scheduleTextID, htmlString)
        window.localStorage.setItem(hoursAsleepID, sleepHoursInput)
        window.localStorage.setItem(hoursAwakeID, awakeHoursInput)
    }
})

document.addEventListener('DOMContentLoaded', function() {
    scheduleDiv.innerHTML = window.localStorage.getItem(scheduleTextID)
    document.getElementById('hours-asleep').value = window.localStorage.getItem(hoursAsleepID)
    document.getElementById('hours-awake').value = window.localStorage.getItem(hoursAwakeID)
}, false);