class Monster {
  constructor(name, damage, damagePerLevel, health, healthPerLevel, probability, minLevel, coins, aggression, isBoss, dodgeTime, directChance, html, onClick = null) {
    this.name = name;
    this.damage = damage;
    this.health = health;
    this.healthPerLevel = healthPerLevel;
    this.minLevel = minLevel;
    this.probability = probability;
    this.coins = coins;
    this.aggression = aggression;
    this.isBoss = isBoss;
    this.html = html;
    this.dodgeTime = dodgeTime;
    this.onClick = onClick; 
    this.directChance = directChance;
    this.damagePerLevel = damagePerLevel;
    this.currentHealth = 0;
    this.level = 1;
  }

  render() {
    const monsterArea = document.querySelector('.monsterArea');
    monsterArea.innerHTML = this.html;
    const hitbox = monsterArea.querySelector('#hitbox');
    if (hitbox) {
      hitbox.onclick = () => {
        if (this.onClick) {
          this.onClick(this);
        } else {
          this.takeDamage(player.damage);
        }
      };
    }
    document.querySelector(".monsterName").innerText = this.name;
  }

  calculateMonsterDamage(){
    return (this.damage + this.damagePerLevel * this.level);
  }

  calculateMonsterTrueHealth(){
    return (this.health + this.healthPerLevel * this.level);
  }

  takePassiveDamage(amount){
    if(!isDead && !gamePaused){
      this.currentHealth -= amount;
      calculateMonsterHealth();    
    }
  }

  takeParryDamage(damage){
    if(!isDead && !gamePaused){
      this.currentHealth -= damage;
      calculateMonsterHealth();

      var audio = new Audio('sounds/parry.mp3');
      audio.volume = 0.13;
      audio.play();
    }
  }

  takeDamage(damage){
    if(!isDead && !gamePaused){
      this.currentHealth -= damage;
      calculateMonsterHealth();

      var audio = new Audio('sounds/damageSound.mp3');
      audio.volume = 0.5;
      audio.play();
    }
  }

  playPunchSound(){
    var audio = new Audio('sounds/punch.mp3');
    audio.volume = 0.4;
    audio.play();
  }

  dealDamage() {
    if(!isDead && !gamePaused){
      if (Math.random() <= this.directChance / 100) {
        if (Math.random() > player.evasion / 100) {
          player.takeDamage(Math.round(this.calculateMonsterDamage() / (2 + player.directHitResistance)));
          directHitAnim();
          this.playPunchSound();
        } 
        else 
        {
          let critShow = document.querySelector(".critShow");
                critShow.innerText = "Evaded!";
                critShow.classList.add("evaded");

                setTimeout(() => {
                    critShow.innerText = "";
                    critShow.classList.remove("evaded");
                }, 2000);
        }
      } else {
          attackPending = true;
          chooseLetterAndStartQTE(player.level, this);
      }
    }
}

}

class Mosquito extends Monster {
  constructor(name, damage, damagePerLevel, health, healthPerLevel, probability, minLevel, coins, aggression, isBoss, dodgeTime, directChance, html, onClick = null) {
    super(name, damage, damagePerLevel, health, healthPerLevel, probability, minLevel, coins, aggression, isBoss, dodgeTime, directChance, html, onClick);
  }

  dealDamage() {
    if(!isDead && !gamePaused){
      player.takeDamage(this.calculateMonsterDamage())
    }
  }

  takePassiveDamage(amount){
  
  }
}

class MoneyBag extends Monster {
  constructor(name, damage, damagePerLevel, health, healthPerLevel, probability, minLevel, coins, aggression, isBoss, dodgeTime, directChance, html, onClick = null) {
    super(name, damage, damagePerLevel, health, healthPerLevel, probability, minLevel, coins, aggression, isBoss, dodgeTime, directChance, html, onClick);
  }

  dealDamage() {

  }

  takePassiveDamage(){

  }
}
  
  const monstersArray = [
    new Monster(
      "Guardian Eye", 20, 10, 120, 50, 15, 1, 35, 60, false, 1.5, 20,
      `<div class="outerCircle" id="hitbox"><div class="middleCircle"><div class="innerCircle"></div></div></div>`
    ),
    new Monster(
      "Devilish Rose", 15, 15, 80, 40, 10, 2, 25, 80, false, 1, 0,
      `<div class="spikeMonster" id="hitbox"></div><div class="spikeFace"><div class="spikeEyes"><img src="images/roseEye.svg" class="spikeEye left"><img src="images/roseEye.svg" class="spikeEye right"></div></div>`
    ,devilishRoseClicked
    ),
    new Monster(
    "Lich Skull", 30, 20, 600, 60, 20, 2, 60, 100, true, 0.5, 0,
        `<div class="headContainer" id="hitbox">
        <img class="skull" src="images/skull.svg" alt="Not Found">
        <div class="jaw"></div>
    </div>   
    <div class="bubbleContainer">
        <div class="bubble bubbleOne"></div>
        <div class="bubble bubbleTwo"></div>
        <div class="bubble bubbleThree"></div>
        <div class="bubble bubbleFour"></div>
        <div class="bubble bubbleFive"></div>
    </div>`
    ),
    new Mosquito(
    "Zoomie", 2, 2, 1, 0, 2, 1, 20, 100, false, 1, 0,
    `<div class="mosquitoContainer" id="hitbox">
        <div class="mosWing">
        </div>
        <div class="mosquito"></div>
        <div class="mosWing">
        </div>
    </div>`
    ),
    new Monster(
        "Slime", 15, 10, 80, 40, 35, 1, 20, 80, false, 1.5, 20,
        `<div class="slime" id="hitbox">
        <div class="slimeEye"></div>
        <div class="slimeEye"></div>
    </div>`
        ),
    new Monster(
      "King Slime", 15, 10, 500, 40, 15, 1, 80, 100, true, 0.8, 0,
      `<div class="kingSlime" id="hitbox">
      <img class="kingSlimeCrown" src="images/crown.svg">
      <div class="slimeEye"></div>
      <div class="slimeEye"></div>
  </div>`
      ),
      new Monster(
        "Poltergeist", 20, 10, 160, 40, 15, 4, 40, 100, false, 0.6, 0,
        `<div class="polterGeistContainer">
        <img class="poltAxe" src="images/poltAxe.svg">
        <div class="polterGeistArmor" id="hitbox">
            <img class="poltHead" src="images/poltHead.svg">
            <img class="poltChest" src="images/poltChest.svg">
            <img class="poltLegs" src="images/poltLegs.svg">
        </div>
        <img class="poltShield" src="images/poltShield.svg">
    </div>`
      ),
      new MoneyBag(
        "Money Bag", 0, 0, 1, 0, 2, 1, 250, 0, false, 0, 0,
        `<img src="images/moneyBag.svg" class="moneyBag" id="hitbox">`
      ),
  ];

  let currentMonsterIndex = null;
  let nextMonsterIndex = null;
  let previousWasBoss = false;
  let dealtDamage = 0;
  let waveMonsterCount = 0;
  let bossWave = 15;
  let enemyLevel = 0;
  let isDead = false;
  let gamePaused = false;

  function selectRandomMonster(monsters) {
    const totalProbability = monsters.reduce((sum, monster) => sum + monster.probability, 0);
    let randomNum = Math.random() * totalProbability;
    for (let i = 0; i < monsters.length; i++) {
      if (randomNum < monsters[i].probability) {
        return monsters[i];
      }
      randomNum -= monsters[i].probability;
    }
    return monsters[0];
  }

  function generateEnemyLevel() {
    let minLevel = Math.max(player.level - 1, 1);
    let maxLevel = player.level + 1;
    
    enemyLevel = Math.floor(Math.random() * (maxLevel - minLevel + 1)) + minLevel;
    document.querySelector(".monsterLevel").innerText = `Lv. ${enemyLevel}`
  }  
  
  function updateMonster() {
    let eligibleMonsters;
    if (waveMonsterCount >= bossWave) {
      waveMonsterCount = 0;
      eligibleMonsters = monstersArray.filter(monster => monster.isBoss && monster.minLevel <= player.level);
    } else {
      eligibleMonsters = monstersArray.filter(monster => !monster.isBoss && monster.minLevel <= player.level);
    }
  
    if (eligibleMonsters.length === 0) {
      console.warn("No eligible monsters found for the current criteria.");
      return; 
    }
  
    const selectedMonster = selectRandomMonster(eligibleMonsters);
    currentMonsterIndex = monstersArray.indexOf(selectedMonster); 
    monstersArray[currentMonsterIndex].level = enemyLevel;
    monstersArray[currentMonsterIndex].currentHealth = monstersArray[currentMonsterIndex].calculateMonsterTrueHealth();
    monstersArray[currentMonsterIndex].render();
    calculateMonsterHealth();
  
    if (monstersArray[currentMonsterIndex].isBoss) {
      document.querySelector('.isBoss').style.display = "block";
      document.querySelector(".isBoss").innerText = "Boss";
      updateTriangleAnimation(30, 0.1, 20);
    } else {
      document.querySelector('.isBoss').style.display = "none";
      updateTriangleAnimation(300, 0.2, 7);
    }

    generateEnemyLevel();
  }
  


  function calculateMonsterHealth(){
    let monster = monstersArray[currentMonsterIndex];
    const monsterHealthAdjusted = monster.calculateMonsterTrueHealth();
    const healthLeft = monster.currentHealth;
    const healthPercentage = (healthLeft / monsterHealthAdjusted) * 100;  
    const healthBar = document.querySelector('.monsterHealthFill');

    if(healthPercentage > 0){
        healthBar.style.width = `${healthPercentage}%`;
    }
    else{
        isDead = true;
        waveMonsterCount++;
        if(waveMonsterCount > 15){
          waveMonsterCount = 0;
        }
        updateWaveCounter();
        healthBar.style.width = 0 + "%";
        const monsterArea = document.querySelector('.monsterArea');
        monsterArea.classList.add('fadeOut');
        var audio = new Audio('sounds/stop.mp3');
        audio.volume = 0.3; 
        audio.play();
        player.adjustCoins(monster.coins + 10 * (player.level - 1));
        player.heal(player.potionStrength);
        cancelAnimationFrame(animationFrameId);
        
        document.querySelector(".qteLetter").innerText = "-";
        const qteFill = document.querySelector(".qteFill");
        qteFill.style.transition = 'none';
        qteFill.offsetWidth;
        qteFill.style.width = '0%'; 
        document.querySelector(".qteContainer").style.filter = "brightness(0.9)";
        
        setTimeout(() => {
          document.querySelector(".qteContainer").style.filter = "brightness(1)";
          document.querySelector(".isBoss").innerText = ""
          dealtDamage = 0; 
          monsterArea.classList.remove('fadeOut');
          updateMonster();
          isDead = false;
          attackPending = false;
        }, 1000);
      }
  }

function devilishRoseClicked(monster) {
  if(!isDead){
    const damageToTake = Math.floor(monster.calculateMonsterDamage() / 3);
    player.takeDamage(damageToTake);
    directHitAnim();
    monster.takeDamage(player.damage);
  }
}

function directHitAnim(){
  let critShow = document.querySelector(".critShow");

          critShow.innerText = "Direct Hit!";
          critShow.classList.add("moveUpCrit");

          setTimeout(() => {
            critShow.innerText = "";
            critShow.classList.remove("moveUpCrit");
          }, 2000);
}

function updateWaveCounter(){
  document.querySelector(".waveCounter").innerText = `Until Boss: ${bossWave - waveMonsterCount}`
}

  