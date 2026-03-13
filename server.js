const express = require('express');
const DiscordOAuth2 = require("discord-oauth2");
const app = express();
const oauth = new DiscordOAuth2();

// الإعدادات (ستجدها في Discord Developer Portal)
const CLIENT_ID = "ضع_هنا_الـ_ID_الخاص_بتطبيقك";
const CLIENT_SECRET = "ضع_هنا_الـ_Secret_الخاص_بتطبيقك";
const REDIRECT_URI = "https://zoroomg213-hub.github.io/kia11.com/"; 

app.get('/callback', async (req, res) => {
    const code = req.query.code; // الكود الذي يرسله ديسكورد
    
    if (!code) return res.send("No code provided!");

    try {
        // تبادل الكود للحصول على Access Token
        const tokenData = await oauth.tokenRequest({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            code: code,
            scope: "identify guilds",
            grantType: "authorization_code",
            redirectUri: REDIRECT_URI,
        });

        // الحصول على معلومات المستخدم
        const user = await oauth.getUser(tokenData.access_token);
        
        // التحقق مما إذا كنت أنت الأدمن (ضع الـ ID الخاص بحسابك هنا)
        if (user.id === "ضع_هنا_ID_حسابك_الشخصي") {
            res.send(`Welcome Back Admin ${user.username}! Access Granted.`);
        } else {
            res.send(`Hello ${user.username}, you are not an admin.`);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Error linking Discord.");
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));