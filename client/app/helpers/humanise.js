var helpers = helpers || {};

helpers.humanise = {
    humaniseTime: function (input) {
        var d, h, m, s;
        if (input) {
            d = Number(input);
            h = Math.floor(d / 3600);
            m = Math.floor(d % 3600 / 60);
            s = Math.floor(d % 3600 % 60);
            return (h > 0 ? h + ":" : "") + (m > 0 ? (h > 0 && m < 10 ? "0" : "") + m + ":" : "00:") + (s < 10 ? "0" : "") + s;
        } else {
            return "0:00";
        }
    }
};

