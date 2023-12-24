const symbols = ['cherry', 'lemon', 'orange', 'plum', 'bell', 'bar'];

function getRandomSymbol() {
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}

function spin() {
  const reels = document.querySelectorAll('.reel');
  
  reels.forEach((reel) => {
    const symbol = getRandomSymbol();
    reel.style.backgroundImage = `url('image/${symbol}.jpg')`;
  });
}
