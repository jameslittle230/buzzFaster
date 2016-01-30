$(document).ready(function() {
    if (/^htt.+facebook.com\/.*$/.test(document.URL)) {
        facebook();
    } else {
        buzzfeed();
    }
});

function facebook() {
    console.log("Facebook detected");
    $("a[href~=\"bzfd.it\"").hover(function() {

        var titleLink = $(this).prev();
        console.log(titleLink.html());
    });
}

function buzzfeed() {
    // Find all links in h2 tags
    $("h2 > a").hover(function() {
        hoverArticle(this);
    });
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

function hoverArticle(domElement) {
    var title = $(domElement).html().trim();
    var classification = classify(title);

    if(classification !== 'other') {
        analyzeArticle(domElement, classification)
    }
}

function analyzeArticle(domElement, classification) {
    $(domElement).append('<div class="hack-overlay">' + loaderIcon() + '</div>');
    var hackOverlay = $(domElement).find('.hack-overlay');
    var title = $(domElement).html().trim();
    var url = $(domElement).attr('href');

    $.get(url).done(function(data) {
        if (classification === "listicle") {
            analyzeListicle(title, data, domElement, hackOverlay);
        }
    });
}

function loaderIcon() {
    var url = chrome.extension.getURL("ajax-loader.gif");
    return "<img class=\"expand-icon\" src=\""+url+"\"></img>";
}

function imageIcon() {
    var url = chrome.extension.getURL("camera.svg");
    return "<img class=\"expand-icon\" src=\""+url+"\"></img>";
}


function analyzeListicle(title, data, domElement, hackOverlay) {
    $(hackOverlay).html('');
    var newDom = jQuery($.parseHTML($.trim(data)));

    $('.subbuzz_name', newDom).each( function() {
        $(hackOverlay).append('<div class="hack-list-item">');
        var listItemElement = $(hackOverlay).find('.hack-list-item:last');

        var listItem = $(this).html().trim();

        $(listItemElement).append(listItem);

            var contentNode = $(this).next("div");

            if (contentNode.html()) {
                var image = contentNode.find("img.bf_dom")[0];
                var content = "<div class=\"hack-embedded-img\">";
                content += "<div class=\"hack-embedded-img-title\">" + listItem + "</div>";

                if(image) {
                    var url = $(image).attr("rel:bf_image_src");
                    content += "<img src=\""+url+"\"></img></div>";
                } else {
                    content += contentNode.html()+"</div>";
                }

                $(listItemElement).append("&nbsp;" + imageIcon());
                $(listItemElement).append(content);
            }

        $(hackOverlay).append('</div>');
    });
}
