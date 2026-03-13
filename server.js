require('dotenv').config();
const express = require('express');
const DiscordOAuth2 = require("discord-oauth2");
const app = express();
const oauth = new DiscordOAuth2();

// These variables pull the info from your .env file
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const ADMIN_ID = process.env.MY_DISCORD_ID;

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    
    if (!code) return res.send("Error: No code received from Discord.");

    try {
        // Exchange code for access token
        const tokenData = await oauth.tokenRequest({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            code: code,
            scope: "identify",
            grantType: "authorization_code",
            redirectUri: REDIRECT_URI,
        });

        // Get user profile
        const user = await oauth.getUser(tokenData.access_token);
        
        // Final Admin Check
        if (user.id === ADMIN_ID) {
            res.send(`<h1>Access Granted</h1><p>Welcome, Admin ${user.username}!</p>`);
        } else {
            res.send(`<h1>Access Denied</h1><p>Sorry ${user.username}, you are not the admin.</p>`);
        }

    } catch (error) {
        console.error("Auth Error:", error.response ? error.response.data : error.message);
        res.status(500).send("Login failed. Check your Console/Terminal for details.");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running!`);
    console.log(`🔗 Local Link: http://localhost:${PORT}`);
    console.log(`👉 Set your Discord Redirect URI to: ${REDIRECT_URI}`);
});