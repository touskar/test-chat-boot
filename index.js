const welcome = `Hello word`;
let accessToken = 'EAAFNZCjk90OIBADjpXdZAeTZC0D518D13p7ZBEDyU5sY4GeVZBAEcyreTcZAxpiXczXZAbUwruNVHIThMFHp1IjF5ZCmOHSW4lqllOZADGsDuMF9O3QZAZAFWWuWf7RvcaUlKmHYLCFr8eRvuN6wpzYrOMko0tYfgtPd81z9ynEDaKmVQZDZD';

const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // parser les requete POST en JSON ou url-encoded,....
const port = process.env.PORT || 3000; // sur heroku un port nous ai donne automatiquement via la variable d'environnement PORT.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//on deploit sur heroku
