import { UpholdBot } from './core/UpholdBot.js';

//bot instantiation
const bot = new UpholdBot();
await bot.init();
// ---> bot start
bot.start();
