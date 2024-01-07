# Discord Bot

## A Discord bot project with a heavy focus on providing it's users with enhanced productivity

This project is a bot that will have a heavy focus on providing end users with enhanced productivity. Right now it is in it's infant stages. The features this bot will contain currently are the following :
-
- The ability to customize resources to be easily viewable to the end user
- The ability to send motivational quotes to users daily.(WIP)
- Promodoro timer to help users with studying
- Currency system

## How to install this bot for your own personal usage


1. Firstly you will need to clone this project. If you are unfamiliar with the process look <a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository">here</a>
2. Secondly you will need a discord bot token. If you are unsure of how to obtain one please refer to <a href="https://www.writebots.com/discord-bot-token/">this</a> (you will need a discord account to get the token if you do not have one refer to <a href="https://support.discord.com/hc/en-us/articles/360033931551-Getting-Started#h_01H4RR2GE2FAK7DZ5W3765NGVT">this guide</a>). Make sure you have all Privileged Gateway Intents marked to on. (Here is a <a href="https://discordjs.guide/popular-topics/intents.html#privileged-intents">guide<a>)
3. If this is your first node.js application you will need to install node.js and npm. Here is a <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm">guide</a> if you need it  
4. Now with all the prerequisites done you will want to install all the node modules used in this program. Run this command in the root directory of the repository - `npm install`.
5. Navigate to the `sample-config.json` file in the repository and replace the token placeholder with your token. Make sure you include the quotation marks around your token.
6. Rename the `sample-config.json` to `config.json`;
7. Now run this command in the root directory of the repository- `node index.js`;
8. If you get two messages indicating that the database is loaded and that the bot is ready, Congrats your bot is active!
9. Add the bot to a server (Where you have permission to of course). If you are unsure of the process refer to this <a href="https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links">article</a>

## Loading commands to use with your server

Want to play around with some of the commands in the bot? follow these instructions

1. You will want to find your bots clientId. unsure of how to do so? follow these <a href="https://docs.discloudbot.com/v/en/suport/faq/id-bot">instructions</a>.
2. Go to your config file and replace the dummy client id text with your bots id text.
3. You will want to have ran your bot at least once in the server you want the commands to be loaded in before running this command `node loadCommands.js`
4. If you get the message "Successfully reloaded (number of commands) application (/) commands in (your server name)" congrats you've loaded the server.

## How to tweak this Bot for your own uses

Feel free to follow the installation instructions and then play around with the code as you see fit.

## Find a bug?

If you found an issue or would like to submit an improvement to this project, please submit an issue using the issues tab above. If you would like to submit a PR with a fix, reference the issue you created!

## Known issues (Work in progress)

- Motivational module currently only works when "!Motivate" is typed into chat.
- Roles in addResource is currently not working.
- date to be removed  is currently not working in addResource is currently not working.
