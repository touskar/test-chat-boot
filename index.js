const welcome = `Hello word`;
const accessToken = 'EAAFNZCjk90OIBADjpXdZAeTZC0D518D13p7ZBEDyU5sY4GeVZBAEcyreTcZAxpiXczXZAbUwruNVHIThMFHp1IjF5ZCmOHSW4lqllOZADGsDuMF9O3QZAZAFWWuWf7RvcaUlKmHYLCFr8eRvuN6wpzYrOMko0tYfgtPd81z9ynEDaKmVQZDZD';
const verifyToken = '84d46ce2432d2308c8f3905d845afde7';
const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // parser les requete POST en JSON ou url-encoded,....
const port = process.env.PORT || 3000; // sur heroku un port nous ai donne automatiquement via la variable d'environnement PORT.

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


(async () => {

  app.get('/', (req, res) => res.send('Hello World!'));

  app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === verifyToken) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

  app.post('/webhook', async(req, res) => {
    let data = req.body;
     console.log(data);

     res.json(data); // on return ce que n'a recu
  })


})()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//on deploit sur heroku
