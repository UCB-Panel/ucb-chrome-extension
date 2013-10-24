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

getVersion = (callback) ->
	xmlhttp = new XMLHttpRequest()
	xmlhttp.open "GET", "manifest.json"
	xmlhttp.onload = (e) ->
		manifest = JSON.parse(xmlhttp.responseText)
		callback manifest.version
	xmlhttp.send null

buildGermanApp = ->
	document.title = "UCB-Panel Einstellungen"
	$(".container").append('
		<div class="page-header">
			<h1>Einstellungen <small>für das UCB-Panel</small>
			<small class="pull-right version-number">v </small></h1>
		</div>
		<div id="status"></div>
		<p>Theme auswählen:
		<select id="theme">
			<option value="classic">klassisches Design</option>
			<option value="simple">einfaches Design</option>
			<option value="flat">flat Design</option>
		</select>
		</p>

		<br>
		<button class="btn" id="save">Speichern</button>
	')

buildEnglishApp = ->
	document.title = "UCB-Panel settings"
	$(".container").append('
		<div class="page-header">
			<h1>Settings <small>for the UCB-Panel</small></h1>
		</div>
		<div id="status"></div>
		<p>Choose theme:
		<select id="theme">
			<option value="classic">classic design</option>
			<option value="simple">simple design</option>
			<option value="flat">flat design</option>
		</select>
		</p>

		<br>
		<button class="btn" id="save">Save</button>
	')




#
# MAIN FUNCTION
#
$(document).ready ->
	# build the localised App
	locale = window.navigator.language
	switch locale
		when "de"
			buildGermanApp()
		when "en"
			buildEnglishApp()
		else
			buildEnglishApp()

	restore_options()
	getVersion (ver) ->
		$(".version-number").append ver

	# Listeners
	document.querySelector("#save").addEventListener "click", save_options



