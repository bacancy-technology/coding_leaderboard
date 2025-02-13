# Coding Leaderboard

## Installation

This project requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd coding_leaderboard
nano .env [add required variables -> I have added .env.local for example]
npm i
npm test [test cases are still pending with 100% code coverage]
npm start
```

How to manage in production mode? [Run, Delete, View Logs etc.]

```sh
npm i pm2 -g
pm2 start production.config.json
pm2 startup systemd
pm2 save
pm2 logs [to check all logs]
pm2 delete all [to delete all processes attached with pm2]
```

#
# Thank you :)
#
