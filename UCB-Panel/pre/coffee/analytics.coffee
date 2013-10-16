# PROJECT: UCB-Panel
# 
# AUTHOR : Niklas Heer (niklas.heer@me.com)
# DATE   : 13.10.2013
# LICENSE: GPL 3.0

# Track a click on a button using the asynchronous tracking API.
trackButtonClick = (e) ->
	_gaq.push ["_trackEvent", e.target.id, "clicked"]

_gaq = _gaq or []
_gaq.push ["_setAccount", "UA-27512118-4"]
_gaq.push ["_trackPageview"]
(->
	ga = document.createElement("script")
	ga.type = "text/javascript"
	ga.async = true
	ga.src = "https://ssl.google-analytics.com/ga.js"
	s = document.getElementsByTagName("script")[0]
	s.parentNode.insertBefore ga, s
)()

# define dom selector for listening
document.addEventListener "DOMContentLoaded", ->
	buttons = document.querySelectorAll("button")
	i = 0

	while i < buttons.length
		buttons[i].addEventListener "click", trackButtonClick
		i++
