(function() {
  var theme;

  $.rloader([
    {
      src: chrome.extension.getURL('vendors/bootstrap/css/bootstrap.min.css')
    }
  ]);

  $.rloader([
    {
      src: chrome.extension.getURL('vendors/bootstrap/css/bootstrap-theme.min.css')
    }
  ]);

  $.rloader([
    {
      src: chrome.extension.getURL('vendors/bootstrap/js/bootstrap.min.js')
    }
  ]);

  $.rloader([
    {
      src: chrome.extension.getURL('vendors/jquery.xml2json.js')
    }
  ]);

  $.rloader([
    {
      src: chrome.extension.getURL('vendors/jquery.slimscroll.min.js')
    }
  ]);

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
