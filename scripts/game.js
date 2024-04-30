let attackPending = false;
let regenerationTime = 3;
let frameCounter = 0;
let levelRange = 1;

function gameTick() {
    if(!attackPending){
        monstersArray[currentMonsterIndex].dealDamage();
    }
    if(frameCounter % regenerationTime === 0)
    {
        player.heal(player.regeneration);
    }
    

    frameCounter += 1;
}

document.querySelector(".potionButton").addEventListener("click", () => {
    if(player.coins >= 50){
        player.healPotion(player.maxHealth * 0.1);
        player.adjustCoins(-50);
    }
})

document.addEventListener('click', function playAudioOnce() {
    var audio = document.getElementById("backgroundAudio");
    audio.volume = 0.2;
    audio.loop = true;
    
    audio.play().catch(error => console.error("Audio playback failed:", error));
    
    document.removeEventListener('click', playAudioOnce);
}, {once: true});

const tickInterval = 1000;
const gameTickIntervalId = setInterval(gameTick, tickInterval);
const clickingContainer = document.querySelector('.clickingContainer');

updateMonster();

const upgradesElement = document.querySelector('.upgradeContainer');

upgradesElement.addEventListener('mouseenter', function() {
    isHovering = true;
    if (!attackPending) {
        gamePaused = true;
    }
    clickingContainer.style.filter = 'brightness(80%)';
});

upgradesElement.addEventListener('mouseleave', function() {
    gamePaused = false;
    isHovering = false;
    clickingContainer.style.filter = '';
});

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        event.preventDefault();
    }
});

player.startPassiveDamage();

function autoUpdatePlayer() {
    setInterval(() => {
        player.autoUpdate();
    }, 30 * 1000);
}

autoUpdatePlayer();

function clearUserData() {
    player.autoUpdate();
    localStorage.removeItem('user');
}

window.addEventListener('beforeunload', clearUserData);