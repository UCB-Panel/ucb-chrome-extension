(function() {
  var FooterLink, Link, addButtonGroup, addSpacer, buildEnglishApp, buildGermanApp, buildView, createButton, createCollapseButton, createFooterButton, getTrafficAndPrint, main, mensaPlan;

  Link = (function() {
    function Link(classes, icon, text, value, id) {
      this.classes = classes;
      this.icon = icon;
      this.text = text;
      this.value = value;
      this.id = id;
    }

    return Link;

  })();

  FooterLink = (function() {
    function FooterLink(classes, icon, text, value, id) {
      this.classes = classes;
      this.icon = icon;
      this.text = text;
      this.value = value;
      this.id = id;
    }

    return FooterLink;

  })();

  mensaPlan = "test";

  createButton = function(contentObj) {
    var button;
    button = $('<button class="' + contentObj.classes + '" type="button" id="' + contentObj.id + '" value="' + contentObj.value + '"><div class="' + contentObj.icon + '"></div>' + contentObj.text + '</button><br>');
    return button.click(function() {
      return chrome.tabs.create({
        url: contentObj.value
      });
    });
  };

  createFooterButton = function(Obj) {
    var button;
    button = $('<button class="' + Obj.classes + '" type="button" id="' + Obj.id + '" value="' + Obj.value + '" data-toggle="tooltip" data-placement="top" title=""' + ' data-original-title="' + Obj.text + '" >' + '<i class="' + Obj.icon + '"></i >' + '</button>');
    return button.click(function() {
      return chrome.tabs.create({
        url: Obj.value
      });
    });
  };

  addButtonGroup = function(buttons, parentClass, footer) {
    var button, i, length, _results;
    length = buttons.length;
    button = null;
    i = 0;
    _results = [];
    while (i < length) {
      button = buttons[i];
      if (footer) {
        $(parentClass).append(createFooterButton(button));
      } else {
        $(parentClass).append(createButton(button));
      }
      _results.push(i++);
    }
    return _results;
  };

  createCollapseButton = function(innerClass, value, icon, text) {
    var collapseButton, theme;
    collapseButton = null;
    theme = localStorage["fav_theme"];
    switch (theme) {
      case "flat":
        collapseButton = $('<button class="' + innerClass + '" value="' + value + '"><div class="' + icon + '"></div>' + text + '<b class="arrow icon-angle-down"></b></button>');
        break;
      default:
        collapseButton = $('<button class="' + innerClass + '" value="' + value + '"><div class="' + icon + '"></div>' + text + '<div class="icon_arrow"></div></button>');
    }
    return collapseButton.click(function() {
      var arrow, trig;
      trig = $(this);
      if (trig.hasClass("trigger_active")) {
        if (theme === "flat") {
          arrow = $('.arrow');
          arrow.removeClass('icon-angle-up');
          arrow.addClass('icon-angle-down');
        } else {
          $(".icon_arrow").css("background-image", "url(images/arrow_down.gif)");
        }
        trig.next(".ucbPanelCollapseContainer").slideToggle(300);
        return trig.removeClass("trigger_active");
      } else {
        $(".trigger_active").next(".ucbPanelCollapseContainer").slideToggle(300);
        $(".trigger_active").removeClass("trigger_active");
        if (theme === "flat") {
          arrow = $('.arrow');
          arrow.removeClass('icon-angle-down');
          arrow.addClass('icon-angle-up');
        } else {
          $(".icon_arrow").css("background-image", "url(images/arrow_up.gif)");
        }
        trig.next(".ucbPanelCollapseContainer").slideToggle(300);
        return trig.addClass("trigger_active");
      }
    });
  };

  addSpacer = function(parentClass) {
    return $(parentClass).append("<hr />");
  };

  getTrafficAndPrint = function() {
    return $.get("http://traffic.campus-company.eu/", function(page) {
      var data, dataPerDate, downloadThisMonth, exp, tag, trafficPerMonth, uploadThisMonth;
      exp = page.match(/Ihr Restguthaben: <strong>\s*[0-9]*\.[0-9]* MB/);
      trafficPerMonth = page.match(/von [0-9]* MB pro Monat/) + "";
      downloadThisMonth = page.match(/<th>Monatssumme<\/th>\s*<th align=\"right\">[0-9]*\.?[0-9]*\,[0-9]*/) + "";
      uploadThisMonth = page.match(/<th>Monatssumme<\/th>\s*<th align=\"right\">[0-9]*\.?[0-9]*\,[0-9]*<\/th>\s*<th align="right">[0-9]*\.?[0-9]*\,[0-9]*/) + "";
      dataPerDate = new Array();
      tag = void 0;
      while ((tag = page.match(/<tr class=\"(trbg1|trbg0)\">\s*<td>([0-9]{4}-[0-9]{2}-[0-9]{2})<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<\/tr>/)) != null) {
        page = page.replace(/<tr class=\"(trbg1|trbg0)\">\s*<td>([0-9]{4}-[0-9]{2}-[0-9]{2})<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<td align=\"right\">([0-9]*\.?[0-9]*\,[0-9]*)<\/td>\s*<\/tr>/, "");
        data = new Object();
        data.date = Date.parse(tag[2]);
        data.down = tag[3];
        data.down = data.down.replace(/\./, "");
        data.down = data.down.replace(/,/, ".");
        data.down *= 1;
        data.up = tag[4];
        data.up = data.up.replace(/\./, "");
        data.up = data.up.replace(/,/, ".");
        data.up *= 1;
        data.traffic = tag[5];
        data.traffic = data.traffic.replace(/\./, "");
        data.traffic = data.traffic.replace(/,/, ".");
        data.traffic *= 1;
        dataPerDate.push(data);
      }
      if (trafficPerMonth !== "null") {
        trafficPerMonth = trafficPerMonth.replace(/von /, "") + "";
        trafficPerMonth = trafficPerMonth.replace(RegExp(" MB pro Monat"), "") + "";
        trafficPerMonth = trafficPerMonth * 1;
      }
      if (exp != null) {
        exp = exp + "";
        exp = exp.replace(/Ihr Restguthaben: <strong>\s*/, "") + "";
        exp = exp.replace(RegExp(" MB"), "") + "";
        exp = exp * 1;
      }
      if (downloadThisMonth !== "null") {
        downloadThisMonth = downloadThisMonth.replace(/<th>Monatssumme<\/th>\s*<th align=\"right\">/, "");
        downloadThisMonth = downloadThisMonth.replace(/\./, "");
        downloadThisMonth = downloadThisMonth.replace(/,/, ".");
        downloadThisMonth *= 1;
      } else {
        downloadThisMonth = 0.0;
      }
      if (uploadThisMonth !== "null") {
        uploadThisMonth = uploadThisMonth.replace(/<th>Monatssumme<\/th>\s*<th align=\"right\">[0-9]*\.?[0-9]*\,[0-9]*<\/th>\s*<th align="right">/, "");
        uploadThisMonth = uploadThisMonth.replace(/\./, "");
        uploadThisMonth = uploadThisMonth.replace(/,/, ".");
        uploadThisMonth *= 1;
      } else {
        uploadThisMonth = 0.0;
      }
      data = new Object();
      data.Traffic = exp.toFixed(2) + " MB";
      data.TrafficGBMB = ((exp / 1000).toFixed(2) > 1 ? (exp / 1000).toFixed(2) + " GB" : exp.toFixed(2) + " MB");
      data.TrafficGB = (exp / 1000).toFixed(2) + " GB";
      data.TrafficPM = trafficPerMonth.toFixed(2) + " MB";
      data.TrafficPMraw = trafficPerMonth.toFixed(2);
      data.TrafficPMGB = (trafficPerMonth / 1000).toFixed(2) + " GB";
      data.Down = downloadThisMonth.toFixed(2) + " MB";
      data.DownGB = (downloadThisMonth / 1000).toFixed(2) + " GB";
      data.Up = uploadThisMonth.toFixed(2) + " MB";
      data.UpGB = (uploadThisMonth / 1000).toFixed(2) + " GB";
      data.dataPerDate = dataPerDate;
      $('.traffic_up').append(data.UpGB);
      $('.traffic_down').append(data.DownGB);
      return $('.traffic_total').append(data.TrafficGB);
    });
  };

  buildGermanApp = function() {
    var btnBaseCSS, collapseCssClasses, footerAbout, footerBugs, footerGroup, footerHTML, footerHome, footerSettings, metaClass, theme, ucbBlog, ucbCampusplan, ucbCollapseGroup, ucbCommunity, ucbCommunityGroup, ucbContact, ucbDataCenter, ucbDates, ucbExams, ucbFacebook, ucbGremienallee, ucbHomepage, ucbInternGroup, ucbIntranet, ucbJuris, ucbKneipe, ucbLibrary, ucbMSDNAA, ucbMensa, ucbOLAT, ucbOnCampusGroup, ucbQIS, ucbStaff, ucbStudIP, ucbTimetable, ucbWebMail;
    metaClass = ".ucbPanelButtonGroup";
    btnBaseCSS = "button btn btn-default menuitem-iconic ";
    collapseCssClasses = btnBaseCSS + "ucbpanel_iro collapse_item";
    theme = localStorage["fav_theme"];
    switch (theme) {
      case "flat":
        ucbHomepage = new Link(collapseCssClasses, "icon-globe", "Startseite", "http://www.umwelt-campus.de/ucb/index.php", "[Collapsed] UCB Startseite");
        ucbTimetable = new Link(collapseCssClasses, "icon-calendar", "Stundenplan", "http://www.umwelt-campus.de/ucb/index.php?id=fachbereiche", "[Collapsed] UCB Studenplan");
        ucbDates = new Link(collapseCssClasses, "icon-time", "Zeitplan", "http://www.umwelt-campus.de/ucb/index.php?id=zeitplan", "[Collapsed] UCB Zeitplan");
        ucbCampusplan = new Link(collapseCssClasses, "icon-map-marker", "Campusplan", "http://www.umwelt-campus.de/ucb/fileadmin/layout/ucbplan.pdf", "[Collapsed] UCB Campusplan");
        ucbExams = new Link(collapseCssClasses, "icon-table", "Klausurplan", "http://www.umwelt-campus.de/ucb/index.php?id=klausurplan", "[Collapsed] UCB Klausurplan");
        ucbContact = new Link(collapseCssClasses, "icon-signin", "Contact", "http://ucb-contact.umwelt-campus.de/", "[Collapsed] UCB Contact");
        ucbBlog = new Link(collapseCssClasses, "icon-rss", "Blog", "http://blog.hochschule-trier.de/", "[Collapsed] UCB Blog");
        ucbFacebook = new Link(collapseCssClasses, "icon-facebook", "Facebook-Seite", "https://www.facebook.com/UmweltCampus", "[Collapsed] UCB Facebook");
        ucbStaff = new Link(collapseCssClasses, "icon-group", "Personalverzeichnis", "http://www.umwelt-campus.de/ucb/index.php?id=personalverzeichnis", "[Collapsed] UCB Personalverzeichnis");
        ucbDataCenter = new Link(collapseCssClasses, "icon-laptop", "Rechenzentrum", "http://www.umwelt-campus.de/ucb/index.php?id=rechenzentrum", "[Collapsed] UCB Rechenzentrum");
        ucbMSDNAA = new Link(collapseCssClasses, "icon-windows", "Microsoft-Dreamspark", "https://www.umwelt-campus.de/elms_login.php", "[Collapsed] UCB MSDNAA");
        ucbCommunity = new Link(btnBaseCSS + "ucbpanel_iro", "icon-comments-alt", "Community", "http://community.umwelt-campus.de/index.php", "UCB Community");
        ucbGremienallee = new Link(btnBaseCSS + "ucbpanel_gremienallee", "icon-info", "Gremienallee", "http://www.gremienallee.de", "UCB Gremienallee");
        ucbStudIP = new Link(btnBaseCSS + "ucbpanel_studip", "icon-list-alt", "Stud.IP", "https://studip.fh-trier.de/index.php?again=yes", "UCB Stud.IP");
        ucbWebMail = new Link(btnBaseCSS + "ucbpanel_webmail", "icon-envelope", "Webmail", "https://exchange.umwelt-campus.de", "UCB Webmail");
        ucbQIS = new Link(btnBaseCSS + "ucbpanel_qis", "icon-bar-chart", "QIS", "https://qis.fh-trier.de/qisserver/rds?state=user&type=0", "UCB QIS");
        ucbIntranet = new Link(btnBaseCSS + "ucbpanel_iro", "icon-sitemap", "Intranet", "http://www.umwelt-campus.de/ucb/index.php?id=intern", "UCB Intranet");
        ucbLibrary = new Link(btnBaseCSS + "ucbpanel_bib", "icon-book", "eLibrary", "http://grimm.umwelt-campus.de/", "UCB eLibrary");
        ucbJuris = new Link(btnBaseCSS + "ucbpanel_juris", "icon-legal", "Juris", "http://www.juris.de/jportal/Zugang.jsp", "UCB Juris");
        ucbOLAT = new Link(btnBaseCSS + "ucbpanel_olat", "icon-file-text-alt", "OLAT", "https://olat.vcrp.de", "UCB OLAT");
        ucbMensa = new Link(btnBaseCSS + "ucbpanel_mensa", "icon-food", "Mensa", "http://ucb.li/mensa", "UCB Mensa");
        ucbKneipe = new Link(btnBaseCSS + "ucbpanel_kadu", "icon-beer", "KADU Campus Kneipe", "http://www.umwelt-campus.de/ucb/index.php?id=8163&L=0", "UCB Campus Kneipe");
        break;
      default:
        ucbHomepage = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Startseite", "http://www.umwelt-campus.de/ucb/index.php", "[Collapsed] UCB Startseite");
        ucbCampusplan = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Campusplan", "http://www.umwelt-campus.de/ucb/fileadmin/layout/ucbplan.pdf", "[Collapsed] UCB Campusplan");
        ucbContact = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Contact", "http://ucb-contact.umwelt-campus.de/", "[Collapsed] UCB Contact");
        ucbMSDNAA = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Microsoft-Dreamspark", "https://www.umwelt-campus.de/elms_login.php", "[Collapsed] UCB MSDNAA");
        ucbBlog = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Blog", "http://blog.hochschule-trier.de/", "[Collapsed] UCB Blog");
        ucbFacebook = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Facebook-Seite", "https://www.facebook.com/UmweltCampus", "[Collapsed] UCB Facebook");
        ucbStaff = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Personalverzeichnis", "http://www.umwelt-campus.de/ucb/index.php?id=personalverzeichnis", "[Collapsed] UCB Personalverzeichnis");
        ucbDataCenter = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Rechenzentrum", "http://www.umwelt-campus.de/ucb/index.php?id=rechenzentrum", "[Collapsed] UCB Rechenzentrum");
        ucbExams = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Klausurplan", "http://www.umwelt-campus.de/ucb/index.php?id=klausurplan", "[Collapsed] UCB Klausurplan");
        ucbDates = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Zeitplan", "http://www.umwelt-campus.de/ucb/index.php?id=zeitplan", "[Collapsed] UCB Zeitplan");
        ucbTimetable = new Link(collapseCssClasses, "icon_ucbpanel_iro", "Stundenplan", "http://www.umwelt-campus.de/ucb/index.php?id=fachbereiche", "[Collapsed] UCB Studenplan");
        ucbGremienallee = new Link(btnBaseCSS + "ucbpanel_gremienallee", "icon_ucbpanel_gremienallee", "Gremienallee", "http://www.gremienallee.de", "UCB Gremienallee");
        ucbCommunity = new Link(btnBaseCSS + "ucbpanel_iro", "icon_ucbpanel_community", "Community", "http://community.umwelt-campus.de/index.php", "UCB Community");
        ucbQIS = new Link(btnBaseCSS + "ucbpanel_qis", "icon_ucbpanel_qis", "QIS", "https://qis.fh-trier.de/qisserver/rds?state=user&type=0", "UCB QIS");
        ucbWebMail = new Link(btnBaseCSS + "ucbpanel_webmail", "icon_ucbpanel_webmail", "Webmail", "https://exchange.umwelt-campus.de", "UCB Webmail");
        ucbIntranet = new Link(btnBaseCSS + "ucbpanel_iro", "icon_ucbpanel_intranet", "Intranet", "http://www.umwelt-campus.de/ucb/index.php?id=intern", "UCB Intranet");
        ucbLibrary = new Link(btnBaseCSS + "ucbpanel_bib", "icon_ucbpanel_bib", "eLibrary", "http://grimm.umwelt-campus.de/", "UCB eLibrary");
        ucbStudIP = new Link(btnBaseCSS + "ucbpanel_studip", "icon_ucbpanel_studip", "Stud.IP", "https://studip.fh-trier.de/index.php?again=yes", "UCB Stud.IP");
        ucbJuris = new Link(btnBaseCSS + "ucbpanel_juris", "icon_ucbpanel_juris", "Juris", "http://www.juris.de/jportal/Zugang.jsp", "UCB Juris");
        ucbOLAT = new Link(btnBaseCSS + "ucbpanel_olat", "icon_ucbpanel_olat", "OLAT", "https://olat.vcrp.de", "UCB OLAT");
        ucbMensa = new Link(btnBaseCSS + "ucbpanel_mensa", "icon_ucbpanel_mensa", "Mensa", "http://ucb.li/mensa", "UCB Mensa");
        ucbKneipe = new Link(btnBaseCSS + "ucbpanel_kadu", "icon_ucbpanel_kadu", "KADU Campus Kneipe", "http://www.umwelt-campus.de/ucb/index.php?id=8163&L=0", "UCB Campus Kneipe");
    }
    $(metaClass).append(createCollapseButton("btn btn-default trigger menuitem-iconic", "%COLLAPSE%", "icon_ucbpanel_iro", "Umwelt-Campus"));
    $(metaClass).append('<div class="ucbPanelCollapseContainer"></div>');
    ucbCollapseGroup = [ucbHomepage, ucbTimetable, ucbDates, ucbCampusplan, ucbExams, ucbContact, ucbBlog, ucbFacebook, ucbStaff, ucbDataCenter, ucbMSDNAA];
    addButtonGroup(ucbCollapseGroup, ".ucbPanelCollapseContainer");
    addSpacer(metaClass);
    ucbCommunityGroup = [ucbCommunity, ucbGremienallee];
    addButtonGroup(ucbCommunityGroup, ".ucbPanelButtonGroup");
    addSpacer(metaClass);
    ucbInternGroup = [ucbStudIP, ucbWebMail, ucbQIS, ucbIntranet, ucbLibrary, ucbJuris, ucbOLAT];
    addButtonGroup(ucbInternGroup, ".ucbPanelButtonGroup");
    addSpacer(metaClass);
    ucbOnCampusGroup = [ucbMensa, ucbKneipe];
    addButtonGroup(ucbOnCampusGroup, ".ucbPanelButtonGroup");
    $(metaClass).append(createCollapseButton(btnBaseCSS + "ucbpanel_mensa trigger", "%COLLAPSE%", "icon_ucbpanel_mensa", "Mensa"));
    $(metaClass).append('<div class="ucbPanelCollapseContainer ucbMensaCollapse" id="ucbMensaCollapse"></div>');
    $.get("http://infotv.umwelt-campus.de/mensa/xml/mensa.xml", function(xml) {
      var json;
      json = $.xml2json(xml);
      $('#ucbMensaCollapse').append(json);
      return console.log(json);
    });
    jQuery.ajax({
      url: "http://infotv.umwelt-campus.de/mensa/xml/mensa.xml",
      success: function(xml) {
        return $('.ucbMensaCollapse').waitUntilExists(function(xml) {
          var json;
          json = $.xml2json(xml);
          $('.ucbMensaCollapse').append(json);
          return console.log(json);
        });
      },
      async: false
    });
    $.get("http://traffic.campus-company.eu/", function(page) {
      var TrafficButton, ip_address;
      ip_address = page.match(/Ihre IP-Adresse: 143.93.4[0-2]{1}.[0-9]{1,3}/) + "";
      ip_address = ip_address.replace(/Ihre IP-Adresse: /, "") + "";
      if (ip_address !== "null") {
        addSpacer(metaClass);
        theme = localStorage["fav_theme"];
        switch (theme) {
          case "flat":
            TrafficButton = $('<button class="button btn btn-default menuitem-iconic ucbpanel_traffic" type="button" id="Campus Company Traffic" value="http://traffic.campus-company.eu"><div class="icon-dashboard"></div>Rest-Traffic:&nbsp;<b class="traffic_total"> </b></button>');
            TrafficButton.click(function() {
              return chrome.tabs.create({
                url: "http://traffic.campus-company.eu"
              });
            });
            $(".ucbPanelButtonGroup").append(TrafficButton);
            break;
          default:
            TrafficButton = $('<button class="button ucbpanel_traffic" type="button" id="Campus Company Traffic" value="http://traffic.campus-company.eu"></button>');
            TrafficButton.click(function() {
              return chrome.tabs.create({
                url: "http://traffic.campus-company.eu"
              });
            });
            $(".ucbPanelButtonGroup").append(TrafficButton);
            $(".ucbPanelButtonGroup").append('<div class="TrafficDisplay"></div>');
            $(".TrafficDisplay").append('<div class="TrafficLeftSide"></div>');
            $(".TrafficDisplay").append('<div class="TrafficRightSide"></div>');
            $(".TrafficLeftSide").append('<p class="traffic_down" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-circle-arrow-down"></span> </p>');
            $(".TrafficLeftSide").append('<p class="traffic_up" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-circle-arrow-up"></span> </p>');
            $(".TrafficRightSide").append('<p class="traffic_total" type="button" id="Campus Company Traffic"><span class="glyphicon glyphicon-sort"></span> </p>');
        }
        return getTrafficAndPrint();
      }
    });
    footerHTML = $('\
		<div class="btn-group-wrap" >\
			<div class="btn-group center FooterInnerClass" >\
			</div >\
		</div >\
	');
    $(".ucbPanelFooter").append(footerHTML);
    footerHome = new Link("btn btn-default", "glyphicon glyphicon-home", "Homepage", "http://ucb.we-develop.de", "[Footer] Hompage");
    footerAbout = new Link("btn btn-default", "glyphicon glyphicon-question-sign", "Über das UCB-Panel", "http://ucb.we-develop.de/node/5", "[Footer] About");
    footerBugs = new Link("btn btn-default", "glyphicon glyphicon-bullhorn", "Melde einen Bug oder Wunsch", "http://ucb.we-develop.de/contact", "[Footer] Bugs");
    footerSettings = new Link("btn btn-default", "glyphicon glyphicon-cog", "Einstellungen", "options.html", "[Footer] Settings");
    footerGroup = [footerHome, footerAbout, footerBugs, footerSettings];
    return addButtonGroup(footerGroup, ".FooterInnerClass", true);
  };

  buildEnglishApp = function() {};

  buildView = function() {
    var locale;
    $(".ucbMainPanel").append("<div class=\"ucbPanelButtonGroup\"></div>");
    locale = window.navigator.language;
    switch (locale) {
      case "de":
        return buildGermanApp();
      case "en":
        return buildEnglishApp();
      default:
        return buildEnglishApp();
    }
  };

  main = function() {
    var trig;
    buildView();
    $(".trigger").not(".trigger_active").next(".ucbPanelCollapseContainer").hide();
    trig = $(this);
    if (!trig.hasClass("trigger_active")) {
      $(".icon_arrow").css("background-image", "url(images/arrow_down.gif)");
    }
    $('.ucbMainPanel').slimScroll({
      height: '502px',
      color: '#666',
      size: '5px',
      alwaysVisible: true
    });
    $("#footer").tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    });
    return $("#footer").tooltip();
  };

  main();

}).call(this);
