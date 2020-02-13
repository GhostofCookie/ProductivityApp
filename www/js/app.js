/**
 * @file app.js
 * @author Tomas rigaux
 * @brief The framework 7 app logic.
 * 
 * Here is where the App is defined in terms of Framework 7. All core methods
 * are created and/or utilized here.
 */

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


/** Serializes the form time inputs into JSON data and redirects the page. */
function SubmitForm() {
    // Check that inputs are filled and valid.
    $('input[type="time"]').on('change', function (e) {
        var empty = false;
        // BUG(t.rigaux): This doesn't actually get all input elements.
        // this problem is currently handled by null value checking.
        $('input[type="time"]').each(function () {
            if ($(this).val() == '') empty = true;
        });

        if (empty)
            $('#submit').attr('href', '');
        else
            $('#submit').attr('href', '/timeline/');
    });

    // Submit form.
    $('#submit').on('click', function (e) {
        e.preventDefault();
        var data = app.form.convertToData('form[name="time"]');
        start = data["start"]; end = data["end"];
    });
}

/** This is the document ready method in shorthand. */
$(SubmitForm());

/** Allows us to use ajax in an asynchrounously loaded page. */
$(document).on('page:beforein', '.page[data-name="home"]', SubmitForm());

