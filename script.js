function Reel(reelContainer, idx, initialSymbols) {
    this.reelContainer = reelContainer;
    this.idx = idx;
  
    this.symbolContainer = document.createElement("div");
    this.symbolContainer.classList.add("icons");
    this.reelContainer.appendChild(this.symbolContainer);
  
    this.animation = this.symbolContainer.animate(
      [
        { top: 0, filter: "blur(0)" },
        { filter: "blur(2px)", offset: 0.5 },
        {
          top: "calc(" + Math.floor(this.factor) * 10 / 1 + " * -100% - " +
            Math.floor(this.factor) * 10 + " * 3px)",
  
          filter: "blur(0)",
        },
      ],
      {
        duration: this.factor * 1000,
        easing: "ease-in-out",
      }
    );
    this.animation.cancel();
  
    initialSymbols.forEach(function (symbol) {
      this.symbolContainer.appendChild(new Symbol(symbol).img);
    }.bind(this));
  }
  
Object.defineProperty(Reel.prototype, 'factor', {
get: function () {
    return 1 + Math.pow(this.idx / 2, 2);
},
});

Reel.prototype.renderSymbols = function (nextSymbols) {
const fragment = document.createDocumentFragment();

for (let i = 3; i < 3 + Math.floor(this.factor) * 10; i++) {
    const icon = new Symbol(
    i >= 10 * Math.floor(this.factor) - 2
        ? nextSymbols[i - Math.floor(this.factor) * 10]
        : undefined
    );
    fragment.appendChild(icon.img);
}

this.symbolContainer.appendChild(fragment);
};

Reel.prototype.spin = function () {
const animationPromise = new Promise(
    function (resolve) {
    this.animation.onfinish = resolve;
    }.bind(this)
);
const timeoutPromise = new Promise(function (resolve) {
    setTimeout(resolve, this.factor * 1000);
}.bind(this));

this.animation.cancel();
this.animation.play();

return Promise.race([animationPromise, timeoutPromise]).then(
    function () {
    if (this.animation.playState !== "finished") this.animation.finish();

    const max = this.symbolContainer.children.length - 3;

    for (let i = 0; i < max; i++) {
        this.symbolContainer.firstChild.remove();
    }
    }.bind(this)
);
};

var cache = {};
function Symbol(name) {
    if (name === undefined) {
      name = Symbol.random();
    }
  
    this.name = name;
  
    if (cache[name]) {
      this.img = cache[name].cloneNode();
    } else {
      this.img = new Image();
      this.img.onload = function () {
        cache[name] = this;
      };
      this.img.src = "assets/image/" + name + ".jpg";
    }
  }
  
Symbol.preload = function () {
  Symbol.symbols.forEach(function (symbol) {
    new Symbol(symbol);
  });
};

Symbol.symbols = [
  "bem",
  "film",
  "fuji",
  "ohm",
  "pon",
  "sun",
  "nine",
  "chokun",
  "mystery"
];

Symbol.random = function () {
  return this.symbols[Math.floor(Math.random() * this.symbols.length)];
};

function Slot(domElement, config) {
Symbol.preload();

this.currentSymbols = [
    ["film"],
    ["film"],
    ["film"],
    ["film"]
];

this.nextSymbols = [
    ["film"],
    ["film"],
    ["film"],
    ["film"]
];

this.container = domElement;

this.reels = Array.from(this.container.getElementsByClassName("reel")).map(
    function(reelContainer, idx) {
    return new Reel(reelContainer, idx, this.currentSymbols[idx]);
    }.bind(this)
);

this.spinButton = document.getElementById("spin");
this.spinButton.addEventListener("click", function() {
    this.spin();
}.bind(this));


if (config.inverted) {
    this.container.classList.add("inverted");
}

this.config = config;
}
  
Slot.prototype.spin = function() {
this.currentSymbols = this.nextSymbols;
this.nextSymbols = [
    [Symbol.random()],
    [Symbol.random()],
    [Symbol.random()],
    [Symbol.random()]
];

this.onSpinStart(this.nextSymbols);

var reelPromises = this.reels.map(function(reel) {
    reel.renderSymbols(this.nextSymbols[reel.idx]);
    return reel.spin();
}.bind(this));

return Promise.all(reelPromises).then(function() {
    this.onSpinEnd(this.nextSymbols);
}.bind(this));
};

Slot.prototype.onSpinStart = function(symbols) {
this.spinButton.disabled = true;

if (this.config.onSpinStart) {
    this.config.onSpinStart(symbols);
}
};

Slot.prototype.onSpinEnd = function(symbols) {
this.spinButton.disabled = false;

if (this.config.onSpinEnd) {
    this.config.onSpinEnd(symbols);
}
};
const scriptURL = 'https://script.google.com/macros/s/AKfycbx0T1UGIKaaPt5Vp2uRKb2GLbj3u8j1ziRKAcLxVha00Jxi3qBvOmNBTbGONkWvsM6f/exec';
const spinsData = [];
const config = {
    inverted: false,
    onSpinStart: (symbols) => {
      console.log("onSpinStart");
    },
    onSpinEnd: (symbols) => {
      spinsData.push(symbols)
      console.log("onSpinEnd");
      const data = symbols

      const formData = new FormData();
      for (const key in symbols) {
        formData.append(key, data[key]);
      }

      fetch(scriptURL, { method: 'POST', body: formData })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Network response was not ok.');
          }
        })
        .then(jsonResponse => {
          console.log(jsonResponse); 
        })
        .catch(error => console.error('Error!', error.message));
          },
        };
  
const slot = new Slot(document.getElementById("slot"), config);







