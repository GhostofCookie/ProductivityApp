let app = new Framework7({
    root: '#app',
    name: 'Framework7',
    routes: [
        {
            path: '/',
            url: 'index.html'
        },
        {
            path: '/timeline/',
            url: 'timeline.html',
            keepAlive: false
        }
    ]
});

let mainView = app.views.create('.view-main');


function SubmitForm() {
    $('input[type="time"]').on('change', function(e) {
        var empty = false;
        $('form[name="time"] > div > div > div > input[type="time"]').each(function() {
            if ($(this).val() == '') {
                empty = true;
            }
        });
        
        if (empty)
            $('#submit').attr('href', '');
        else
            $('#submit').attr('href', '/timeline/');
    });
    $('#submit').on('click', function(e) {
        e.preventDefault();
        var data = app.form.convertToData('form[name="time"]');
        start = data["start"]; end = data["end"];
    });
}

$(function() {
    SubmitForm();
});

$(document).on('page:beforein', '.page[data-name="home"]', function(e) {
    SubmitForm();
});

