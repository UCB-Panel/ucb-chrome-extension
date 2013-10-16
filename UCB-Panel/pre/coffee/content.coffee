# PROJECT: UCB-Panel
# 
# AUTHOR : Niklas Heer (niklas.heer@me.com)
# DATE   : 13.10.2013
# LICENSE: GPL 3.0

# classes
class Link
	constructor: ( @classes, @icon, @text, @value, @id) ->

# initalize
mensaPlan = "test"

# function to create the html code for a button
createButton = (contentObj) ->
	return ('<button class="' + contentObj.classes + 
		'" type="button" id="' + contentObj.id +
		'" value="' + contentObj.value + 
		'"><div class="' + contentObj.icon + 
		'"></div>' + contentObj.text + '</button><br>')

# function to create a button group
addButtonGroup = (buttons, parentClass) ->
	length = buttons.length
	button = null
	i = 0
	while i < length
		button = buttons[i]
		$(parentClass).append createButton(button)
		i++

# function to add add a collapse-capable button
createCollapseButton = (innerClass, value, icon, text) ->
	return ('<button class="' + innerClass + 
		'" value="' + value + 
		'"><div class="' + icon + 
		'"></div>' + text + 
		'<div class="icon_arrow"></div></button>')

# function to insert a spacer into a given parent class
addSpacer = (parentClass) ->
	$(parentClass).append "<hr />"

getTrafficAndPrint = () ->
	$.get "http://traffic.campus-company.eu/", (page) ->
		exp = page.match(/Ihr Restguthaben: <strong>\s*[0-9]*\.[0-9]* MB/)
		trafficPerMonth = page.match(/von [0-9]* MB pro Monat/) + ""
		downloadThisMonth = page.match(/<th>Monatssumme<\/th>\s*<th align=\"right\">[0-9]*\.?[0-9]*\,[0-9]*/) + ""
		uploadThisMonth = page.match(/<th>Monatssumme<\/th>\s*<th align=\"right\">[0-9]*\.?[0-9]*\,[0-9]*<\/th>\s*<th align="right">[0-9]*\.?[0-9]*\,[0-9]*/) + ""
		dataPerDate = new Array()
		tag = undefined
		while (tag = page.match(/<tr class=\"(trbg1|trbg0)\">\s*<td>([0-9]{4}-[0-9]{2}-[0-9]{2})<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<\/tr>/))?
			page = page.replace(/<tr class=\"(trbg1|trbg0)\">\s*<td>([0-9]{4}-[0-9]{2}-[0-9]{2})<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<\/tr>/, "")
			data = new Object()
			data.date = Date.parse(tag[2])
			data.down = tag[3]
			data.down = data.down.replace(/\./, "")
			data.down = data.down.replace(/,/, ".")
			data.down *= 1
			data.up = tag[4]
			data.up = data.up.replace(/\./, "")
			data.up = data.up.replace(/,/, ".")
			data.up *= 1
			data.traffic = tag[5]
			data.traffic = data.traffic.replace(/\./, "")
			data.traffic = data.traffic.replace(/,/, ".")
			data.traffic *= 1
			dataPerDate.push data
		unless trafficPerMonth is "null"
			#TRAFFIC PRO MONAT
			trafficPerMonth = trafficPerMonth.replace(/von /, "") + ""
			trafficPerMonth = trafficPerMonth.replace(RegExp(" MB pro Monat"), "") + ""
			trafficPerMonth = trafficPerMonth * 1
		if exp?
			#TRAFFIC AKTUELL
			exp = exp + ""
			exp = exp.replace(/Ihr Restguthaben: <strong>\s*/, "") + ""
			exp = exp.replace(RegExp(" MB"), "") + ""
			exp = exp * 1
		unless downloadThisMonth is "null"
			#Downloaded AKTUELL
			downloadThisMonth = downloadThisMonth.replace(/<th>Monatssumme<\/th>\s*<th align=\"right\">/, "")
			downloadThisMonth = downloadThisMonth.replace(/\./, "")
			downloadThisMonth = downloadThisMonth.replace(/,/, ".")
			downloadThisMonth *= 1
		else
			downloadThisMonth = 0.0
		unless uploadThisMonth is "null"
			#Uploaded AKTUELL
			uploadThisMonth = uploadThisMonth.replace(/<th>Monatssumme<\/th>\s*<th align=\"right\">[0-9]*\.?[0-9]*\,[0-9]*<\/th>\s*<th align="right">/, "")
			uploadThisMonth = uploadThisMonth.replace(/\./, "")
			uploadThisMonth = uploadThisMonth.replace(/,/, ".")
			uploadThisMonth *= 1
		else
			uploadThisMonth = 0.0

		# daten verarbeiten und in lesbare form bringen
		data = new Object()
		data.Traffic = exp.toFixed(2) + " MB"
		data.TrafficGBMB = ((if (exp / 1000).toFixed(2) > 1 then (exp / 1000).toFixed(2) + " GB" else exp.toFixed(2) + " MB"))
		data.TrafficGB = (exp / 1000).toFixed(2) + " GB"
		data.TrafficPM = trafficPerMonth.toFixed(2) + " MB"
		data.TrafficPMraw = trafficPerMonth.toFixed(2)
		data.TrafficPMGB = (trafficPerMonth / 1000).toFixed(2) + " GB"
		data.Down = downloadThisMonth.toFixed(2) + " MB"
		data.DownGB = (downloadThisMonth / 1000).toFixed(2) + " GB"
		data.Up = uploadThisMonth.toFixed(2) + " MB"
		data.UpGB = (uploadThisMonth / 1000).toFixed(2) + " GB"
		data.dataPerDate = dataPerDate

		#write data to extension
		$('.traffic_up').append(data.UpGB)
		$('.traffic_down').append(data.DownGB)
		$('.traffic_total').append(data.TrafficGB)


# build the german app content
buildGermanApp = ->
	# General Variables
	metaClass = ".ucbPanelButtonGroup" # jQuery identifier

	# CSS-Classes
	btnBaseCSS = "button menuitem-iconic "
	collapseCssClasses = btnBaseCSS + "ucbpanel_iro collapse_item"

	# Content Objects
	ucbHomepage = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Startseite", "http://www.umwelt-campus.de/ucb/index.php", "[Collapsed] UCB Startseite")
	ucbCampusplan = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Campusplan", "http://www.umwelt-campus.de/ucb/fileadmin/layout/ucbplan.pdf", "[Collapsed] UCB Campusplan")
	ucbContact = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Contact", "http://ucb-contact.umwelt-campus.de/", "[Collapsed] UCB Contact")
	ucbMSDNAA = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Microsoft-Dreamspark", "https://www.umwelt-campus.de/elms_login.php", "[Collapsed] UCB MSDNAA")
	ucbBlog = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Blog", "http://blog.hochschule-trier.de/", "[Collapsed] UCB Blog")
	ucbFacebook = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Facebook-Seite", "https://www.facebook.com/UmweltCampus", "[Collapsed] UCB Facebook")
	ucbStaff = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Personalverzeichnis", "http://www.umwelt-campus.de/ucb/index.php?id=personalverzeichnis", "[Collapsed] UCB Personalverzeichnis")
	ucbDataCenter = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Rechenzentrum", "http://www.umwelt-campus.de/ucb/index.php?id=rechenzentrum", "[Collapsed] UCB Rechenzentrum")
	ucbExams = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Klausurplan", "http://www.umwelt-campus.de/ucb/index.php?id=klausurplan", "[Collapsed] UCB Klausurplan")
	ucbDates = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Zeitplan", "http://www.umwelt-campus.de/ucb/index.php?id=zeitplan", "[Collapsed] UCB Zeitplan")
	ucbTimetable = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Stundenplan", "http://www.umwelt-campus.de/ucb/index.php?id=fachbereiche", "[Collapsed] UCB Studenplan")
	ucbGremienallee = new Link(btnBaseCSS + "ucbpanel_gremienallee", "icon_ucbpanel_gremienallee", "Gremienallee", "http://www.gremienallee.de", "UCB Gremienallee")
	ucbCommunity = new Link(btnBaseCSS + "ucbpanel_iro", "icon_ucbpanel_iro", "Community", "http://community.umwelt-campus.de/index.php", "UCB Community")
	ucbQIS = new Link(btnBaseCSS + "ucbpanel_qis", "icon_ucbpanel_qis", "Qis", "https://qis.fh-trier.de/qisserver/rds?state=user&type=0", "UCB QIS")
	ucbWebMail = new Link(btnBaseCSS + "ucbpanel_webmail", "icon_ucbpanel_webmail", "Webmail", "https://exchange.umwelt-campus.de", "UCB Webmail")
	ucbIntranet = new Link(btnBaseCSS + "ucbpanel_iro", "icon_ucbpanel_iro", "Intranet", "http://www.umwelt-campus.de/ucb/index.php?id=intern", "UCB Intranet")
	ucbLibrary = new Link(btnBaseCSS + "ucbpanel_bib", "icon_ucbpanel_bib", "eLibrary", "http://grimm.umwelt-campus.de/", "UCB eLibrary")
	ucbStudIP = new Link(btnBaseCSS + "ucbpanel_studip", "icon_ucbpanel_studip", "StudIP", "https://studip.fh-trier.de/index.php?again=yes", "UCB StudIP")
	ucbJuris = new Link(btnBaseCSS + "ucbpanel_juris", "icon_ucbpanel_juris", "Juris", "http://www.juris.de/jportal/Zugang.jsp", "UCB Juris")
	ucbOLAT = new Link(btnBaseCSS + "ucbpanel_olat", "icon_ucbpanel_olat", "OLAT", "https://olat.vcrp.de", "UCB OLAT")
	ucbMensa = new Link(btnBaseCSS + "ucbpanel_mensa", "icon_ucbpanel_mensa", "Mensa", "http://ucb.li/mensa", "UCB Mensa")
	ucbKneipe = new Link(btnBaseCSS + "ucbpanel_kneipe", "icon_ucbpanel_kneipe", "Campus Kneipe", "http://www.umwelt-campus.de/ucb/index.php?id=8163&L=0", "UCB Campus Kneipe")


	# Collapse Container
	$(metaClass).append createCollapseButton("trigger menuitem-iconic", "%COLLAPSE%", "icon_ucbpanel_iro", "Umwelt-Campus")
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
	ucbOnCampusGroup = [ucbMensa, ucbKneipe]
	addButtonGroup( ucbOnCampusGroup, ".ucbPanelButtonGroup" )
	$(metaClass).append createCollapseButton(btnBaseCSS + "ucbpanel_mensa trigger", "%COLLAPSE%", "icon_ucbpanel_mensa", "Mensa")
	$(metaClass).append '<div class="ucbPanelCollapseContainer ucbMensaCollapse" id="ucbMensaCollapse"></div>'


	# $.get "http://infotv.umwelt-campus.de/mensa/xml/mensa.xml", (xml) ->
	#   json = $.xml2json(xml)
	#   $('#ucbMensaCollapse').append json
	#   console.log json

	# jQuery.ajax
	# 	url: "http://infotv.umwelt-campus.de/mensa/xml/mensa.xml"
	# 	success: (xml) ->
	# 		$('.ucbMensaCollapse').waitUntilExists (xml) ->
	# 			json = $.xml2json(xml)
	# 			$('.ucbMensaCollapse').append json
	# 			console.log json


	# 	async: false

	# check if we are on the Campus, if not don't display Trafficmeter
	$.get "http://traffic.campus-company.eu/", (page) ->
		ip_address = page.match(/Ihre IP-Adresse: 143.93.4[0-2]{1}.[0-9]{1,3}/)+"" #IP im Lan???
		ip_address = ip_address.replace(/Ihre IP-Adresse: /, "")+""

		unless ip_address is "null"
			addSpacer( metaClass )

			$(".ucbPanelButtonGroup").append '<button class="button ucbpanel_traffic" type="button" id="Campus Company Traffic" value="http://traffic.ucbgmbh.de/index.php"></button>'
			$(".ucbPanelButtonGroup").append '<div class="TrafficDisplay"></div>'
			$(".TrafficDisplay").append '<div class="TrafficLeftSide"></div>'
			$(".TrafficDisplay").append '<div class="TrafficRightSide"></div>'
			$(".TrafficLeftSide").append '<p class="traffic_down" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-circle-arrow-down"></span> </p>'
			$(".TrafficLeftSide").append '<p class="traffic_up" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-circle-arrow-up"></span> </p>'
			$(".TrafficRightSide").append '<p class="traffic_total" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-sort"></span> </p>'
			getTrafficAndPrint() # wirte data


	# <!-- Footer -->
	footerHTML = $('
		<div class="btn-group-wrap" >
			<div class="btn-group center" >
				<button id="[Footer] Hompage" value="http://ucb.we-develop.de" type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="" data-original-title="Homepage" >
					<i class="glyphicon glyphicon-home"></i >
				</button>
				<button id="[Footer] About" value="http://ucb.we-develop.de/node/5" type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="" data-original-title="Über das UCB-Panel" >
					 <i class="glyphicon glyphicon-question-sign"></i>
				</button>
				<button id="[Footer] Bugs" value="http://ucb.we-develop.de/contact" type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="" data-original-title="Melde einen Bug oder Wunsch" >
					<i class="glyphicon glyphicon-bullhorn"></i>
				</button>
				<button id="[Footer] Settings" value="options.html" type="button" class="btn btn-default" data-toggle="tooltip" data-placement="top" title="" data-original-title="Einstellungen" >
					<i class="glyphicon glyphicon-cog"></i>
				</button>
			</div >
		</div >
	')
	$(".ucbPanelFooter").append footerHTML


# build the english app content
buildEnglishApp = ->
	# NIY


buildView = () ->
	# Build the App
	$(".ucbMainPanel").append "<div class=\"ucbPanelButtonGroup\"></div>"

	# build the localised App
	locale = window.navigator.language
	switch locale
		when "de"
			buildGermanApp()
		when "en"
			buildEnglishApp()
		else
			buildEnglishApp()

#
# MAIN FUNCTION
#
$(document).ready(->

	buildView()

	# initialize important stuff
	$(".trigger").not(".trigger_active").next(".ucbPanelCollapseContainer").hide()
	trig = $(this)
	$(".icon_arrow").css "background-image", "url(images/arrow_down.gif)"  unless trig.hasClass("trigger_active")

	# Toggle tooltip
	$("#footer").tooltip
		selector: "[data-toggle=tooltip]"
		container: "body"

	$("#footer").tooltip()
)

# Add Listeners
document.addEventListener "DOMContentLoaded", ->
	LaunchURL = (oURL) ->
		chrome.tabs.create url: oURL
	anchors = document.querySelectorAll("button")
	i = 0

	while i < anchors.length
		anchors[i].addEventListener "click", (event) ->
			if event.currentTarget.value is "%COLLAPSE%"
				trig = $(this)
				if trig.hasClass("trigger_active")
					$(".icon_arrow").css "background-image", "url(images/arrow_down.gif)"
					trig.next(".ucbPanelCollapseContainer").slideToggle "slow"
					trig.removeClass "trigger_active"
				else
					$(".trigger_active").next(".ucbPanelCollapseContainer").slideToggle "slow"
					$(".trigger_active").removeClass "trigger_active"
					$(".icon_arrow").css "background-image", "url(images/arrow_up.gif)"
					trig.next(".ucbPanelCollapseContainer").slideToggle "slow"
					trig.addClass "trigger_active"
			else
				LaunchURL event.currentTarget.value
				event.preventDefault()
		i++
