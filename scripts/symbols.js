class Symbol {
    constructor(emoji, rarity, multiplierFull, multiplierTwo) {
        this.emoji = emoji;
        this.rarity = rarity; 
        this.multiplierFull = multiplierFull;
        this.multiplierTwo = multiplierTwo;
    }
}

const allSymbols = [
    new Symbol('🍒', 28, 1.7, 1.1),
    new Symbol('🍋', 26, 2.2, 1.4),
    new Symbol('🍊', 23, 2.7, 1.8),
    new Symbol('⭐', 15, 3.5, 2.5),
    new Symbol('🔔', 9, 4, 3),
    new Symbol('7️⃣', 5, 5, 3.5),
];