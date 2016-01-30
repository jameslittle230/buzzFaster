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

function james(title, data, domElement) {
    console.log(domElement);
    console.group();
    console.log(title)
    var nextDom = $.parseHTML($.trim(data));

    var newDom = jQuery(nextDom);
    var overlayText = '';
    $('.subbuzz_name', newDom).each( function() {
        var listItem = $(this).html().trim();
        overlayText += listItem + '<br>';
        // console.log($(this).attr('class'));
    });
    overlay(domElement, overlayText);
    console.groupEnd();
}

function classify(headline) {
    var list = /^(The )?\d+ .*$/;
    if(list.test(headline)) {
        //console.log(headline + " is a listicle");
        return "listicle";
    } else {
        //console.error(headline + " is not a listicle");
    }
    return "other";
}

function overlay(el, body) {
    console.log(el, body);
    $(el).append("<div class=\"hack-overlay\">"+body+"</div>");
}
