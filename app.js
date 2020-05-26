setInterval(update3DB, 10);
loadMap(map);

var conf = {};

parent.$db.getRaw('etc/3DBuilder/config', function(idk, data) {
  if(typeof data == "string") {
    conf = JSON.parse(data);
    document.getElementById('mouse').value = MOUSE_SENSITIVITY = conf.mouse;
  } else {
    conf = {mouse: 10};
  }
});

function update_config() {
  parent.$db.set('etc/3DBuilder/config', JSON.stringify(conf));
}

document.getElementById('dist').oninput = function(e) {

  camera.dist = Number(e.target.value);
}
document.getElementById('ypos').oninput = function(e) {

  camera.top = Number(e.target.value);
}
document.getElementById('mouse').oninput = function(e) {

  conf.mouse = MOUSE_SENSITIVITY = Number(e.target.value); update_config();
}

document.getElementById('save').onclick = function() {
  parent.$prompt("Enter desired filename, then select folder where you want it saved.", function(a, fname) {
    if(!a) return;
    parent.$explorer('a/etc/3DBuilder/models/', {browse: true, explorer: true, onclose: function(ok, file) {
      if (ok) {
        var rd = '';
        for(var i = 0; i < 4096; i++) rd += String.fromCharCode((map[i] >> 24) & 255) +  String.fromCharCode((map[i] >> 16) & 255) +  String.fromCharCode((map[i] >> 8) & 255) +  String.fromCharCode((map[i]) & 255);
        parent.$db.set((file + fname).split('/').slice(1).filter(x => x!='').join('/'), rd);
        setTimeout(parent.$explorer.refresh, 500);
      }
    }});
  });
}
document.getElementById('open').onclick = function() {
  parent.$explorer('a/etc/3DBuilder/models/', {browse: true, explorer: true, onclose: function(ok, file) {
if (ok) {
  parent.$db.getRaw(file.slice(3), async function(a, rd) {
      for(var i = 0; i < 4096; i++) {
             map[i] = (rd.charAt(i * 4) << 24) | (rd.charCodeAt(i * 4 + 1) << 16)  | (rd.charCodeAt(i * 4 + 2) << 8)  | rd.charCodeAt(i * 4 + 3);
          }
          loadMap(map);
    });
  }
}});
}
document.getElementById('plain').onclick = function() {

    for(var i = 0; i < 32768; i++) map[i] = EMPTY;
  for(var i = 0; i < 16; i++) for(var j = 0; j < 16; j++) map[getPos(i, 0, j)] = 255 << 8;
    loadMap(map);
}
document.getElementById('void').onclick = function() {

    for(var i = 0; i < 32768; i++) map[i] = EMPTY;
  for(var i = 8; i < 10; i++) for(var j = 8; j < 10; j++) map[getPos(i, 0, j)] = 255 << 8;
    loadMap(map);
}
document.getElementById('color').onclick = function() {

    parent.$prompt("Enter color code below, if you don't know what you're doing click cancel", function(ok, text) {
      if(ok) try { tile_color3d = getColor(text); } catch(er) { parent.$alert.error("You didn't know what you were doing!") }
    });
}
document.getElementById('help').onclick = _=>parent.$alert('<a href="https://github.com/windows93-community/Build3D/blob/master/help.md"> Help page on github </a>');
