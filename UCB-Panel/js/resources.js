(function() {
  var theme;

  $.rloader([
    {
      src: chrome.extension.getURL('css/main.css')
    }
  ]);

  $.rloader([
    {
      src: chrome.extension.getURL('css/icons.css')
    }
  ]);

  theme = localStorage["fav_theme"];

  switch (theme) {
    case "simple":
      $.rloader([
        {
          src: chrome.extension.getURL('css/simple.css')
        }
      ]);
      break;
    case "flat":
      $.rloader([
        {
          src: chrome.extension.getURL('css/flat.css')
        }
      ]);
      $.rloader([
        {
          src: chrome.extension.getURL('vendors/font-awesome/css/font-awesome.min.css')
        }
      ]);
      break;
    default:
      $.rloader([
        {
          src: chrome.extension.getURL('css/classic.css')
        }
      ]);
  }

}).call(this);
