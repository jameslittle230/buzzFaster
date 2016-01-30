chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    console.log(request.url);
    $.get(request.url).done(function(data) {
        callback(data);
    });
    console.log("Welp");
    return true;
});
