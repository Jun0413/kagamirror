/**
 * There is absolutely no need to append emoji before each event,
 * let alone to scroll or shuffle them.
 * But I do it anyway because it is cute - each event is like a git commit!
 * 
 * -- Zeng Junhao, Mar 5th, 2019
 */
let emojiIdx = 0, emojiScrollHandler = 0; // used for scrolling
let eventsEmojis = [
    "1f64c",       // 🙌
    "1f4a1",       // 💡
    "1f4d6",       // 📖
    "1f4dd",       // 📝
    "1f4c5",       // 📅
    "1f4cc",       // 📌
    "2728",        // ✨
    "1f433",       // 🐳
    "1f33c",       // 🌼
    "1f315",       // 🌕
    "1f310",       // 🌐
    "2b50",        // ⭐
    "1f4a6",       // 💦
    "1f471",       // 👩‍
    "1f37a",       // 🍺
    "1f36d",       // 🍭
    "1f1f8-1f1ec", // 🇸🇬
    "1f389",       // 🎉
    "1f48e",       // 💎
    "1f354",       // 🍔
    "1f525",       // 🔥
    "1f308",       // 🌈
    "1f338"        // 🌸
];

function shuffleEventsEmojis() {
    // Durstenfeld shuffle
    for (let i = eventsEmojis.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let t = eventsEmojis[i];
        eventsEmojis[i] = eventsEmojis[j];
        eventsEmojis[j] = t;
    }
    console.log("eventsEmojis after shuffling: ", eventsEmojis);
}