var helpers = helpers || {};

helpers.humanise = {
    getExtension: function (filename) {
        var parts = filename.split('.');
        return parts[parts.length - 1];
    }
};
