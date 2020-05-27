var picker = {

  mouse: {down: false, x: 0, y: 0},

  hue: 0,
  slx: 0,
  sly: 0,

  cpsl: document.querySelector('#cpsl'),
  cphue: document.querySelector('#cphue'),
  slpick: document.querySelector('#slpick'),
  huepick: document.querySelector('#huepick'),

  mousein: '',

  display: function() {
    this.cpsl.style.backgroundColor = 'hsl(' + this.hue + ',100%,50%)';
    this.huepick.style.top = (this.hue * 0.55555 - 2) + 'px';
    this.slpick.style.left = (this.slx * 2 - 4) + 'px';
    this.slpick.style.top = ((100 - this.sly) * 2 - 4) + 'px';

    if(typeof this.onchange == 'function') this.onchange(this.hue, this.slx, this.sly);
  },

  setTo(r, g, b) {
      r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }
    this.hue = h;
    this.slx = s;
    this.sly = v;
    this.display();
  },

  color() {
    var r, g, b, i, f, p, q, t, h = this.hue * 1/360, s = this.slx * 0.01, v = this.sly * 0.01;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return 'rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')';
    return "#" + ((1 << 24) + (Math.round(r * 255) << 16) + (Math.round(r * 255) << 8) + Math.round(r * 255)).toString(16).slice(1);
  },

  mousemove() {
    if(!this.mouse.down) return;
    var brsl = picker.cpsl.getBoundingClientRect(), brhue = picker.cphue.getBoundingClientRect();
    if(this.mousein == 'sl') {
      this.slx = Math.min(Math.max(0.5 * (picker.mouse.x - brsl.left), 0), 100);
      this.sly = Math.min(Math.max(0.5 * (200 + brsl.top - picker.mouse.y), 0), 100);
      this.display();
    }
    if(this.mousein == 'hue') {
      this.hue = Math.min(Math.max(1.8 * (picker.mouse.y - brhue.top), 0), 360);
      this.display();
    }
  }
}

picker.display();

document.addEventListener('mouseup', e => {
  picker.mouse.down = false;
});

document.addEventListener('mousedown', e => {
  picker.mouse.down = true;
  var brsl = picker.cpsl.getBoundingClientRect(), brhue = picker.cphue.getBoundingClientRect();
  if(picker.mouse.x > brsl.left && picker.mouse.y > brsl.top && picker.mouse.x < brsl.right && picker.mouse.y < brsl.bottom)
    picker.mousein = 'sl';
  else if(picker.mouse.x > brhue.left && picker.mouse.y > brhue.top && picker.mouse.x < brhue.right && picker.mouse.y < brhue.bottom)
    picker.mousein = 'hue';
  else
    picker.mousein = '';
  picker.mousemove();
});

document.addEventListener('mousemove', e => {
  picker.mouse.x = e.pageX;
  picker.mouse.y = e.pageY;
  picker.mousemove();
  e.preventDefault();
});

var selected_slot = 1;

var slot_colors = ['', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#000000', '#FF00FF']

function select_slot(s) {
  for(var i = 1; i <= 8; i++) {
    document.getElementById('c' + i).style.outline = 'none';
  }
  document.getElementById('c' + s).style.outline = '1px dashed';
  selected_slot = s;
  picker.setTo(Number('0x' + slot_colors[s].substr(1, 2)), Number('0x' + slot_colors[s].substr(3, 2)), Number('0x' + slot_colors[s].substr(5, 2)));
}

picker.onchange = function() {
  tile_color3d = picker.color();
}
