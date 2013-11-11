# PROJECT: UCB-Panel
#
# AUTHOR : Niklas Heer (niklas.heer@me.com)
# DATE   : 13.10.2013
# LICENSE: GPL 3.0

# classes
class Link
	constructor: ( @name, @classes, @id) ->

# initalize
locale = window.navigator.language
_CONTENT = $.parseJSON(
	$.ajax(
		{
			url: "_locales/" + locale + "/data.json",
			async: false,
			dataType: 'json'
		}
	).responseText).PanelContent
_THEMES = $.parseJSON(
	$.ajax(
		{
			url: "themes/" + localStorage["fav_theme"] + ".json",
			async: false,
			dataType: 'json'
		}
	).responseText)


# function to create the html code for a button
createButton = (Obj) ->
	button = $('<button class="' + Obj.classes +
		'" type="button" id="' + Obj.id +
		'"><div class="' + _THEMES.icons[Obj.name] +
		'"></div>' + _CONTENT[Obj.name].name + '</button><br>')
	button.click(() ->
		chrome.tabs.create url: _CONTENT[Obj.name].link
		_gaq.push(['_trackEvent', Obj.id, 'clicked'])
	)

createFooterButton = (Obj) ->
	button = $('<button class="' + Obj.classes +
		'" type="button" id="' + Obj.id +
		'" data-toggle="tooltip" data-placement="top" title=""' +
		' data-original-title="' + _CONTENT[Obj.name].name + '" >' +
		'<i class="' + _THEMES.icons[Obj.name] + '"></i >' +
		'</button>')
	button.click(() ->
		chrome.tabs.create url: _CONTENT[Obj.name].link
		_gaq.push(['_trackEvent', Obj.id, 'clicked'])
	)

# function to create a button group
addButtonGroup = (buttons, parentClass, footer) ->
	length = buttons.length
	button = null
	i = 0
	while i < length
		button = buttons[i]
		if footer
			$(parentClass).append createFooterButton(button)
		else
			$(parentClass).append createButton(button)
		i++

# function to add add a collapse-capable button
createCollapseButton = (innerClass, value, icon, text) ->
	collapseButton = null
	theme = localStorage["fav_theme"]
	switch theme
		when "flat"
			collapseButton = $('<button class="' + innerClass +
				'" value="' + value +
				'"><div class="' + icon +
				'"></div>' + text +
				'<b class="arrow icon-angle-down"></b></button>')
		else
			collapseButton = $('<button class="' + innerClass +
				'" value="' + value +
				'"><div class="' + icon +
				'"></div>' + text +
				'<div class="icon_arrow"></div></button>')
	collapseButton.click(() ->
		_gaq.push(['_trackEvent', '[Collapse Button] ' + text, 'clicked'])
		trig = $(this)
		if trig.hasClass("trigger_active")
			if theme is "flat"
				arrow = trig.find('.arrow')
				arrow.removeClass('icon-angle-up')
				arrow.addClass('icon-angle-down')
			else
				trig.find(".icon_arrow").css "background-image", "url(images/arrow_down.gif)"
			trig.next(".ucbPanelCollapseContainer").slideToggle 300
			trig.removeClass "trigger_active"
		else
			trig.find(".trigger_active").next(".ucbPanelCollapseContainer").slideToggle 300
			trig.find(".trigger_active").removeClass "trigger_active"
			if theme is "flat"
				arrow = trig.find('.arrow')
				arrow.removeClass('icon-angle-down')
				arrow.addClass('icon-angle-up')
			else
				trig.find(".icon_arrow").css "background-image", "url(images/arrow_up.gif)"
			trig.next(".ucbPanelCollapseContainer").slideToggle 300
			trig.addClass "trigger_active"
	)


# function to insert a spacer into a given parent class
addSpacer = (parentClass) ->
	$(parentClass).append "<hr />"

getTrafficAndPrint = ->
	$.get "http://traffic.campus-company.eu/", (page) ->
		#
		# Beschreibt die Logik für die Werte welche aus der Seite gelesen werden sollen.
		# name: Name im Result
		# regex: Regulärer Ausdruck
		# group: Nummer der Gruppe die verwendet werden soll Gruppe = (...)
		# def: Default-Wert wenn nicht gefunden
		# fixNumber: Ändert das Format der Zahl in ein von Javscript lesbares Format
		# toFixed: Ändert die Nummer zu einer Zahl mit Anzahl an Nachkommastellen
		# divideBy: Dividiert den Wert durch diesen Wert (MB zu GB)
		# unit: Einheit
		#
		rules = [
			name: "credit"
			regex: /von\s*(\d*)\sMB\spro\sMonat/
			group: 1
			def: "NotFound"
			fixNumber: false
			toFixed: 2
			divideBy: 1000
			unit: "GB"
		,
			name: "remaining"
			regex: /Ihr\s*Restguthaben:\s*<strong>\s*(\d*\.\d*)\s*MB/
			group: 1
			def: "NotFound"
			fixNumber: false
			toFixed: 2
			divideBy: 1000
			unit: "GB"
		,
			name: "upload"
			regex: /<th>Monatssumme<\/th>\s*<th align=\"right\">((\d*\.)*\d*\,\d*)/
			group: 1
			def: "NotFound"
			fixNumber: true
			toFixed: 2
			divideBy: 1000
			unit: "GB"
		,
			name: "download"
			regex: /<th>Monatssumme<\/th>\s*<th align=\"right\">(\d*\.)*\d*\,\d*<\/th>\s*<th align="right">((\d*\.)*\d*\,\d*)/
			group: 2
			def: "NotFound"
			fixNumber: true
			toFixed: 2
			divideBy: 1000
			unit: "GB"
		]

		#Entfernt Overhead am Anfang und Ende - nicht getestet ob es dann schneller ist
		page = page.replace(/.*<body>/, "")
		page = page.replace(/<div[^>]*>.*/, "")

		#Result Object
		result = new Object()
		for r of rules
			rule = rules[r]

			#Match
			matcher = page.match(rule.regex)
			if matcher?
				#Match erfolgreich
				result[rule.name] = matcher[rule.group]
				if rule.fixNumber isnt `undefined` and rule.fixNumber
					result[rule.name] = result[rule.name].replace(/\./, "")
					result[rule.name] = result[rule.name].replace(/\,/, ".")
				result[rule.name] /= rule.divideBy  unless rule.divideBy is `undefined`
				result[rule.name] = parseFloat(result[rule.name]).toFixed(rule.toFixed)  unless rule.toFixed is `undefined`
				result[rule.name] += " " + rule.unit  unless rule.unit is `undefined`
			else
				#Match nicht erfolgreich
				result[rule.name] = rule.def
		$(".traffic_up").append result.upload
		$(".traffic_down").append result.download
		$(".traffic_total").append result.remaining

getFoodAndPrice = (input, isKomponentenEssen) ->
	regexHTML = /(<([^>]+)>)/ig
	result = input.replace(regexHTML, "")

	regexMoney = /(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)[€]/g
	money = result.match(regexMoney)
	output = result.replace(regexMoney, "")
	output = output.replace("/", "")

	unless money?
		if isKomponentenEssen
			money = ["2,25€", "3,65€"]
		else
			money = ["2,30€", "4,35€"]
	output += '<p class="price">Preis: ' + money[0] + ' &#185; / ' + money[1] + ' &#178;</p>'

	return output

getMensaAndPrint = () ->
	$.get "http://infotv.umwelt-campus.de/mensa/xml/mensa.xml", (xml) ->
		json = $.xml2json(xml)

		$('.ucbMensaCollapse').click(() ->
			chrome.tabs.create url: "http://ucb.li/mensa"
			_gaq.push(['_trackEvent', '[extern] UCB Mensa', 'clicked'])
		)

		# datum = $.format.date("2013-10-31 10:54:50.546", 'dd.MM.yyyy') # zum testen
		datum = $.format.date(new Date(), 'dd.MM.yyyy')

		i = 0
		gefunden = false
		_.each(json.tag, (tag) ->
			i++
			if tag.datum is datum
				gefunden = true
				if tag.stammessen.match("Feiertag")
					$('.ucbMensaCollapse').append '<div class="collapse_item noFood"><span class="glyphicon glyphicon-ban-circle"></span></i> Heute ist ein Feiertag!</div>'
				else
					$('.ucbMensaCollapse').append '<div class="collapse_item stammessen"><p class="heading">Stammessen:</p>' + getFoodAndPrice(tag.stammessen) + '</div>'
					$('.ucbMensaCollapse').append '<div class="collapse_item vegetarisch"><p class="heading">Vegetarisch:</p>' + getFoodAndPrice(tag.vegetarisch) + '</div>'
					$('.ucbMensaCollapse').append '<div class="collapse_item komponentenessen"><p class="heading">Komponentenessen:</p>' + getFoodAndPrice(tag.komponentenessen, true) + '</div>'
					$('.ucbMensaCollapse').append '<div class="info">&#185; für Studierende<br>&#178; für Gäste</p>'
			else
				if i >= 5 and not gefunden
					$('.ucbMensaCollapse').append '<div class="collapse_item noFood"><span class="glyphicon glyphicon-ban-circle"></span></i> Keine Essen gefunden.</div>'
		)

# Build the App
buildView = () ->
	$(".ucbMainPanel").append "<div class=\"ucbPanelButtonGroup\"></div>"
	# General Variables
	metaClass = ".ucbPanelButtonGroup" # jQuery identifier

	# CSS-Classes
	btnBaseCSS = "button btn btn-default menuitem-iconic "
	collapseCssClasses = btnBaseCSS + "ucbpanel_iro collapse_item"

	# Content Objects
	ucbHomepage     = new Link("ucbHomepage", collapseCssClasses, "[Collapsed] UCB Startseite")
	ucbTimetable    = new Link("ucbTimetable", collapseCssClasses, "[Collapsed] UCB Studenplan")
	ucbDates        = new Link("ucbDates", collapseCssClasses, "[Collapsed] UCB Zeitplan")
	ucbCampusplan   = new Link("ucbCampusplan", collapseCssClasses, "[Collapsed] UCB Campusplan")
	ucbExams        = new Link("ucbExams", collapseCssClasses, "[Collapsed] UCB Klausurplan")
	ucbContact      = new Link("ucbContact", collapseCssClasses, "[Collapsed] UCB Contact")
	ucbBlog         = new Link("ucbBlog", collapseCssClasses, "[Collapsed] UCB Blog")
	ucbFacebook     = new Link("ucbFacebook", collapseCssClasses, "[Collapsed] UCB Facebook")
	ucbStaff        = new Link("ucbStaff", collapseCssClasses, "[Collapsed] UCB Personalverzeichnis")
	ucbDataCenter   = new Link("ucbDataCenter", collapseCssClasses, "[Collapsed] UCB Rechenzentrum")
	ucbMSDNAA       = new Link("ucbMSDNAA", collapseCssClasses, "[Collapsed] UCB MSDNAA")
	ucbCommunity    = new Link("ucbCommunity", btnBaseCSS + "ucbpanel_iro", "UCB Community")
	ucbGremienallee = new Link("ucbGremienallee", btnBaseCSS + "ucbpanel_gremienallee", "UCB Gremienallee")
	ucbStudIP       = new Link("ucbStudIP", btnBaseCSS + "ucbpanel_studip", "UCB Stud.IP")
	ucbWebMail      = new Link("ucbWebMail", btnBaseCSS + "ucbpanel_webmail", "UCB Webmail")
	ucbQIS          = new Link("ucbQIS", btnBaseCSS + "ucbpanel_qis", "UCB QIS")
	ucbIntranet     = new Link("ucbIntranet", btnBaseCSS + "ucbpanel_iro", "UCB Intranet")
	ucbLibrary      = new Link("ucbLibrary", btnBaseCSS + "ucbpanel_bib", "UCB eLibrary")
	ucbJuris        = new Link("ucbJuris", btnBaseCSS + "ucbpanel_juris", "UCB Juris")
	ucbOLAT         = new Link("ucbOLAT", btnBaseCSS + "ucbpanel_olat", "UCB OLAT")
	ucbMensa        = new Link("ucbMensa", btnBaseCSS + "ucbpanel_mensa", "UCB Mensa")
	ucbKneipe       = new Link("ucbKneipe", btnBaseCSS + "ucbpanel_kadu", "UCB Campus Kneipe")


	# Collapse Container
	$(metaClass).append createCollapseButton("btn btn-default trigger menuitem-iconic", "%COLLAPSE%", "icon_ucbpanel_iro", "Umwelt-Campus")
	$(metaClass).append '<div class="ucbPanelCollapseContainer"></div>'

	# <!-- UCB Links -->
	ucbCollapseGroup = [ucbHomepage, ucbTimetable, ucbDates, ucbCampusplan, ucbExams, ucbContact, ucbBlog, ucbFacebook, ucbStaff, ucbDataCenter, ucbMSDNAA]
	addButtonGroup( ucbCollapseGroup, ".ucbPanelCollapseContainer" )
	addSpacer( metaClass )

	# <!-- Studierende unter einander -->
	ucbCommunityGroup = [ucbCommunity, ucbGremienallee]
	addButtonGroup( ucbCommunityGroup, ".ucbPanelButtonGroup" )
	addSpacer( metaClass )

	# <!-- Internes -->
	ucbInternGroup = [ucbStudIP, ucbWebMail, ucbQIS, ucbIntranet, ucbLibrary, ucbJuris, ucbOLAT]
	addButtonGroup( ucbInternGroup, ".ucbPanelButtonGroup" )
	addSpacer( metaClass )

	# <!-- Auf dem Campus -->
	ucbOnCampusGroup = [ ucbKneipe]
	addButtonGroup( ucbOnCampusGroup, ".ucbPanelButtonGroup" )
	# Mensa crawler
	$(metaClass).append createCollapseButton(btnBaseCSS + "ucbpanel_mensa trigger", "%COLLAPSE%", _THEMES.icons["ucbMensa"], "Mensa")
	$(metaClass).append '<div class="ucbPanelCollapseContainer ucbMensaCollapse" id="ucbMensaCollapse"></div>'
	getMensaAndPrint()

	# check if we are on the Campus, if not don't display Trafficmeter
	$.get "http://traffic.campus-company.eu/", (page) ->
		ip_address = page.match(/Ihre IP-Adresse: 143.93.4[0-2]{1}.[0-9]{1,3}/)+"" #IP im Lan???
		ip_address = ip_address.replace(/Ihre IP-Adresse: /, "")+""

		unless ip_address is "null"
			addSpacer( metaClass )
			theme = localStorage["fav_theme"]
			switch theme
				when "flat"
					TrafficButton = $('<button class="button btn btn-default menuitem-iconic ucbpanel_traffic" type="button" id="Campus Company Traffic" value="http://traffic.campus-company.eu"><div class="icon-dashboard"></div>Rest-Traffic:&nbsp;<b class="traffic_total"> </b></button>')
					TrafficButton.click(() ->
						chrome.tabs.create url: "http://traffic.campus-company.eu"
					)
					$(".ucbPanelButtonGroup").append TrafficButton
				else
					TrafficButton = $('<button class="button ucbpanel_traffic" type="button" id="Campus Company Traffic" value="http://traffic.campus-company.eu"></button>')
					TrafficButton.click(() ->
						_gaq.push(['_trackEvent', '[extern] UCB TrafficMeter', 'clicked'])
						chrome.tabs.create url: "http://traffic.campus-company.eu"
					)
					$(".ucbPanelButtonGroup").append TrafficButton
					$(".ucbPanelButtonGroup").append '<div class="TrafficDisplay"></div>'
					$(".TrafficDisplay").append '<div class="TrafficLeftSide"></div>'
					$(".TrafficDisplay").append '<div class="TrafficRightSide"></div>'
					$(".TrafficLeftSide").append '<p class="traffic_down" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-circle-arrow-down"></span> </p>'
					$(".TrafficLeftSide").append '<p class="traffic_up" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-circle-arrow-up"></span> </p>'
					$(".TrafficRightSide").append '<p class="traffic_total" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-sort"></span> </p>'
			getTrafficAndPrint() # write data


	# <!-- Footer -->
	footerHTML = $('
		<div class="btn-group-wrap" >
			<div class="btn-group center FooterInnerClass" >
			</div >
		</div >
	')
	$(".ucbPanelFooter").append footerHTML

	footerHome     = new Link("footerHome", "btn btn-default", "[Footer] Hompage")
	footerAbout    = new Link("footerAbout", "btn btn-default", "[Footer] About")
	footerBugs     = new Link("footerBugs", "btn btn-default", "[Footer] Bugs")
	footerSettings = new Link("footerSettings", "btn btn-default", "[Footer] Settings")

	footerGroup = [footerHome, footerAbout, footerBugs, footerSettings]
	addButtonGroup( footerGroup, ".FooterInnerClass", true)

#
# MAIN FUNCTION
#
main = () ->
	buildView()

	# initialize important stuff
	$(".trigger").not(".trigger_active").next(".ucbPanelCollapseContainer").hide()
	trig = $(this)
	$(".icon_arrow").css "background-image", "url(images/arrow_down.gif)"  unless trig.hasClass("trigger_active")

	$('.ucbMainPanel').slimScroll
		height: '502px',
		color: '#666',
		size: '5px',
		alwaysVisible: true

	# Toggle tooltip
	$("#footer").tooltip
		selector: "[data-toggle=tooltip]"
		container: "body"

	$("#footer").tooltip()

main()