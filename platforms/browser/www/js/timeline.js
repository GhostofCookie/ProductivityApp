/**
 * @file timeline.js
 * @author Tomas Rigaux
 * @date 11/02/2020
 * 
 * This file contains all the objects and methods relavent to creating
 * timelines programmatically.
 */

/** Format the date into a shorthand form for a timeline.
 * 
 * @param {in} time The time to format.
 */
function FormatTimelineDate(day, month) {
    var months = ['jan', 'feb', 'mar',
        'apr', 'may', 'jun',
        'jul', 'aug', 'sept',
        'ect', 'nov', 'dec'];
    return String(day) + ' <small>' + months[month].toUpperCase() + '</small>';
}

/** Formats integer time into readable string in 12 Hour fomrat.
 * 
 * @param {in} time The time to format.
 */
function FormatTime(time) {
    var hours = Math.trunc(time / 100);
    var min = Math.round((time / 100 - hours) * 100);
    return String(hours === 0 ? 12 : (hours % 13) + (hours < 13 ? 0 : 1)) + ':'
        + String((min < 10) ? "0" + String(min) : min) + ' '
        + (hours < 12 ? 'am' : 'pm');
}

/** Convert time to Integer
 * 
 * @param {in} time The time to convert.
*/
function TimeToInt(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10) * 100;
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes;
}

/**
 * @class TimelineTimeItem
 * @brief Defines a time entry in a timeline.
 */
class TimelineTimeItem {
    /** Constructor for the timeline. It initializes member variables. 
     * 
     * @param {in} c The class of the time item
     * @param {in} time The time to be displayed
     * @param {in} date The date of the time.
     */
    constructor(c, time, date = null) {
        this.class = c;
        this.time = FormatTime(time);
        this.date = date;
    }

    /** Get the time entry has a string HTML object. */
    get() {
        return `<div class="timeline-item ` + (this.class === 'end' ? 'timeline-item-right' : ``) + `">
            <div class="timeline-item-date">` + (this.date !== null ? this.date : ``) + `</div>
                <div class="timeline-item-divider"></div>
                <div class="timeline-item-content">
                    <div class="timeline-item-time ` + this.class + `">` + this.time + `</div>
                </div>
            </div>`;
    }
};

/**
 * @class TimelineTextItem
 * @brief Defines a time entry with a text card in a timeline.
 */
class TimelineTextItem {
    /** Constructor for the time card.
     * 
     * @param {in} c The class of the entry.
     * @param {in} time The time to display.
     * @param {in} title The title of the card.
     * @param {in} text The text of the card.
     */
    constructor(c, time, title, text = null) {
        this.class = c;
        this.time = FormatTime(time);
        this.title = title;
        this.text = text;
    }

    /** Get the time card entry as a string HTML object. */
    get() {
        return `<div class="timeline-item">
            <div class="timeline-item-date"></div>
            <div class="timeline-item-divider"></div>
            <div class="timeline-item-content">
            <div class="timeline-item-inner">
                <div class="timeline-item-time ` + this.class + `">` + this.time + `</div>
                <div class="timeline-item-title"><strong>` + this.title + `</strong></div>` +
            (this.text !== null ?
                `<div class="timeline-item-text">` + this.text + `</div>` : ``) +
            `</div></div></div>`;
    }
};

/** 
 * @class Timeline
 * @brief Defines a timeline object with appropriate break times indicated.
 * 
 * Defines a timeline object given a start and end time to a work day. if the
 * work day extends outside the current day (i.e. nightshift, late study hours,
 * etc.), then the timeline wraps around to the following day.
 */
class Timeline {
    /** Contructor for the class.
     * 
     * @param {in} start The start time of the work day
     * @param {in} end The end time of the work day
     */
    constructor(start, end) {
        var today = new Date();
        var date = FormatTimelineDate(today.getDay(), today.getMonth());

        this.start = TimeToInt(start);
        this.end = TimeToInt(end);

        let startItem = new TimelineTimeItem('start', this.start, date);
        let endItem = new TimelineTimeItem('end', this.end, (end < start ? FormatTimelineDate(today.getDay() + 1, today.getMonth()) : '<i class="f7-icons">zzz</i>'));

        this.timeline = '<div class="timeline timeline-sides">';
        this.timeline += startItem.get();
        this.CalculateBreaks();
        this.timeline += endItem.get();
        this.timeline += '</div>';

        $('#timeline').html(this.timeline);
    }

    /** Get the remaining hours in the work day.
     * 
     * @returns The total hours remaining in the work day.
     */
    GetRemainingHours() {
        let today = new Date();
        return Math.abs(Math.round((this.end - (today.getHours() * 100)) / 100));
    }

    /** Calculates all of the breaks in the day and addds them to the timeline. */
    CalculateBreaks() {
        let diff = Math.abs(this.end - this.start);
        let frac = diff / 150;

        let last_break = 0;
        let food_break = Math.trunc((this.end + this.start) / 2);
        let breaks = [];
        this.breaks = [];
        for (var i = 1; i < diff / 100; i++) {
            last_break += Math.round((Math.max(this.end, this.start) / frac) / 100) * 100;
            if (last_break > this.start && last_break + 15 < this.end &&
                (last_break < food_break || last_break > food_break + 100)) {
                breaks.push(
                    new TimelineTextItem('break', last_break,
                        'Take a break',
                        'Rest your eyes, take a walk.'));
                breaks.push(
                    new TimelineTextItem('end-break',
                        (Math.floor(last_break / 100) * 100) + 15,
                        "Back to work"));
                
                this.breaks.push(last_break);
                this.breaks.push((Math.floor(last_break / 100) * 100) + 15);
            }
        }

        if (breaks.length >= 4) {
            breaks.splice(Math.floor(breaks.length / 2), 0,
                new TimelineTextItem('break', food_break,
                    'Food Time',
                    'Go eat something'));
            breaks.splice(Math.floor(breaks.length / 2) + 1, 0,
                new TimelineTextItem('end-break', food_break + 100,
                    'Return from eating'));
            this.breaks.splice(Math.floor(breaks.length / 2), 0, food_break);
            this.breaks.splice(Math.floor(breaks.length / 2) + 1, 0, food_break + 100);
        }

        let self = this;
        breaks.forEach(function (item) {
            self.timeline += item.get();
        });
    }

    /** Checks to see if the current time ios a break time. 
     * 
     * @returns True if it is a break, false otherwise.
     */
    CheckIfBreak() {
        let today = new Date();
        let curr_time = today.getHours() * 100 + today.getMinutes();
        this.breaks.forEach(function(item) {
            if (item - curr_time == 0)
                return true;
        });
        return false;
    }
};


var start, end;
var timer;

/** Initialize the timeline on page entry */
$(document).on('page:afterin', '.page[data-name="timeline"]', function (e) {
    if (start !== null && end !== null &&
        start !== undefined && end !== undefined &&
        start !== '' && end !== '') {
        let timeline = new Timeline(start, end);
        $('.title').html(String(timeline.GetRemainingHours()) + " hours remaining");

        /** Start/Restart the timer */
        if (timer !== null || timer !== undefined) clearInterval(timer);
        setInterval(() => {
            if (timeline.CheckIfBreak())
                alert("Take a break!");

            $('.title').html(String(timeline.GetRemainingHours()) + " hours remaining");
        }, 10000);
    }
});

/** Clear the timer on the way out. */
$(document).on('page:beforeout', '.page[data-name="timeline"]', function (e) {
    clearInterval(timer);
});