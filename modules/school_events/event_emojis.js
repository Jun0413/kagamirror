/**
 * There is absolutely no need to append emoji before each event,
 * let alone to scroll or shuffle them.
 * But I do it anyway because it is cute - each event is like a git commit!
 * 
 * -- Zeng Junhao, Mar 5th, 2019
 */
let emojiIdx = 0, emojiScrollHandler = 0; // used for scrolling
let eventsEmojis = [
    // No black emoji!
    "🙌", "💡", "📖", "📝", "📅", "📌", "✨", "🐳", "🌼", "🌕", "🌐",
    "⭐", "💦", "👩‍", "🍺", "🍭", "🇸🇬", "🎉", "💎", "🍔", "🔥", "🌈"
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
