$(document).ready(function() {
    $("h2 > a").each(function(i) {
        var titleLink = this;
        var title = $(this).html().trim();
        var classification = classify(title);
        if(classification === "listicle") {
            var url = $(this).attr("href");
            $.get(url, function(data) {
                james(title, data, titleLink);
            });
        }
    });
})


function james(title, data, domElement) {
    var nextDom = $.parseHTML($.trim(data));

    var newDom = jQuery(nextDom);
    var overlayText = '';
    $('.subbuzz_name', newDom).each( function() {
        var listItem = $(this).html().trim();
        overlayText += listItem + '<br>';
    });
    overlay(domElement, overlayText);
}

function classify(headline) {
    var list = /^(The )?\d+ .*$/;
    if(list.test(headline)) {
        return "listicle";
    }
    return "other";
}

function overlay(el, body) {
    $(el).append("<div class=\"hack-overlay\">"+body+"</div>");
}

function icon() {
    var url = chrome.extension.getURL("camera.svg");
    return "<img class=\"expand-icon\" src=\""+url+"\"></img>"
}
