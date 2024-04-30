class Player {
    constructor(damage, maxHealth, regeneration, potionStrength, coins, level, 
        upgradeCount, passiveDamage, directHitResistance, parryDamage, evasion, passiveSeconds) {
        this.damage = damage;
        this.health = maxHealth;
        this.maxHealth = maxHealth;
        this.coins = coins;
        this.regeneration = regeneration;
        this.potionStrength = potionStrength;
        this.level = level;
        this.upgradeCount = 0;
        this.passiveDamage = 0;
        this.directHitResistance = 0;
        this.parryDamage = 0;
        this.evasion = 0;
        this.passiveSeconds = 1.11;
        this.untilLevelUp = 10;
    }

    takeDamage(amount) {
        this.health -= amount;
        refreshHealthDisplay()
        if (this.health <= 0) {
            this.die();
        }
    }

    healPotion(amount){
        if(this.health < this.maxHealth){
            this.health += amount;
            if(this.health > this.maxHealth){
                this.health = this.maxHealth;
            }
        }
        refreshHealthDisplay();
    }

    heal(amount) {
        if(this.health < this.maxHealth && !gamePaused){
            this.health += amount;
            if(this.health > this.maxHealth){
                this.health = this.maxHealth;
            }
        }
        refreshHealthDisplay();
    }

    adjustCoins(amount) {
        this.coins += amount;
        refreshCoins();
    }

    newUpgrade(){
        this.upgradeCount += 1;
        this.checkLevelUp();
    }

    checkLevelUp(){
        if(this.upgradeCount % this.untilLevelUp === 0){
            this.level = (this.upgradeCount / this.untilLevelUp) + 1;
        }
        console.log(this.level);
    }

    die() {
        this.coins = Math.round(this.coins * 0.25);
        refreshCoins();
        player.health = player.maxHealth;
        refreshHealthDisplay();
        waveMonsterCount = 0;
        updateWaveCounter();
        updateMonster();
    }

    
    startPassiveDamage() {
        if (passiveDamageInterval) clearInterval(passiveDamageInterval);
        passiveDamageInterval = setInterval(() => {
            monster.takePassiveDamage(player.passiveDamage);
        }, this.passiveSeconds * 1000);
    }    

    gatherGameData() {
        return {
            upgrades: upgrades.map(upgrade => ({
                name: upgrade.name,
                currentLevel: upgrade.currentLevel
            })),
            coins: this.coins,
            currentWave: waveMonsterCount,
            currentHealth: player.health
        }
    }

    autoUpdate(){
        let gameData = player.gatherGameData();
        let userId = localStorage.getItem('user');
        if(userId){
            updateGameData(userId, gameData);
            console.log("autosaving")
        }
    }

    loadGameData(gameData) {
        gameData.upgrades.forEach(upgradeData => {
            const upgrade = upgrades.find(upg => upg.name === upgradeData.name);
            if (upgrade) {
                let upgradeElement;
                document.querySelectorAll(`.upgrade`).forEach(elem => {
                    if(elem.querySelector(`.upgradeName`).innerText == upgrade.name){
                        upgradeElement = elem;
                    }
                })
                if (upgradeElement) {
                    for (let i = 0; i < upgradeData.currentLevel; i++) {
                        upgrade.applyEffectOnLoad(upgradeElement);
                    }
                }
            }
        });
    
        this.coins = gameData.coins;
        waveMonsterCount = gameData.currentWave;
        this.health = gameData.currentHealth;

        refreshCoins();
        updateMonster();
        updateWaveCounter();
    }
    
    
}
let passiveDamageInterval;

function refreshHealthDisplay() {
    const currentHealthElement = document.querySelector('.userCurrentHealth');
    const maxHealthElement = document.querySelector('.userMaxHealth');
    currentHealthElement.textContent = player.health;
    maxHealthElement.textContent = player.maxHealth;
    
    const healthPercentage = (player.health / player.maxHealth) * 100;
    
    const healthFill = document.querySelector('.userHealthFill');
    healthFill.style.width = `${healthPercentage}%`;

    if(healthPercentage > 75) {
        healthFill.style.backgroundColor = "#00FFB3";
    } else if(healthPercentage > 25) {
        healthFill.style.backgroundColor = "#ffd82b";
    } else {
        healthFill.style.backgroundColor = "rgb(248, 65, 65)"; 
    }
}

function refreshCoins() {
    const coinsElement = document.querySelector('.userCoins .costNumber');
    if (coinsElement) {
        coinsElement.textContent = player.coins;
    } else {
        console.log("Coins element not found!");
    }
}
let player = new Player(10, 100, 2, 5, 0, 1); 

refreshHealthDisplay();