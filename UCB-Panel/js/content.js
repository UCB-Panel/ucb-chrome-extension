(function() {
  var FooterLink, Link, addButtonGroup, addSpacer, buildEnglishApp, buildGermanApp, buildView, createButton, createCollapseButton, createFooterButton, getFoodAndPrice, getMensaAndPrint, getTrafficAndPrint, main, mensaPlan, theme_config;

  Link = (function() {
    function Link(name, classes, text, value, id) {
      this.name = name;
      this.classes = classes;
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

  theme_config = $.parseJSON($.ajax({
    url: "themes/" + localStorage["fav_theme"] + ".json",
    async: false,
    dataType: 'json'
  }).responseText);

  createButton = function(contentObj) {
    var button;
    button = $('<button class="' + contentObj.classes + '" type="button" id="' + contentObj.id + '" value="' + contentObj.value + '"><div class="' + theme_config.icons[contentObj.name] + '"></div>' + contentObj.text + '</button><br>');
    return button.click(function() {
      return chrome.tabs.create({
        url: contentObj.value
      });
    });
  };

  createFooterButton = function(Obj) {
    var button;
    button = $('<button class="' + Obj.classes + '" type="button" id="' + Obj.id + '" value="' + Obj.value + '" data-toggle="tooltip" data-placement="top" title=""' + ' data-original-title="' + Obj.text + '" >' + '<i class="' + theme_config.icons[Obj.name] + '"></i >' + '</button>');
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

  getFoodAndPrice = function(input, isKomponentenEssen) {
    var money, output, regexHTML, regexMoney, result;
    regexHTML = /(<([^>]+)>)/ig;
    result = input.replace(regexHTML, "");
    regexMoney = /(?:[0-9]*(?:[.,][0-9]{2})?|(?:,[0-9]{3})*(?:\.[0-9]{2})?|(?:\.[0-9]{3})*(?:,[0-9]{2})?)[€]/g;
    money = result.match(regexMoney);
    output = result.replace(regexMoney, "");
    output = output.replace("/", "");
    if (money == null) {
      if (isKomponentenEssen) {
        money = ["2,25€", "3,65€"];
      } else {
        money = ["2,30€", "4,35€"];
      }
    }
    output += "<br>Preis: " + money[0] + " / " + money[1];
    return output;
  };

  getMensaAndPrint = function() {
    return $.get("http://infotv.umwelt-campus.de/mensa/xml/mensa.xml", function(xml) {
      var datum, json;
      json = $.xml2json(xml);
      datum = $.format.date(new Date(), 'dd.MM.yyyy');
      return _.each(json.tag, function(tag) {
        if (tag.datum === datum) {
          $('.ucbMensaCollapse').append('<p><b>Stammessen:</b><br>' + getFoodAndPrice(tag.stammessen) + '</p>');
          $('.ucbMensaCollapse').append('<p><b>Vegetarisch:</b><br>' + getFoodAndPrice(tag.vegetarisch) + '</p>');
          return $('.ucbMensaCollapse').append('<p><b>Komponentenessen:</b><br>' + getFoodAndPrice(tag.komponentenessen, true) + '</p>');
        }
      });
    });
  };

  buildGermanApp = function() {
    var btnBaseCSS, collapseCssClasses, footerAbout, footerBugs, footerGroup, footerHTML, footerHome, footerSettings, metaClass, ucbBlog, ucbCampusplan, ucbCollapseGroup, ucbCommunity, ucbCommunityGroup, ucbContact, ucbDataCenter, ucbDates, ucbExams, ucbFacebook, ucbGremienallee, ucbHomepage, ucbInternGroup, ucbIntranet, ucbJuris, ucbKneipe, ucbLibrary, ucbMSDNAA, ucbMensa, ucbOLAT, ucbOnCampusGroup, ucbQIS, ucbStaff, ucbStudIP, ucbTimetable, ucbWebMail;
    metaClass = ".ucbPanelButtonGroup";
    btnBaseCSS = "button btn btn-default menuitem-iconic ";
    collapseCssClasses = btnBaseCSS + "ucbpanel_iro collapse_item";
    ucbHomepage = new Link("ucbHomepage", collapseCssClasses, "Startseite", "http://www.umwelt-campus.de/ucb/index.php", "[Collapsed] UCB Startseite");
    ucbTimetable = new Link("ucbTimetable", collapseCssClasses, "Stundenplan", "http://www.umwelt-campus.de/ucb/index.php?id=fachbereiche", "[Collapsed] UCB Studenplan");
    ucbDates = new Link("ucbDates", collapseCssClasses, "Zeitplan", "http://www.umwelt-campus.de/ucb/index.php?id=zeitplan", "[Collapsed] UCB Zeitplan");
    ucbCampusplan = new Link("ucbCampusplan", collapseCssClasses, "Campusplan", "http://www.umwelt-campus.de/ucb/fileadmin/layout/ucbplan.pdf", "[Collapsed] UCB Campusplan");
    ucbExams = new Link("ucbExams", collapseCssClasses, "Klausurplan", "http://www.umwelt-campus.de/ucb/index.php?id=klausurplan", "[Collapsed] UCB Klausurplan");
    ucbContact = new Link("ucbContact", collapseCssClasses, "Contact", "http://ucb-contact.umwelt-campus.de/", "[Collapsed] UCB Contact");
    ucbBlog = new Link("ucbBlog", collapseCssClasses, "Blog", "http://blog.hochschule-trier.de/", "[Collapsed] UCB Blog");
    ucbFacebook = new Link("ucbFacebook", collapseCssClasses, "Facebook-Seite", "https://www.facebook.com/UmweltCampus", "[Collapsed] UCB Facebook");
    ucbStaff = new Link("ucbStaff", collapseCssClasses, "Personalverzeichnis", "http://www.umwelt-campus.de/ucb/index.php?id=personalverzeichnis", "[Collapsed] UCB Personalverzeichnis");
    ucbDataCenter = new Link("ucbDataCenter", collapseCssClasses, "Rechenzentrum", "http://www.umwelt-campus.de/ucb/index.php?id=rechenzentrum", "[Collapsed] UCB Rechenzentrum");
    ucbMSDNAA = new Link("ucbMSDNAA", collapseCssClasses, "Microsoft-Dreamspark", "https://www.umwelt-campus.de/elms_login.php", "[Collapsed] UCB MSDNAA");
    ucbCommunity = new Link("ucbCommunity", btnBaseCSS + "ucbpanel_iro", "Community", "http://community.umwelt-campus.de/index.php", "UCB Community");
    ucbGremienallee = new Link("ucbGremienallee", btnBaseCSS + "ucbpanel_gremienallee", "Gremienallee", "http://www.gremienallee.de", "UCB Gremienallee");
    ucbStudIP = new Link("ucbStudIP", btnBaseCSS + "ucbpanel_studip", "Stud.IP", "https://studip.fh-trier.de/index.php?again=yes", "UCB Stud.IP");
    ucbWebMail = new Link("ucbWebMail", btnBaseCSS + "ucbpanel_webmail", "Webmail", "https://exchange.umwelt-campus.de", "UCB Webmail");
    ucbQIS = new Link("ucbQIS", btnBaseCSS + "ucbpanel_qis", "QIS", "https://qis.fh-trier.de/qisserver/rds?state=user&type=0", "UCB QIS");
    ucbIntranet = new Link("ucbIntranet", btnBaseCSS + "ucbpanel_iro", "Intranet", "http://www.umwelt-campus.de/ucb/index.php?id=intern", "UCB Intranet");
    ucbLibrary = new Link("ucbLibrary", btnBaseCSS + "ucbpanel_bib", "eLibrary", "http://grimm.umwelt-campus.de/", "UCB eLibrary");
    ucbJuris = new Link("ucbJuris", btnBaseCSS + "ucbpanel_juris", "Juris", "http://www.juris.de/jportal/Zugang.jsp", "UCB Juris");
    ucbOLAT = new Link("ucbOLAT", btnBaseCSS + "ucbpanel_olat", "OLAT", "https://olat.vcrp.de", "UCB OLAT");
    ucbMensa = new Link("ucbMensa", btnBaseCSS + "ucbpanel_mensa", "Mensa", "http://ucb.li/mensa", "UCB Mensa");
    ucbKneipe = new Link("ucbKneipe", btnBaseCSS + "ucbpanel_kadu", "KADU Campus Kneipe", "http://www.umwelt-campus.de/ucb/index.php?id=8163&L=0", "UCB Campus Kneipe");
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
    ucbOnCampusGroup = [ucbKneipe];
    addButtonGroup(ucbOnCampusGroup, ".ucbPanelButtonGroup");
    $(metaClass).append(createCollapseButton(btnBaseCSS + "ucbpanel_mensa trigger", "%COLLAPSE%", theme_config.icons["ucbMensa"], "Mensa"));
    $(metaClass).append('<div class="ucbPanelCollapseContainer ucbMensaCollapse" id="ucbMensaCollapse"></div>');
    getMensaAndPrint();
    $.get("http://traffic.campus-company.eu/", function(page) {
      var TrafficButton, ip_address, theme;
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
    footerHome = new Link("footerHome", "btn btn-default", "Homepage", "http://ucb.we-develop.de", "[Footer] Hompage");
    footerAbout = new Link("footerAbout", "btn btn-default", "Über das UCB-Panel", "http://ucb.we-develop.de/node/5", "[Footer] About");
    footerBugs = new Link("footerBugs", "btn btn-default", "Melde einen Bug oder Wunsch", "https://github.com/niklas-heer/ucb-chrome-extension/issues?state=open", "[Footer] Bugs");
    footerSettings = new Link("footerSettings", "btn btn-default", "Einstellungen", "options.html", "[Footer] Settings");
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
