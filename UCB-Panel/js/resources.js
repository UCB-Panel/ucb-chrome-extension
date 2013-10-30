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

  if (theme == null) {
    localStorage["fav_theme"] = "flat";
  }

  switch (theme) {
    case "simple":
      $.rloader([
        {
          src: chrome.extension.getURL('css/simple.css')
        }
      ]);
      break;
    case "classic":
      $.rloader([
        {
          src: chrome.extension.getURL('css/classic.css')
        }
      ]);
      break;
    default:
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
  }

}).call(this);
