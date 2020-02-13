function FormatTimelineDate(day, month) {
    var months = ['jan','feb','mar',
                  'apr','may','jun',
                  'jul','aug','sept',
                  'ect','nov','dec'];
    return String(day) + ' <small>' + months[month].toUpperCase() + '</small>';
}

function FormatTime(time) {
    var hours = Math.trunc(time/100);
    var min = Math.round((time/100 - hours) * 100);
    return String(hours === 0 ? 12 : (hours % 13) + (hours < 13 ? 0 : 1))+ ':' + String((min < 10) ? "0" + String(min) : min) + ' ' + (hours < 12 ? 'am' : 'pm');
}


function TimeToInt(time) {
    var hoursMinutes = time.split(/[.:]/);
    var hours = parseInt(hoursMinutes[0], 10) * 100;
    var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes;
}

class TimelineTimeItem {
    constructor(c, time, date=null) {
        this.class = c;
        this.time = FormatTime(time);
        this.date = date;
    }

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

class TimelineTextItem {
    constructor(c, time, title, text=null) {
        this.class = c;
        this.time = FormatTime(time);
        this.title = title;
        this.text = text;
    }

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

class Timeline {
    constructor(start, end) {
        var today       = new Date();
        var date = FormatTimelineDate(today.getDay(), today.getMonth());

        this.start = TimeToInt(start);
        this.end   = TimeToInt(end);

        let startItem   = new TimelineTimeItem('start', this.start, date);
        let endItem     = new TimelineTimeItem('end', this.end, (end < start ? FormatTimelineDate(today.getDay()+1, today.getMonth()) : '<i class="f7-icons">zzz</i>'));

        this.timeline  = '<div class="timeline timeline-sides">';
        this.timeline += startItem.get();
        this.CalculateBreaks();
        this.timeline += endItem.get();
        this.timeline += '</div>';

        $('#timeline').html(this.timeline);
    }

    CalculateBreaks() {
        var start = this.start;
        var end = this.end;
        var diff = Math.abs(end - start);
        var frac = diff / 150;
        var last_break = 0;
        var lunch = parseInt((end + start) / 2);
        for(var i = 1; i < diff/100; i++)
        {
            last_break += Math.round((Math.max(end, start) / frac)/100) * 100;
            if (last_break > start && last_break + 15 < end && 
               (last_break < lunch || last_break > lunch + 100))
            {
                this.timeline+= this.AddTime('break', last_break, "Take a break", 'Rest your eyes, take a walk.');
                this.timeline+= this.AddTime('end-break', (Math.floor(last_break/100) * 100) + 15, "Back to work");
            }
            else if (last_break >= lunch && last_break <= lunch + 100)
            {
                this.timeline += this.AddTime('break', lunch, 'Lunch time');
                this.timeline += this.AddTime('end-break', lunch + 100, 'Return from Lunch');
            }
        }
        
    }

    AddTime(c, time, title, text=null) {
        return new TimelineTextItem(c, time, title, text).get();
    }

    CheckIfBreakTimer() {
    }
};

var start, end;
var timer;
$(document).on('page:afterin', '.page[data-name="timeline"]', function(e){
    if(start !== null && end !== null && start !== undefined && end !== undefined && start !== '' && end !== '')
    {
        let timeline = new Timeline(start, end);
        if(timer !== null) clearInterval(timer);
        setInterval(() => {
            timeline.CheckIfBreakTimer();
            var today = new Date();
            $('.title').html(String(Math.abs(Math.round((timeline.end - (today.getHours() * 100))/100)) + " hours remaining"));
        }, 10000);
    }
});
$(document).on('page:beforeout', '.page[data-name="timeline"]', function(e){
    clearInterval(timer);
});