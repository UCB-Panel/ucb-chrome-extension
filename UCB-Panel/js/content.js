(function() {
  var Link, addButtonGroup, addSpacer, buildView, createButton, createCollapseButton, createFooterButton, getFoodAndPrice, getMensaAndPrint, getTrafficAndPrint, locale, main, _CONTENT, _THEMES;

  Link = (function() {
    function Link(name, classes, id) {
      this.name = name;
      this.classes = classes;
      this.id = id;
    }

    return Link;

  })();

  locale = window.navigator.language;

  _CONTENT = $.parseJSON($.ajax({
    url: "_locales/" + locale + "/data.json",
    async: false,
    dataType: 'json'
  }).responseText).PanelContent;

  _THEMES = $.parseJSON($.ajax({
    url: "themes/" + localStorage["fav_theme"] + ".json",
    async: false,
    dataType: 'json'
  }).responseText);

  createButton = function(Obj) {
    var button;
    button = $('<button class="' + Obj.classes + '" type="button" id="' + Obj.id + '"><div class="' + _THEMES.icons[Obj.name] + '"></div>' + _CONTENT[Obj.name].name + '</button><br>');
    return button.click(function() {
      return chrome.tabs.create({
        url: _CONTENT[Obj.name].link
      });
    });
  };

  createFooterButton = function(Obj) {
    var button;
    button = $('<button class="' + Obj.classes + '" type="button" id="' + Obj.id + '" data-toggle="tooltip" data-placement="top" title=""' + ' data-original-title="' + _CONTENT[Obj.name].name + '" >' + '<i class="' + _THEMES.icons[Obj.name] + '"></i >' + '</button>');
    return button.click(function() {
      return chrome.tabs.create({
        url: _CONTENT[Obj.name].link
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
          arrow = trig.find('.arrow');
          arrow.removeClass('icon-angle-up');
          arrow.addClass('icon-angle-down');
        } else {
          trig.find(".icon_arrow").css("background-image", "url(images/arrow_down.gif)");
        }
        trig.next(".ucbPanelCollapseContainer").slideToggle(300);
        return trig.removeClass("trigger_active");
      } else {
        trig.find(".trigger_active").next(".ucbPanelCollapseContainer").slideToggle(300);
        trig.find(".trigger_active").removeClass("trigger_active");
        if (theme === "flat") {
          arrow = trig.find('.arrow');
          arrow.removeClass('icon-angle-down');
          arrow.addClass('icon-angle-up');
        } else {
          trig.find(".icon_arrow").css("background-image", "url(images/arrow_up.gif)");
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
      var matcher, r, result, rule, rules;
      rules = [
        {
          name: "credit",
          regex: /von\s*(\d*)\sMB\spro\sMonat/,
          group: 1,
          def: "NotFound",
          fixNumber: false,
          toFixed: 2,
          divideBy: 1000,
          unit: "GB"
        }, {
          name: "remaining",
          regex: /Ihr\s*Restguthaben:\s*<strong>\s*(\d*\.\d*)\s*MB/,
          group: 1,
          def: "NotFound",
          fixNumber: false,
          toFixed: 2,
          divideBy: 1000,
          unit: "GB"
        }, {
          name: "upload",
          regex: /<th>Monatssumme<\/th>\s*<th align=\"right\">((\d*\.)*\d*\,\d*)/,
          group: 1,
          def: "NotFound",
          fixNumber: true,
          toFixed: 2,
          divideBy: 1000,
          unit: "GB"
        }, {
          name: "download",
          regex: /<th>Monatssumme<\/th>\s*<th align=\"right\">(\d*\.)*\d*\,\d*<\/th>\s*<th align="right">((\d*\.)*\d*\,\d*)/,
          group: 2,
          def: "NotFound",
          fixNumber: true,
          toFixed: 2,
          divideBy: 1000,
          unit: "GB"
        }
      ];
      page = page.replace(/.*<body>/, "");
      page = page.replace(/<div[^>]*>.*/, "");
      result = new Object();
      for (r in rules) {
        rule = rules[r];
        matcher = page.match(rule.regex);
        if (matcher != null) {
          result[rule.name] = matcher[rule.group];
          if (rule.fixNumber !== undefined && rule.fixNumber) {
            result[rule.name] = result[rule.name].replace(/\./, "");
            result[rule.name] = result[rule.name].replace(/\,/, ".");
          }
          if (rule.divideBy !== undefined) {
            result[rule.name] /= rule.divideBy;
          }
          if (rule.toFixed !== undefined) {
            result[rule.name] = parseFloat(result[rule.name]).toFixed(rule.toFixed);
          }
          if (rule.unit !== undefined) {
            result[rule.name] += " " + rule.unit;
          }
        } else {
          result[rule.name] = rule.def;
        }
      }
      $(".traffic_up").append(result.upload);
      $(".traffic_down").append(result.download);
      return $(".traffic_total").append(result.remaining);
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
    output += '<p class="price">Preis: ' + money[0] + ' &#185; / ' + money[1] + ' &#178;</p>';
    return output;
  };

  getMensaAndPrint = function() {
    return $.get("http://infotv.umwelt-campus.de/mensa/xml/mensa.xml", function(xml) {
      var datum, gefunden, i, json;
      json = $.xml2json(xml);
      $('.ucbMensaCollapse').click(function() {
        return chrome.tabs.create({
          url: "http://ucb.li/mensa"
        });
      });
      datum = $.format.date(new Date(), 'dd.MM.yyyy');
      i = 0;
      gefunden = false;
      return _.each(json.tag, function(tag) {
        i++;
        if (tag.datum === datum) {
          gefunden = true;
          if (tag.stammessen.match("Feiertag")) {
            return $('.ucbMensaCollapse').append('<div class="collapse_item noFood"><span class="glyphicon glyphicon-ban-circle"></span></i> Heute ist ein Feiertag!</div>');
          } else {
            $('.ucbMensaCollapse').append('<div class="collapse_item stammessen"><p class="heading">Stammessen:</p>' + getFoodAndPrice(tag.stammessen) + '</div>');
            $('.ucbMensaCollapse').append('<div class="collapse_item vegetarisch"><p class="heading">Vegetarisch:</p>' + getFoodAndPrice(tag.vegetarisch) + '</div>');
            $('.ucbMensaCollapse').append('<div class="collapse_item komponentenessen"><p class="heading">Komponentenessen:</p>' + getFoodAndPrice(tag.komponentenessen, true) + '</div>');
            return $('.ucbMensaCollapse').append('<div class="info">&#185; für Studierende<br>&#178; für Gäste</p>');
          }
        } else {
          if (i >= 5 && !gefunden) {
            return $('.ucbMensaCollapse').append('<div class="collapse_item noFood"><span class="glyphicon glyphicon-ban-circle"></span></i> Keine Essen gefunden.</div>');
          }
        }
      });
    });
  };

  buildView = function() {
    var btnBaseCSS, collapseCssClasses, footerAbout, footerBugs, footerGroup, footerHTML, footerHome, footerSettings, metaClass, ucbBlog, ucbCampusplan, ucbCollapseGroup, ucbCommunity, ucbCommunityGroup, ucbContact, ucbDataCenter, ucbDates, ucbExams, ucbFacebook, ucbGremienallee, ucbHomepage, ucbInternGroup, ucbIntranet, ucbJuris, ucbKneipe, ucbLibrary, ucbMSDNAA, ucbMensa, ucbOLAT, ucbOnCampusGroup, ucbQIS, ucbStaff, ucbStudIP, ucbTimetable, ucbWebMail;
    $(".ucbMainPanel").append("<div class=\"ucbPanelButtonGroup\"></div>");
    metaClass = ".ucbPanelButtonGroup";
    btnBaseCSS = "button btn btn-default menuitem-iconic ";
    collapseCssClasses = btnBaseCSS + "ucbpanel_iro collapse_item";
    ucbHomepage = new Link("ucbHomepage", collapseCssClasses, "[Collapsed] UCB Startseite");
    ucbTimetable = new Link("ucbTimetable", collapseCssClasses, "[Collapsed] UCB Studenplan");
    ucbDates = new Link("ucbDates", collapseCssClasses, "[Collapsed] UCB Zeitplan");
    ucbCampusplan = new Link("ucbCampusplan", collapseCssClasses, "[Collapsed] UCB Campusplan");
    ucbExams = new Link("ucbExams", collapseCssClasses, "[Collapsed] UCB Klausurplan");
    ucbContact = new Link("ucbContact", collapseCssClasses, "[Collapsed] UCB Contact");
    ucbBlog = new Link("ucbBlog", collapseCssClasses, "[Collapsed] UCB Blog");
    ucbFacebook = new Link("ucbFacebook", collapseCssClasses, "[Collapsed] UCB Facebook");
    ucbStaff = new Link("ucbStaff", collapseCssClasses, "[Collapsed] UCB Personalverzeichnis");
    ucbDataCenter = new Link("ucbDataCenter", collapseCssClasses, "[Collapsed] UCB Rechenzentrum");
    ucbMSDNAA = new Link("ucbMSDNAA", collapseCssClasses, "[Collapsed] UCB MSDNAA");
    ucbCommunity = new Link("ucbCommunity", btnBaseCSS + "ucbpanel_iro", "UCB Community");
    ucbGremienallee = new Link("ucbGremienallee", btnBaseCSS + "ucbpanel_gremienallee", "UCB Gremienallee");
    ucbStudIP = new Link("ucbStudIP", btnBaseCSS + "ucbpanel_studip", "UCB Stud.IP");
    ucbWebMail = new Link("ucbWebMail", btnBaseCSS + "ucbpanel_webmail", "UCB Webmail");
    ucbQIS = new Link("ucbQIS", btnBaseCSS + "ucbpanel_qis", "UCB QIS");
    ucbIntranet = new Link("ucbIntranet", btnBaseCSS + "ucbpanel_iro", "UCB Intranet");
    ucbLibrary = new Link("ucbLibrary", btnBaseCSS + "ucbpanel_bib", "UCB eLibrary");
    ucbJuris = new Link("ucbJuris", btnBaseCSS + "ucbpanel_juris", "UCB Juris");
    ucbOLAT = new Link("ucbOLAT", btnBaseCSS + "ucbpanel_olat", "UCB OLAT");
    ucbMensa = new Link("ucbMensa", btnBaseCSS + "ucbpanel_mensa", "UCB Mensa");
    ucbKneipe = new Link("ucbKneipe", btnBaseCSS + "ucbpanel_kadu", "UCB Campus Kneipe");
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
    $(metaClass).append(createCollapseButton(btnBaseCSS + "ucbpanel_mensa trigger", "%COLLAPSE%", _THEMES.icons["ucbMensa"], "Mensa"));
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
    footerHome = new Link("footerHome", "btn btn-default", "[Footer] Hompage");
    footerAbout = new Link("footerAbout", "btn btn-default", "[Footer] About");
    footerBugs = new Link("footerBugs", "btn btn-default", "[Footer] Bugs");
    footerSettings = new Link("footerSettings", "btn btn-default", "[Footer] Settings");
    footerGroup = [footerHome, footerAbout, footerBugs, footerSettings];
    return addButtonGroup(footerGroup, ".FooterInnerClass", true);
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
