# PROJECT: UCB-Panel
# 
# AUTHOR : Niklas Heer (niklas.heer@me.com)
# DATE   : 13.10.2013
# LICENSE: GPL 3.0

# load Bootstrap
$.rloader [src: chrome.extension.getURL('vendors/bootstrap/css/bootstrap.min.css')]
$.rloader [src: chrome.extension.getURL('vendors/bootstrap/css/bootstrap-theme.min.css')]
$.rloader [src: chrome.extension.getURL('vendors/bootstrap/js/bootstrap.min.js')]

# load jQuery-Plugins
# $.rloader [src: chrome.extension.getURL('jquery.waituntilexists.min.js')]
$.rloader [src: chrome.extension.getURL('vendors/jquery.xml2json.js')]
$.rloader [src: chrome.extension.getURL('vendors/jquery.slimscroll.min.js')]

# load Extension Stylesheets
$.rloader [src: chrome.extension.getURL('css/main.css')]
$.rloader [src: chrome.extension.getURL('css/icons.css')]

# load themes
theme = localStorage["fav_theme"]
switch theme
	when "simple"
		$.rloader [src: chrome.extension.getURL('css/simple.css')]
	when "flat"
		$.rloader [src: chrome.extension.getURL('css/flat.css')]
	else
		$.rloader [src: chrome.extension.getURL('css/classic.css')]





