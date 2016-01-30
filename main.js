$(document).ready(function() {
    go();
});

function go() {
    if (/^htt.+facebook.com\/.*$/.test(document.URL)) {
        facebook();
    } else {
        buzzfeed();
    }
}

function facebook() {
    console.log("Facebook detected");
    $("a[href*=\"bzfd.it\"").hover(function() {
        var titleLink = $(this).parents().eq(7);
        var title = $(this).parent().parent().children().eq(1).find("a").eq(0).text();

        var classification = classify(title);
        if(classification === "listicle") {
            if ($(titleLink).find('.hack-overlay').length > 0) {
                return;
            }

            $(titleLink).append('<div class="hack-overlay">' + loaderIcon() + '</div>');

            var url = $(this).attr("href");
            chrome.runtime.sendMessage({url: $(this).attr("href")}, function(data){
                var hackOverlay = $(titleLink).find('.hack-overlay');
                analyzeListicle(title, data, titleLink, hackOverlay);
            });
        }
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
function classify(title, domElement) {
    var list = /^(The )?\d+ .*$/;
    if(list.test(title)) {
        return "listicle";
    }

    // console.log($(domElement).parent().parent().parent().siblings().get()[0]);
    var grandparentSibling = $(domElement).parent().parent().parent().siblings().get()[0];
    if ($(grandparentSibling).is("a[href='/quiz']")) {
        console.log("Quiz article!");
    }
    return "listicle";
}

function hoverArticle(domElement) {
    var title = $(domElement).html().trim();
    var classification = classify(title, domElement);

    if(classification !== 'other') {
        analyzeArticle(domElement, classification)
    }
}

function analyzeArticle(domElement, classification) {
    if ($(domElement).find('.hack-overlay').length > 0) {
        return;
    }

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

var lastUpdate = 0;

$(window).scroll(function(){
    var dist = $(window).scrollTop();
    if (dist - lastUpdate > 1000) {
        lastUpdate = dist;
        go();
    };
}).trigger('scroll');
