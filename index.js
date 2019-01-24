const accessToken = 'EAAFNZCjk90OIBADjpXdZAeTZC0D518D13p7ZBEDyU5sY4GeVZBAEcyreTcZAxpiXczXZAbUwruNVHIThMFHp1IjF5ZCmOHSW4lqllOZADGsDuMF9O3QZAZAFWWuWf7RvcaUlKmHYLCFr8eRvuN6wpzYrOMko0tYfgtPd81z9ynEDaKmVQZDZD';
const verifyToken = '84d46ce2432d2308c8f3905d845afde7';
const express = require('express')
const app = express()
const bodyParser = require('body-parser'); // parser les requete POST en JSON ou url-encoded,....
const port = process.env.PORT || 3000; // sur heroku un port nous ai donne automatiquement via la variable d'environnement PORT.
const { MessengerClient } = require('messaging-api-messenger');
const FacebookGraph = require('facebookgraph');

const messengerClient = MessengerClient.connect({
  accessToken,
  appId:'367229254095074',
  appSecret:'ee63ebeca674f09d67de10c28a73db59'
});

const facebookClient = new FacebookGraph(accessToken);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function handleMessage(event) {
    let echo = event.message.is_echo;

    console.log(JSON.stringify(event))

    if(!echo){
        try {
            await sleep(2000);// marquer comme lue apres 2 second
            await messengerClient.markSeen(event.sender.id);


            await sleep(2000);
            messengerClient.typingOn(event.sender.id);

            await sleep(5000);

            const sender = await facebookClient.get(event.sender.id);

            await messengerClient.sendText(event.sender.id, `Bonjour ${sender.first_name} ${sender.last_name} du vient je m'envoyer ceci << ${event.message.text} >>`);

            messengerClient.typingOff(event.sender.id);
        } catch (e) {
            messengerClient.typingOff(event.sender.id);
            console.log(e)
        }
    }
}

(async () => {

  app.get('/', (req, res) => res.send('Hello World!'));


  app.get('/confidential', (req, res) => {
      res.end('hello')
  });


  app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];// facebook va appeler cet url et y passer le token defini (). on doit verifier dans notre code que c bien facebook qui appelle cette url
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
    let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') // scope page
  {
    // Iterates over each entry - there may be multiple if batched
    // will only ever contain one message, so we get index 0

    for (let entry of body.entry){
      let event = entry.messaging[0];
       if(event.message){
           let _ = handleMessage(event);
       }
    }

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
  })


})()

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

//on deploit sur heroku
