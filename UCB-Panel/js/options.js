(function() {
  var buildEnglishApp, buildGermanApp, getVersion, restore_options, save_options;

  save_options = function() {
    var select, status, theme;
    select = document.getElementById("theme");
    theme = select.children[select.selectedIndex].value;
    localStorage["fav_theme"] = theme;
    status = $('#status').append('<div class="alert alert-success">Options Saved.</div>');
    status.show();
    return setTimeout((function() {
      status.hide();
      return status.html('');
    }), 750);
  };

  restore_options = function() {
    var child, favorite, i, select, _results;
    favorite = localStorage["fav_theme"];
    if (!favorite) {
      return;
    }
    select = document.getElementById("theme");
    i = 0;
    _results = [];
    while (i < select.children.length) {
      child = select.children[i];
      if (child.value === favorite) {
        child.selected = "true";
        break;
      }
      _results.push(i++);
    }
    return _results;
  };

  getVersion = function(callback) {
    var xmlhttp;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "manifest.json");
    xmlhttp.onload = function(e) {
      var manifest;
      manifest = JSON.parse(xmlhttp.responseText);
      return callback(manifest.version);
    };
    return xmlhttp.send(null);
  };

  buildGermanApp = function() {
    document.title = "UCB-Panel Einstellungen";
    return $(".container").append('\
		<div class="page-header">\
			<h1>Einstellungen <small>für das UCB-Panel</small>\
			<small class="pull-right version-number">v </small></h1>\
		</div>\
		<div id="status"></div>\
		<p>Theme auswählen:\
		<select id="theme">\
			<option value="classic">klassisches Design</option>\
			<option value="simple">einfaches Design</option>\
			<option value="flat">flat Design</option>\
		</select>\
		</p>\
\
		<br>\
		<button class="btn" id="save">Speichern</button>\
	');
  };

  buildEnglishApp = function() {
    document.title = "UCB-Panel settings";
    return $(".container").append('\
		<div class="page-header">\
			<h1>Settings <small>for the UCB-Panel</small></h1>\
		</div>\
		<div id="status"></div>\
		<p>Choose theme:\
		<select id="theme">\
			<option value="classic">classic design</option>\
			<option value="simple">simple design</option>\
			<option value="flat">flat design</option>\
		</select>\
		</p>\
\
		<br>\
		<button class="btn" id="save">Save</button>\
	');
  };

  $(document).ready(function() {
    var locale;
    locale = window.navigator.language;
    switch (locale) {
      case "de":
        buildGermanApp();
        break;
      case "en":
        buildEnglishApp();
        break;
      default:
        buildEnglishApp();
    }
    restore_options();
    getVersion(function(ver) {
      return $(".version-number").append(ver);
    });
    return document.querySelector("#save").addEventListener("click", save_options);
  });

}).call(this);
