let symbolPool = [];
allSymbols.forEach(symbol => {
    for (let i = 0; i < symbol.rarity; i++) {
        symbolPool.push(symbol);
    }
});
let slotMachineCreate = document.querySelector(".slotsContainer");
let slotMachineClose;
let slotOpen = false;
let isSpinning = false;

slotMachineCreate.addEventListener("click", () => {
    if (!slotOpen) {
        const upgradeContainer = document.querySelector(".upgradeContainer");
        
        const slotMachineContainer = document.createElement("div");
        slotMachineContainer.classList.add("slotMachineContainer");

        const closeSlots = document.createElement("div");
        closeSlots.classList.add("closeSlots");
        closeSlots.textContent = "X";
        closeSlots.addEventListener("click", () => {
            slotMachineContainer.remove();
            slotOpen = false;
        });

        const slotMachine = document.createElement("div");
        slotMachine.classList.add("slotMachine");
        for (let i = 0; i < 3; i++) {
            const slot = document.createElement("div");
            slot.classList.add("slot");
            const initialSymbolIndex = Math.floor(Math.random() * symbolPool.length);
            const initialSymbol = symbolPool[initialSymbolIndex];
            slot.textContent = initialSymbol.emoji;
            slotMachine.appendChild(slot);
        }

        const resultsDisplay = document.createElement("div");
        resultsDisplay.classList.add("resultsDisplay"); 
        
        const slotInteracts = document.createElement("div");
        slotInteracts.classList.add("slotInteracts");
        
        const slotBet = document.createElement("input");
        slotBet.classList.add("slotBet");
        slotBet.setAttribute("type", "number");
        slotBet.setAttribute("placeholder", "Enter your bet"); 
        slotInteracts.appendChild(slotBet);
        
        const slotSpin = document.createElement("div");
        slotSpin.classList.add("slotSpin");
        slotSpin.textContent = "Spin";
        slotInteracts.appendChild(slotSpin);
        slotSpin.addEventListener("click", spinSlots);
        
        slotMachineContainer.appendChild(closeSlots);
        slotMachineContainer.appendChild(slotMachine);
        slotMachineContainer.appendChild(resultsDisplay); 
        slotMachineContainer.appendChild(slotInteracts);

        upgradeContainer.appendChild(slotMachineContainer);
        slotOpen = true;
    }
});


function spinSlots() {
    if(!isSpinning){
        isSpinning = true;
        clearSlotStyles(); 
        const betInput = document.querySelector(".slotBet");
        const betAmount = parseInt(betInput.value, 10);
        const maxCyclesBase = 30;

        if (isNaN(betAmount) || betAmount <= 0) {
            console.log("lower than allowed")
            betInput.value = 1;
            isSpinning = false;
        }
        else if (betAmount > player.coins) {
            console.log("higher than allowed")
            betInput.value = player.coins;
            isSpinning = false;
        }
        else{

            player.adjustCoins(-betAmount);

            const resultSymbols = [];
            for (let i = 0; i < 3; i++) {
                const symbolIndex = Math.floor(Math.random() * symbolPool.length);
                resultSymbols.push(symbolPool[symbolIndex]);
            }

            let soundInterval = setInterval(playSound, 50);
            const slots = document.querySelectorAll(".slot");
            slots.forEach((slot, index) => {
                let cycleCount = 0;
                const maxCycles = maxCyclesBase + (index * 10);

                let intervalId = setInterval(() => {
                    if (cycleCount < maxCycles) {
                        const randomIndex = Math.floor(Math.random() * symbolPool.length);
                        slot.textContent = symbolPool[randomIndex].emoji;
                        cycleCount++;
                    } else {
                        clearInterval(intervalId);
                        slot.textContent = resultSymbols[index].emoji;
                        
                        playFinishSound();

                        if (index === slots.length - 1) {
                            clearInterval(soundInterval);
                            checkWin(resultSymbols, betAmount);
                            isSpinning = false;
                        }
                    }
                }, 50 + (index * 20));
            });
        }
    }
}

function playSound() {
    const soundURL = '../sounds/damageSound.mp3';
    const audio = new Audio(soundURL);
    audio.volume = 0.5;
    audio.play();
}

function playFinishSound() {
    const soundURL = '../sounds/stop.mp3';
    const audio = new Audio(soundURL);
    audio.volume = 0.4;
    audio.play();
}

function checkWin(results, betAmount) {
    let counts = results.reduce((acc, symbol) => {
        acc[symbol.emoji] = (acc[symbol.emoji] || 0) + 1;
        return acc;
    }, {});

    let message = "Try again!";
    let winningEmoji = null;

    if (Object.values(counts).includes(3)) {
        winningEmoji = results.find(symbol => counts[symbol.emoji] === 3).emoji;
        const winSymbol = results.find(symbol => counts[symbol.emoji] === 3);
        const winMultiplier = winSymbol.multiplierFull;
        winnings = Math.ceil(betAmount * winMultiplier);
        player.adjustCoins(winnings);
        message = `You won ${winnings - betAmount} coins! 🎉`;
    } else if (Object.values(counts).includes(2)) {
        winningEmoji = results.find(symbol => counts[symbol.emoji] === 2).emoji;
        const winSymbol = results.find(symbol => counts[symbol.emoji] === 2);
        const winMultiplier = winSymbol.multiplierTwo;
        winnings = Math.ceil(betAmount * winMultiplier);
        player.adjustCoins(winnings);
        message = `You won ${winnings - betAmount} coins! 🎉`;
    } else {
        winnings = -betAmount;
        message = `Lost ${-winnings} coins. Try again!`;
    }

    const resultsDisplay = document.querySelector(".resultsDisplay");
    resultsDisplay.textContent = message;

    if (winningEmoji) {
        document.querySelectorAll('.slot').forEach(slot => {
            if (slot.textContent === winningEmoji) {
                slot.style.border = "0.2vw solid #00FFB3";
            }
        });
    }
}

function clearSlotStyles() {
    const resultsDisplay = document.querySelector(".resultsDisplay");
    resultsDisplay.textContent = "";
    const slots = document.querySelectorAll(".slot");
    slots.forEach(slot => {
        slot.style.border = "";
        slot.style.color = "black"; 
    });
}


