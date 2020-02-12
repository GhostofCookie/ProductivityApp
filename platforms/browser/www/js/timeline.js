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
        this.timeline = '<div class="timeline timeline-sides">'

        var date = FormatTimelineDate(today.getDay(), today.getMonth());

        this.timeline += this.AddTime('9:00 am', 'Start Work', date);
        this.timeline += this.AddTime('10:15 am', 'Take a Break')

        this.timeline += '</div>';
        $('#timeline').html(this.timeline);
    }

    CalculateBreaks(start, end) {
    }

    AddTime(time, task=null, date=null) {
        return `<div class="timeline-item timeline-item-right">
            <div class="timeline-item-date">` + (date !== null ? date : ``) + `</div>
            <div class="timeline-item-divider"></div>
            <div class="timeline-item-content">` + (task === null ? 
            `<div class="timeline-item-time">` + time + `</div>` :
            `<div class="timeline-item-inner">
                <div class="timeline-item-time">` + time + `</div>
                <div class="timeline-item-title">` + task + `</div>
            </div>`) + `</div></div>`;
    }

    CheckIfBreakTimer() {

    }
};

$(document).on('page:init', '.page[data-name="timeline"]', function(e){
    let timeline = new Timeline();
    let timer = setInterval(() => timeline.CheckIfBreakTimer(), 10000);
});