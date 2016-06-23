var helpers = helpers || {};
function _getLink(url){
    return window.location.protocol + "//" + (window.location.host + '/' + url).replace(/([^:]\/)\/+/g, '$1');
}

if (FB) {
    FB.init({
        appId: '154504534677009',
        status: true,
        cookie: true,
        xfbml: true,
        version: 'v2.3'
    });
}
helpers.social = {
    postToFacebook: function (title, image, description, url) {
        FB.getLoginStatus(function (oResponse) {
            if (oResponse.status === "connected") {
                return FB.ui({
                    method: "feed",
                    name: "Check out this mix on Deep South Sounds",
                    display: "iframe",
                    link: _getLink(url),
                    picture: _getLink(image),
                    caption: title,
                    description: description
                }, function (response) {
                    if (response && response.post_id) {
                        return utils.showAlert("Success", "Post shared to facebook");
                    }
                });
            } else {
                return utils.showError("Error", "Failure sharing post");
            }
        });
    },
    postToTwitter: function(mix){
        var url = "http://" + window.location.host + "/mixes/" + mix.slug;
        var text = mix.title;
        window.open("http://twitter.com/share?url=#{url}&amp;text={#text}", "twitterwindow", "height=450, width=550, top=" +
            ($(window).height() / 2 - 225) + ", left=" + $(window).width() / 2 + ", toolbar=0, location=0, menubar=0, directories=0, scrollbars=0");
    }
};

