'use strict';
var utils = {
    getWindowWidth: function () {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    },
    showToast: function(title, text, image){
        $.gritter.add({
            title: title,
            text: text,
            image: image,
            sticky: false
        });
    }
};
