/*>>> FAXMACHINE <<<*/

function download_resource(theUrl) {
  return new Promise(resolve => {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      resolve(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
  });
}

/* create files and folders */

var app_html = await download_resurce("https://raw.githack.com/windows93-community/Build3D/master/app.html");
var app_init = await download_resource("https://raw.githack.com/windows93-community/Build3D/master/app_init.js");

$db.set("etc/3DBuilder/models/README.txt", "You can save your models here.");
$db.set("etc/3DBuilder/app.html", app_html);
$db.set("boot/Build3D_init.js", app_init);
localStorage.setItem('desktop/Build3D.lnk42', '{"exe":"Build3D"}');

$alert("Press OK to restart.", function() {$exe("reboot")})
