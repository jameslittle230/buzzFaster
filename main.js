$("h2 > a").each(function(i) {
    console.group()
    var title = $(this).html();
    console.log($.trim(title));

    var url = $(this).attr("href");
    $.get(url, function(data) {
        james(data);
    });
    console.groupEnd();
});

function james(data) {
    var nextDom = $.parseHTML($.trim(data));
    console.log(nextDom);
}

function classify(headline) {
    var list = /^\d+ \w+s .*$/;
    if(list.test(headline)) {
        console.log(headline);
        return "listicle";
    }
    return "other";
}
