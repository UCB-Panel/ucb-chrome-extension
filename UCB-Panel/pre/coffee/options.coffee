# PROJECT: UCB-Panel
# 
# AUTHOR : Niklas Heer (niklas.heer@me.com)
# DATE   : 13.10.2013
# LICENSE: GPL 3.0

# Save this script as `options.js`

# Saves options to localStorage.
save_options = ->
	select = document.getElementById("theme")
	theme = select.children[select.selectedIndex].value
	localStorage["fav_theme"] = theme
	
	# Update status to let user know options were saved.
	status = $('#status').append '<div class="alert alert-success">Options Saved.</div>'
	status.show()
	setTimeout (->
		status.hide()
		status.html('')
	), 750

# Restores select box state to saved value from localStorage.
restore_options = ->
	favorite = localStorage["fav_theme"]
	return  unless favorite
	select = document.getElementById("theme")
	i = 0

	while i < select.children.length
		child = select.children[i]
		if child.value is favorite
			child.selected = "true"
			break
		i++

buildGermanApp = ->
	document.title = "UCB-Panel Einstellungen"

# Load a stylesheet
# $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', 'your stylesheet url') );
buildEnglishApp = ->
	document.title = "UCB-Panel settings"

document.addEventListener "DOMContentLoaded", restore_options
document.querySelector("#save").addEventListener "click", save_options

# NIY

#
# MAIN FUNCTION
#
$(document).ready ->
	
	# Build the App
	
	# build the localised App
	locale = window.navigator.language
	switch locale
		when "de"
			buildGermanApp()
		when "en"
			buildEnglishApp()
		else
			buildEnglishApp()
