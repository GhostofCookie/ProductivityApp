function FormatTimelineDate(day, month) {
    var months = ['jan','feb','mar',
                  'apr','may','jun',
                  'jul','aug','sept',
                  'ect','nov','dec'];
    return String(day) + ' <small>' + months[month].toUpperCase() + '</small>';
}


class Timeline {
    constructor(start, end) {
        var today = new Date();
        this.timeline = '<div class="timeline">'

        var date = FormatTimelineDate(today.getDay(), today.getMonth());

        var diff = this.TimeToInt(end) - this.TimeToInt(start);


        this.timeline += this.AddTime(this.TimeToInt(start), 'Start Work', date);
        var last_break = 0;
        for(var i = 1; i < diff/100; i++)
        {
            last_break += parseInt((this.TimeToInt(end) / (diff/100))/100) * 100;
            if (last_break > this.TimeToInt(start) && last_break < this.TimeToInt(end) &&
                last_break != 1200)
            {
                this.timeline+= this.AddTime(last_break);
                this.timeline+= this.AddTime(parseInt(last_break + 15), "Take a break", null, 'Rest your eyes, wake a walk.');
                this.timeline+= this.AddTime(parseInt(last_break + 36), "Back to work");
            }
            else if (last_break >= 1200 && last_break <= 1300) {
                this.timeline += this.AddTime(1200, 'Lunch');
                this.timeline += this.AddTime(1300, 'Return from Lunch');
            }
        }
        this.timeline += this.AddTime(this.TimeToInt(end), 'End Work');

        this.timeline += '</div>';
        $('#timeline').html(this.timeline);
    }

    TimeToInt(time) {
        var hoursMinutes = time.split(/[.:]/);
        var hours = parseInt(hoursMinutes[0], 10) * 100;
        var minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
        return hours + minutes;
    }

    CalculateBreaks(start, end) {
    }

    AddTime(time, task=null, date=null, subtitle=null) {
        var hours = parseInt(time/100);
        var min = parseInt((time/100 - hours) * 100);
        var formatTime = String((hours < 10) ? hours = "0" + hours : hours) + ':' + String((min < 10) ? min = "0" + min : min);
        return `<div class="timeline-item timeline-item-right">
            <div class="timeline-item-date">` + (date !== null ? date : ``) + `</div>
            <div class="timeline-item-divider"></div>
            <div class="timeline-item-content color-theme-green">` + (task === null ? 
            `<div class="timeline-item-time">` + formatTime + `</div>` :
            `<div class="timeline-item-inner">
                <div class="timeline-item-time">` + formatTime + `</div>
                <div class="timeline-item-title">` + task + `</div>` +
                (subtitle !== null ? `<div class="timeline-item-text">` + subtitle + `</div>` : ``) +
            `</div>`) + `</div></div>`;
    }

    CheckIfBreakTimer() {
        var today = Date.now();
        alert(today.getTime());
    }
};


var start, end;
$(document).on('page:afterin', '.page[data-name="timeline"]', function(e){
    let timeline = new Timeline(start, end);
    let timer = setInterval(() => timeline.CheckIfBreakTimer(), 10000);
});