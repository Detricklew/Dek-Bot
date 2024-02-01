const express = require('express');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { DekDB } = require('../Dek-Modules/DataHandling/dekDB');
const { createClient } = require('redis');
const uid = require('uid');
const { request } = require('undici');
const { clientId, clientSecret, secretKey } = require('../config.json');

const app = express();

const redisClient = createClient();
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
	client: redisClient,
	prefix: 'DekBot:',
});

app.set('trust proxy', 1);

app.set('views', './views');

app.set('view engine', 'ejs');

app.use(express.static(__dirname));

app.use(session({
	store: redisStore,
	secret: secretKey,
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: false,
		httpOnly: false,
		maxAge: 1000 * 60 * 200,
		sameSite: 'lax',
	},
}));

app.get('/', async (request, response) => {
	response.redirect('/HomePage');
});

app.get('/HomePage', async (req, response) => {

	const { code } = req.query;

	if (req.session.token_type && req.session.access_token) {
		return response.redirect('/Dashboard');
	}
	else if (!code) {
		return response.sendFile('/dist/index.html', { root: '.' });
	}
	else {
		try {
			const tokenResponseData = await request('https://discord.com/api/oauth2/token', {
				method: 'POST',
				body: new URLSearchParams({
					client_id: clientId,
					client_secret: clientSecret,
					code,
					grant_type: 'authorization_code',
					redirect_uri: 'http://localhost:3000/HomePage',
					scope: 'identify',
				}).toString(),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			});

			const oauthData = await tokenResponseData.body.json();
			req.session.token_type = oauthData.token_type;
			req.session.access_token = oauthData.access_token;
			req.session.save();
			return response.redirect('/Dashboard');
		}
		catch (error) {
			console.error(error);
		}
	}
});

app.get('/Dashboard', async (req, response) => {
	if (!req.session.token_type || !req.session.access_token) {
		return response.redirect('/Homepage');
	}

	const user = await request('https://discord.com/api/users/@me', {
		headers: {
			authorization: `${req.session.token_type} ${req.session.access_token}`,
		},
	});
	const guildResult = await request('https://discord.com/api/users/@me/guilds', {
		headers: {
			authorization: `${req.session.token_type} ${req.session.access_token}`,
		},
	});
	const guilds = await guildResult.body.json();
	const sentUser = await user.body.json();
	const newGuilds = [];
	guilds.forEach(guild => {
		if ((guild.permissions & 0x0000000000000020) === 0x0000000000000020) {
			newGuilds.push(guild);
		}
	});
	response.render('pages/dashBoard', {
		user: sentUser,
		guilds: newGuilds,
	});
});

app.get('/Server/:serverId', (req, response) => {
	if (!req.session.token_type || !req.session.access_token) {
		return response.redirect('/Homepage');
	}
	const guilds = DekDB.getGuilds();

	for (let i = 0; i < guilds.length; i++) {
		console.log(guilds[i].id);
		if (guilds[i].id.toString() === req.params.serverId.toString()) {
			console.log('here');
			return response.render('partials/serverMenu');
		}
		else {
			continue;
		}
	}

	return response.render('partials/joinDiscord');
});

app.listen(3000, () => console.log('listening on port 3000'));