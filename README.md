UCB-Panel
====================

## Über die Extension
Die Google Chrome Extension des Umwelt Campus Birkenfeld (UCB).
Dies ist ein Projekt welches auf der Arbeit von super_stein basiert, welcher eine Erweiterung für den Firefox programmiert hat.
Dieses Projekt wird von Studenten des UCBs erstellt und ist kein offizielles Projekt des UCBs.

Entwickler: <br>
- Niklas Heer<br>
- Tad Wohlrapp<br>
- Christian Schönemann (Mensa-Plan API)

Offizielle Homepage: **[http://ucb.we-develop.de](http://ucb.we-develop.de)**

Verwendete Software für das Projekt:

- [nodejs](http://nodejs.org/)
- [grunt](http://gruntjs.com/)
- [coffeescript](http://coffeescript.org/)
- [compass](http://compass-style.org/)
- [bootstrap](http://getbootstrap.com/)
- [underscorejs](http://underscorejs.org/)
- [Font Awesome](http://fontawesome.io/)
- [jQuery](http://jquery.com/)
- [jQuery rloader](https://code.google.com/p/rloader/)
- [jQuery dateFormat](https://github.com/phstc/jquery-dateFormat)
- [jQuery slimScroll](http://rocha.la/jQuery-slimScroll)
- [jQuery xml2json](https://github.com/josefvanniekerk/jQuery-xml2json)

## Mitwirken
Jeder ist herzlich eingeladen an der Extension mit zu wirken.<br>
Um die nötige Software zu installieren solltet ihr den unten beschriebenen Schritten folgen.<br>
Falls ihr Fragen habt einfach eine Mail an ```niklas.heer@me.com```!<br>

[nodejs](http://nodejs.org/) installieren und danach folgende Befehle im Terminal ausführen:<br>
```bash
sudo npm install -g coffee-script
sudo npm install -g grunt
sudo npm install -g grunt-cli
```
Danach sollte der Befehl ```grunt --version``` funktionieren.<br>
Jetzt navigiert ihr im Terminal zum Verzeichnis der Extension und geht in den Ordner "UCB-Panel". Dort einfach den Befehl ```grunt``` eingeben und nun könnt ihr alle ```.coffee``` und ```.scss``` Dateien bearbeiten und sie werden automatisch kompiliert. Wenn ihr fertig seid, könnt ihr mit ```Strg+C``` den Prozess beenden.<br>
Um erneut am Projekt zu arbeiten müsst ihr wie oben beschrieben Grunt wieder starten.

Nun solltet ihr noch SASS und Compass installieren.
- [SASS installieren](http://sass-lang.com/install)
- [Compass installieren](http://compass-style.org/install/)


## Lizenz
Die Extension steht unter der **_[GNU General Public License (GPL 3.0)](http://www.gnu.org/licenses/gpl-3.0.html)_** mit Ausnahme folgender Werke (sie unterliegen den jeweiligen Lizenzen der Rechteinhaber):

- **_law icon_** von [Yusuke Kamiyamane](http://p.yusukekamiyamane.com/) `(UCB-Panel/images/law.png)`
- **_check icon_** von [Double-J designs](http://www.doublejdesign.co.uk/) `(UCB-Panel/fireworks/okay.png)`
- **_government icon_** von [Mihaiciuc Bogdan](http://bogo-d.deviantart.com/) `(UCB-Panel/images/gremienallee.png)`
- **_food icon_** von [Yusuke Kamiyamane](http://p.yusukekamiyamane.com/) `(UCB-Panel/images/food.png)`
- **_beer icon_** von [Yusuke Kamiyamane](http://p.yusukekamiyamane.com/) `(UCB-Panel/images/beer.png)`
- **_traffic light icon_** von [Double-J designs](http://www.doublejdesign.co.uk/) `(UCB-Panel/images/traffic.png)`
- **_chart icon_** von [Double-J designs](http://www.doublejdesign.co.uk/) `(UCB-Panel/images/chart.png)`
- aller Werke in `vendors`