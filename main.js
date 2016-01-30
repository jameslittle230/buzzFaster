$("h2 > a").each(function(i) {
    var title = $(this).html();
    var url = $(this).attr("href");
    $.get(url, function(data) {
        james(title, data);
    });
});

function james(title, data) {
    console.group();
    console.log(title)
    var nextDom = $.parseHTML($.trim(data));

    var newDom = jQuery(nextDom);
    console.log($('h2', newDom).html());
    console.groupEnd();
}

function classify(headline) {
    var list = /^\d+ \w+s .*$/;
    if(list.test(headline)) {
        console.log(headline);
        return "listicle";
    }
    return "other";
}
