(function() {
  var trackButtonClick, _gaq;

  trackButtonClick = function(e) {
    return _gaq.push(["_trackEvent", e.target.id, "clicked"]);
  };

  _gaq = _gaq || [];

  _gaq.push(["_setAccount", "UA-27512118-4"]);

  _gaq.push(["_trackPageview"]);

  (function() {
    var ga, s;
    ga = document.createElement("script");
    ga.type = "text/javascript";
    ga.async = true;
    ga.src = "https://ssl.google-analytics.com/ga.js";
    s = document.getElementsByTagName("script")[0];
    return s.parentNode.insertBefore(ga, s);
  })();

  document.addEventListener("DOMContentLoaded", function() {
    var buttons, i, _results;
    buttons = document.querySelectorAll("button");
    i = 0;
    _results = [];
    while (i < buttons.length) {
      buttons[i].addEventListener("click", trackButtonClick);
      _results.push(i++);
    }
    return _results;
  });

}).call(this);
