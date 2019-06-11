var jsonData = [
    {"amount": 3, "index": 5,  "required": "y", "name": "shape"},
    {"amount": 3, "index": 9,  "required": "y", "name": "eyebrows"},
    {"amount": 3, "index": 10, "required": "y", "name": "eyes"},
    {"amount": 3, "index": 8,  "required": "y", "name": "nose"},
    {"amount": 3, "index": 7,  "required": "y", "name": "mouth"},
    {"amount": 3, "index": 4,  "required": "y", "name": "ears"},
    {"amount": 6, "index": 13, "required": "n", "name": "hair / hat"},
    {"amount": 4, "index": 12, "required": "n", "name": "beard"},
    {"amount": 3, "index": 6,  "required": "n", "name": "miscellanies"},
    {"amount": 4, "index": 11, "required": "n", "name": "glasses"},
    {"amount": 3, "index": 2,  "required": "n", "name": "necklace"},
    {"amount": 4, "index": 1,  "required": "y", "name": "shirt"},
    {"amount": 3, "index": 3,  "required": "n", "name": "jacket"},
    {"amount": 6, "index": 14, "required": "n", "name": "gadget"},
    {"amount": 9, "index": 0,  "required": "n", "name": "background"}
];

// var jsonData = '[{"amount":3,"index":5,"required":"y","name":"shape"},{"amount":3,"index":9,"required":"y","name":"eyebrows"},{"amount":3,"index":10,"required":"y","name":"eyes"},{"amount":3,"index":8,"required":"y","name":"nose"},{"amount":3,"index":7,"required":"y","name":"mouth"},{"amount":3,"index":4,"required":"y","name":"ears"},{"amount":6,"index":13,"required":"n","name":"hair / hat"},{"amount":4,"index":12,"required":"n","name":"beard"},{"amount":3,"index":6,"required":"n","name":"miscellanies"},{"amount":4,"index":11,"required":"n","name":"glasses"},{"amount":3,"index":2,"required":"n","name":"necklace"},{"amount":4,"index":1,"required":"y","name":"shirt"},{"amount":3,"index":3,"required":"n","name":"jacket"},{"amount":6,"index":14,"required":"n","name":"gadget"},{"amount":9,"index":0,"required":"n","name":"background"}]';

var Favatar = {

    thumbs: [],
    layers: [],
    save: document.getElementById('save'),
    canvas: document.getElementById('canvas'),
    categories: document.getElementById('categories'),
    components: document.getElementById('components'),

    initial: function(data) {
        var that = this;
        data.forEach(function(datum, idx) {
            var category = document.createElement('span');
            category.innerHTML = datum.name;
            category.dataset.i = idx;
            category.dataset.a = datum.amount;
            category.dataset.r = datum.required;
            that.categories.appendChild(category);
            that.thumbs[idx] = (datum.required == 'y') ? 1 : 0;
            that.layers[datum.index] = idx;
        });
        that.renewal(that.categories.getElementsByTagName('span')[0]);
        that.draw(that.layers);
        that.categories.getElementsByTagName('span')[0].className = 'active';
        that.categories.addEventListener('click', function(e) {
            if(e.target.tagName.toLowerCase() == 'span') {
                categories.getElementsByClassName('active')[0].className = '';
                e.target.className = 'active';
                that.renewal(e.target);
            }
        }, false);
        that.components.addEventListener('click', function(e) {
            if(e.target.tagName.toLowerCase() == 'img') {
                components.getElementsByClassName('active')[0].className = '';
                e.target.className = 'active';
                that.thumbs[parseInt(e.target.dataset.p)] = parseInt(e.target.dataset.n);
                that.draw(that.layers);
            }
        }, false);
        that.save.addEventListener('click', function(e) {
            var url = that.canvas.toDataURL('image/png');
            that.save.setAttribute('download', 'favatar.png');
            that.save.setAttribute('href', url);
        }, false);
    },

    renewal: function(parent) {
        var that = this;
        var component = document.createElement('img');
        component.src = 'thumb/remove.png';
        component.dataset.p = parent.dataset.i;
        component.dataset.n = 0;
        if(parent.dataset.r == 'y') {
            component.style.display = 'none';
        }
        that.components.innerHTML = '';
        that.components.appendChild(component);
        for(var i = 0; i < parseInt(parent.dataset.a); i++) {
            component = document.createElement('img');
            component.src = 'thumb/' + (parseInt(parent.dataset.i) + 10).toString(36) + (i + 1) + '.png';
            component.dataset.p = parent.dataset.i;
            component.dataset.n = i + 1;
            that.components.appendChild(component);
        }
        that.components.getElementsByTagName('img')[that.thumbs[parseInt(parent.dataset.i)]].className = 'active';
    },

    draw: function(arr) {
        var that = this;
        var ctx = that.canvas.getContext('2d');
        var frame = function(i) {
            if(that.thumbs[arr[i]]) {
                var img = new Image();
                img.onload = function() {
                    ctx.drawImage(img, 0, 0, 500, 500);
                    if(i++ < arr.length) {
                        frame(i);
                    }
                };
                img.src = 'img/' + (arr[i] + 10).toString(36) + that.thumbs[arr[i]] + '.png';
            } else if(i++ < arr.length) {
                frame(i);
            }
        };
        ctx.fillStyle = "#84d0f0";
        ctx.fillRect(0, 0, 500, 500);
        frame(0);
    }

};

window.onload = Favatar.initial(jsonData);
