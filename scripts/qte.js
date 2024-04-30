let expectedKey = "";
let monster;
let animationFrameId; 
let isHovering = false;

function chooseLetterAndStartQTE(difficulty, currentMonster) {
    if(!isHovering){
        gamePaused = false;
        const letters = [
            'a', 'd', ' ', 's', 'w', 'q', 'e', 
        ];
        monster = currentMonster;

        let maxRange = Math.min(1 + difficulty, letters.length);

        const chosenLetter = letters[Math.floor(Math.random() * maxRange)];
        
        if (chosenLetter === ' ') {
            document.querySelector(".qteLetter").innerHTML = `<span class="spacebar-icon">SPACE</span>`;
        } else {
            document.querySelector(".qteLetter").innerText = chosenLetter.toUpperCase();
        }
        expectedKey = chosenLetter;

        startQTEBar();
    }
    else{
        gamePaused = true;
        attackPending = false;
    }
}

function startQTEBar() {
    const qteFill = document.querySelector(".qteFill");

    qteFill.style.transition = 'none';
    qteFill.offsetWidth;
    qteFill.style.width = '100%';
    const qteContainer = document.querySelector(".qteContainer");
    qteContainer.classList.add("qteContainerGlow");
    
    qteContainer.addEventListener('animationend', () => {
    qteContainer.classList.remove("qteContainerGlow");
    }, {once: true});

    setTimeout(() => {
        qteFill.style.transition = `width ${monster.dodgeTime}s linear`;

        qteFill.style.width = '0%';

        const startTime = performance.now();
        const endTime = startTime + monster.dodgeTime * 1000;

        function animate(time) {
            if (!attackPending) {
                cancelAnimationFrame(animationFrameId);
                return;
            }

            const elapsedTime = time - startTime;
            const progress = (1 - elapsedTime / (endTime - startTime)) * 100;

            if (progress > 0) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                playerFailedQTE();
            }
        }

        animationFrameId = requestAnimationFrame(animate);
    }, 100); 
}



document.addEventListener('keydown', (event) => {
    const keyPressed = event.key.toLowerCase() === ' ' ? ' ' : event.key.toLowerCase(); 
    if (keyPressed === expectedKey && attackPending) {
        cancelAnimationFrame(animationFrameId); 
        monster.takeParryDamage(player.parryDamage);
        const qteFill = document.querySelector(".qteFill");

        qteFill.style.transition = 'none';  
        qteFill.offsetWidth; 
        qteFill.style.width = '0%';

        document.querySelector(".qteLetter").innerText = "-";
        const qteContainer = document.querySelector(".qteContainer");
        qteContainer.classList.remove("qteContainerGlow");
        qteContainer.classList.add("qteContainerSuccess");
        
        qteContainer.addEventListener('animationend', () => {
            qteContainer.classList.remove("qteContainerSuccess");
            attackPending = false; 
        }, {once: true});
    } else if (event.key === "Shift" && player.coins >= 50) {
        player.heal(player.maxHealth * 0.1);
        player.adjustCoins(-50);
    } else if (event.key !== "Shift" && attackPending) {
        playerFailedQTE();
    }
});



function playerFailedQTE()
{
    player.takeDamage(monster.calculateMonsterDamage())
    monster.playPunchSound();
    attackPending = false;
    document.querySelector(".qteLetter").innerText = "-";
    const qteContainer = document.querySelector(".qteContainer");
    qteContainer.classList.add("qteContainerFailed");

    qteContainer.addEventListener('animationend', () => {
    qteContainer.classList.remove("qteContainerFailed");
    }, {once: true});
}