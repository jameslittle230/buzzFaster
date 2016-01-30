$("h2 > a").each(function(i) {
  var url = $(this).attr("href");
  $.get(url, function(data) {
    james(data);
  })
});

function james(data) {}
