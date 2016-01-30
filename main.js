$("h2 > a").each(function(i) {
    var titleLink = this;
    var title = $(this).html().trim();
    var classification = classify(title);
    if(classification === "listicle") {
        var url = $(this).attr("href");
        $.get(url, function(data) {
            james(title, data, titleLink);
        });
        overlay(this, "Okay guise");
    }
});

function james(title, data, domElement) {
    console.log(domElement);
    console.group();
    console.log(title)
    var nextDom = $.parseHTML($.trim(data));

    var newDom = jQuery(nextDom);
    $('.subbuzz_name', newDom).each( function() {
        var listItem = $(this).html().trim();
        $(domElement).append('<br>' + listItem);
        // console.log($(this).attr('class'));
    });
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
