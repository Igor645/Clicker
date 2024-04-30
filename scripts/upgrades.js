class Upgrade {
    constructor(name, description, baseCost, effect, iconSrc, maxLevel = 100, priceIncrease) {
        this.name = name;
        this.description = description;
        this.baseCost = baseCost;
        this.effect = effect;
        this.iconSrc = iconSrc;
        this.currentLevel = 0;
        this.maxLevel = maxLevel;
        this.priceIncrease = priceIncrease;
    }

    getCurrentCost() {
        return this.baseCost + (this.currentLevel * this.priceIncrease); 
    }

    applyEffect(upgradeElement) {
        const cost = this.getCurrentCost();
        if (this.currentLevel < this.maxLevel && player.coins >= cost) {
            this.effect(player);
            player.coins -= cost;
            this.currentLevel++;
            this.refreshUpgradeElement(upgradeElement);
            document.querySelector(".qteFill").style.width = '0%'; 
            player.autoUpdate();
        } else {
            console.log("Can't apply upgrade. Check coins and max level.");
        }
    }

    applyEffectOnLoad(upgradeElement){
        this.effect(player);
        this.currentLevel++;
        this.refreshUpgradeElement(upgradeElement);
        document.querySelector(".qteFill").style.width = '0%'; 
    }

    generateHTML(container) {
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'upgrade';
    
        upgradeElement.innerHTML = `
            <div class="upperPart">
                <div class="textContainer">
                    <div class="upgradeName">${this.name}</div>
                    <div class="tinyTextContainer">
                        <div class="description">${this.description}</div>
                        <div class="costContainer">
                            <div class="costNumber">${this.getCurrentCost()}</div>
                            <img class="coinImg" src="images/coin.svg" alt="coin">
                        </div>
                    </div>
                </div>
                <div class="iconContainer">
                    <img class="upgradeIcon" src="${this.iconSrc}" alt="upgrade icon">
                </div>
            </div>
            <div class="bottomPart">
                <div class="upgradeAmount">
                    <div class="current">${this.currentLevel}</div>
                    <div>/</div>
                    <div class="max">${this.maxLevel}</div>
                </div>
                <div class="progressBar">
                    <div class="progressFill" style="width: ${this.currentLevel / this.maxLevel * 100}%"></div>
                </div>
            </div>
        `;
    
        container.appendChild(upgradeElement);
    
        this.attachBuyEvent(upgradeElement);
    }
    

    attachBuyEvent(upgradeElement, player) {
        const buyBtn = upgradeElement;
        buyBtn.addEventListener('click', () => {
            this.applyEffect(upgradeElement);
            this.refreshUpgradeElement(upgradeElement);
            refreshCoins();
        });
    }

    refreshUpgradeElement(upgradeElement) {
        const costNumber = upgradeElement.querySelector('.costNumber');
        costNumber.innerText = this.getCurrentCost();
        const currentLevelDisplay = upgradeElement.querySelector('.current');
        currentLevelDisplay.innerText = this.currentLevel;
        const progressBarFill = upgradeElement.querySelector('.progressFill');
        progressBarFill.style.width = `${this.currentLevel / this.maxLevel * 100}%`;
    }
}

let upgrades = [
    new Upgrade("Damage Up",
    "Get your damage up by 5 points",
    100,
    () => { player.damage += 5; player.newUpgrade()},
    "images/sword.svg",
    100,
    30),
    new Upgrade("Mace",
    "Increase parry damage, when blocking enemy attacks, by 5.",
    100,
    () => { player.parryDamage += 5; player.newUpgrade()},
    "images/mace.svg",
    100,
    50 ),
    new Upgrade("Pet",
    "Increases the player's passive damage by 5.",
    100,
    () => { player.passiveDamage += 5; player.newUpgrade(), player.startPassiveDamage();},
    "images/pet.svg",
    100,
    75),
    new Upgrade("Turret",
    "Decreases passive damage intervall by 10ms.",
    100,
    () => { player.passiveSeconds -= 0.01; player.newUpgrade(), player.startPassiveDamage();},
    "images/turret.svg",
    100,
    25),
    new Upgrade("Health Up",
    "Get your health up by 20 points",
    100,
    () => { player.maxHealth += 20; player.health += 20; refreshHealthDisplay(); player.newUpgrade()},
    "images/heart.svg",
    100,
    10 ),
    new Upgrade("Potion",
    "Increases the amount you heal after killing an enemy by 2.",
    100,
    () => { player.potionStrength += 2; player.newUpgrade()},
    "images/potion.svg",
    100,
    30 ),
    new Upgrade("Regeneration",
    "Increases the amount you regenerate every 3 seconds by 2.",
    100,
    () => { player.regeneration += 1; player.newUpgrade()},
    "images/plus.svg",
    100,
    25 ),
    new Upgrade("Shield",
    "Increases your resistance towards direct hits by 0.1",
    100,
    () => { player.directHitResistance += 0.1; player.newUpgrade()},
    "images/shield.svg",
    100,
    25 ),
    new Upgrade("Agility",
    "Increase chance to dodge direct hits by 1%.",
    100,
    () => { player.evasion += 1; player.newUpgrade()},
    "images/agility.svg",
    100,
    30 ),
]

function renderUpgrades(upgrades) {
    const upgradesContainer = document.querySelector(".upgrades");
    upgradesContainer.innerHTML = '';
    upgrades.forEach(upgrade => {
        upgrade.generateHTML(upgradesContainer);
    });
}

renderUpgrades(upgrades);