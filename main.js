$("h2 > a").each(function(i) {
    var title = $(this).html().trim();
    var classification = classify(title);
    if(classification === "listicle") {
        var url = $(this).attr("href");
        $.get(url, function(data) {
            james(title, data);
        });
        overlay(this, "Okay guise");
    }
});

function james(title, data) {
    // console.group();
    // console.log(title)
    var nextDom = $.parseHTML($.trim(data));

    var newDom = jQuery(nextDom);
    // console.log($('h2', newDom).html());
    // console.groupEnd();
}

function classify(headline) {
    var list = /^(The )?\d+ .*$/;
    if(list.test(headline)) {
        console.log(headline + " is a listicle");
        return "listicle";
    } else {
        console.error(headline + " is not a listicle");
    }
    return "other";
}

function overlay(el, body) {
    console.log(el, body);
    $(el).append("<div class=\"hack-overlay\">"+body+"</div>");
}
