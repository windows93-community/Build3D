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


var namecolor={aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkgrey:"#a9a9a9",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkslategrey:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dimgrey:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",goldenrod:"#daa520",gold:"#ffd700",gray:"#808080",green:"#008000",greenyellow:"#adff2f",grey:"#808080",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavenderblush:"#fff0f5",lavender:"#e6e6fa",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightslategrey:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",rebeccapurple:"#663399",red:"#ff0000",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",slategrey:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"};
