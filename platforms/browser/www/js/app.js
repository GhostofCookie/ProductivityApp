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
            url: 'timeline.html'
        }
    ]
});

let mainView = app.views.create('.view-main');

$(function() {
});



//$('#submit').on('click', $('.form-ajax-submit').submit());
/*$('.form-ajax-submit').on('submit', function(e){
    $.ajax({
        type: "post",
        url: "/timeline/",
        data: $(this).serialize(),
        success: function(data) {
            alert('Submitted!');
        }
    });
});*/