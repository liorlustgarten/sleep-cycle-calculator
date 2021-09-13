let scheduleDiv = document.getElementById('schedule-text')
let scheduleButton = document.getElementById('get-schedule')
let scheduleTextID = 'sleep_schedule_id'

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
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
            let sleepStart = formatDate(dateTime)
            dateTime.addHours(sleepHours)
            let sleepEnd = formatDate(dateTime)
            htmlString += `<div class="sleep-title"> Sleep ` + i + `</div>` + 
            `<div class="sleep-start"> Fall asleep at `+ sleepStart + `</div>` +
            `<div class="sleep-end"> Wake up at ` + sleepEnd + `</div>`
            dateTime.addHours(awakeHours)
        }
        scheduleDiv.innerHTML = htmlString

        window.localStorage.setItem(scheduleTextID, htmlString);
    }
})

document.addEventListener('DOMContentLoaded', function() {
    scheduleDiv.innerHTML = window.localStorage.getItem(scheduleTextID);
}, false);