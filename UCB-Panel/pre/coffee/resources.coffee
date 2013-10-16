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

# load Extension Stylesheets
$.rloader [src: chrome.extension.getURL('css/style.css')]

# load Extension scripts
# $.rloader [src: chrome.extension.getURL('js/min/analytics.min.js')]




