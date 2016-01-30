$(document).ready(function() {
    if (/^htt.+facebook.com\/.*$/.test(document.URL)) {
        facebook();
    } else {
        buzzfeed();
    }
});

function facebook() {
    console.log("Facebook detected");
    $("a[href*=\"bzfd.it\"").hover(function() {
        var titleLink = $(this).parents().eq(7);
        var title = $(this).parent().parent().children().eq(1).find("a").eq(0).text();

        var classification = classify(title);
        if(classification === "listicle") {
            var url = $(this).attr("href");
            chrome.runtime.sendMessage({url: $(this).attr("href")}, function(data){
                analyzeListicle(title, data, titleLink);
            });
        }
    });
}



function buzzfeed() {
    // Find all links in h2 tags
    var numberOfLinks = $("h2 > a").length;
    // var numAnalyzedSoFar = 0;
    $("h2 > a").hover(function() {

        // Set it to a variable
        var titleLink = this;

        // Find the title
        var title = $(this).html().trim();

        // And then classify the title
        var classification = classify(title);
        if(classification === "listicle") {
            var url = $(this).attr("href");
            $.get(url).done(function(data) {
                analyzeListicle(title, data, titleLink);
            });
        }
    });
}

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
            var content = "<div class=\"hack-embedded-img\">";
            content += "<div class=\"hack-embedded-img-title\">" + listItem + "</div>";
            if(image) {
                var url = $(image).attr("rel:bf_image_src");
                content += "<img src=\""+url+"\"></img></div>";
            } else {
                content += contentNode.html()+"</div>";
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
    overlay(domElement.parent(), overlayText);
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
