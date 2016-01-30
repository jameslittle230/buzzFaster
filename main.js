$(document).ready(function() {
    // Find all links in h2 tags
    $("h2 > a").each(function(i) {

        // Set it to a variable
        var titleLink = this;

        // Find the title
        var title = $(this).html().trim();

        // And then classify the title
        var classification = classify(title);
        if(classification === "listicle") {
            var url = $(this).attr("href");
            $.get(url, function(data) {
                analyzeListicle(title, data, titleLink);
            });
        }
    });
})


function analyzeListicle(title, data, domElement) {
    // JQuery can turn strings into a DOM, so we do that
    // with the article's HTML
    var nextDom = $.parseHTML($.trim(data));
    var newDom = jQuery(nextDom);

    // overlayText is a variable that contains the HTML
    // content for the entire hover box that appears
    var overlayText = '';

    // For each list item text in the listicle
    $('.subbuzz_name', newDom).each( function() {

        // listItem is the inner HTML of the list item
        var listItem = $(this).html().trim();

        // Add a wrapper div and the list item text to overlayText
        overlayText += '<div class="hack-list-item">' + listItem;

        // Check if it's an image post
        var lastChar = listItem[listItem.length-1];
        if (lastChar === ':') {
            var contentNode = $(this).next("div");
            var image = contentNode.find("img.bf_dom")[0];
            var content = "";
            if(image) {
                var url = $(image).attr("rel:bf_image_src");
                content = "<div class=\"hack-embedded-img\"><img src=\""+url+"\"></img></div>";
            } else {
                content = "<div class=\"hack-embedded-img\">"+contentNode.html()+"</div>";
            }
            //console.log(imgNode.html());

            // Add a space and the little image icon
            overlayText += "&nbsp;" + icon();

            // Find the image associated with the list item
            // and add it to overlayText
            overlayText += content;
        }

        overlayText += '<br></div>';
    });
    overlay(domElement, overlayText);
}

// Determine what kind of article it is, based on headline
// text analysis
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
