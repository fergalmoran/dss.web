'use strict';
var utils = {
    getWindowWidth: function () {
        return window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;
    },
    showToast: function(title, text, image){
        $.gritter.add({
            title: title,
            text: text,
            image: image,
            sticky: false
        });
    },
    gritterNotification: function () {
        // display marketing alert only once
        if($('#wrapper').css('opacity')) {
            if (!$.cookie('intro')) {
                // Gritter notification intro 1
                setTimeout(function () {
                    var unique_id = $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'Welcome to Blankon',
                        // (string | mandatory) the text inside the notification
                        text: 'Blankon is a theme fullpack admin template powered by Twitter bootstrap 3 front-end framework.',
                        // (string | optional) the image to display on the left
                        image: BlankonApp.handleBaseURL()+'/assets/global/img/icon/64/contact.png',
                        // (bool | optional) if you want it to fade out on its own or just sit there
                        sticky: false,
                        // (int | optional) the time you want it to be alive for before fading out
                        time: ''
                    });
                    // You can have it return a unique id, this can be used to manually remove it later using
                    setTimeout(function () {
                        $.gritter.remove(unique_id, {
                            fade: true,
                            speed: 'slow'
                        });
                    }, 12000);
                }, 5000);
                // Gritter notification intro 2
                setTimeout(function () {
                    $.gritter.add({
                        // (string | mandatory) the heading of the notification
                        title: 'Playing sounds',
                        // (string | mandatory) the text inside the notification
                        text: 'Blankon made for playing small sounds, will help you with this task. Please make your sound system is active',
                        // (string | optional) the image to display on the left
                        image: BlankonApp.handleBaseURL()+'/assets/global/img/icon/64/sound.png',
                        // (bool | optional) if you want it to fade out on its own or just sit there
                        sticky: true,
                        // (int | optional) the time you want it to be alive for before fading out
                        time: ''
                    });
                }, 8000);
            }
        }
    }
};
