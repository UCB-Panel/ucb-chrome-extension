# PROJECT: UCB-Panel
#
# AUTHOR : Niklas Heer (niklas.heer@me.com)
# DATE   : 13.10.2013
# LICENSE: GPL 3.0

# load Extension Stylesheets
$.rloader [src: chrome.extension.getURL('css/main.css')]
$.rloader [src: chrome.extension.getURL('css/icons.css')]

# load themes
theme = localStorage["fav_theme"]

# set default theme if not set at all
unless theme?
	localStorage["fav_theme"] = "flat"

switch theme
	when "simple"
		$.rloader [src: chrome.extension.getURL('css/simple.css')]
	when "classic"
		$.rloader [src: chrome.extension.getURL('css/classic.css')]
	else
		$.rloader [src: chrome.extension.getURL('css/flat.css')]