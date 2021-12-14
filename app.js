require('dotenv').config();

const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = `https://us20.api.mailchimp.com/3.0/lists/${process.env.AUDIENCE_ID}`;
  const options = {
    method: 'POST',
    auth: `rjc:${process.env.MAILCHIMP_API_TOKEN}`,
  };

  const request = https.request(url, options, (response) => {
    response.on('data', (data) => {
      console.log(JSON.parse(data));
      if (response.statusCode === 200) {
        res.sendFile(__dirname + '/success.html');
      } else {
        res.sendFile(__dirname + '/failure.html');
      }
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.post('/success', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started...`);
});
