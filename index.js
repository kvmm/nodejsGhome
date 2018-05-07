const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const server = express();

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(bodyParser.json());


server.post('/getDictionaryAPI', (req, res) => {
  //console.log(req.headers)
  var type = req.headers.type;
  var word = req.headers.word;
  var service = {
    method: 'GET',
    url: 'https://od-api.oxforddictionaries.com:443/api/v1/entries/en/' + word + '/' + type,
    headers: {
      app_key: '884a2f6a63322c4b37321db1b9a4d9c6',
      app_id: 'db7bec40',
      Accept: 'application/json'
    }
  };

  request(service, function (error, responseFromAPI, body) {
    if (error)
      console.log('---' + error);
    else {
      console.log(body)
      var list = body;
       if (list && list.length >= 1) {
         var wordList = [];
         for (item in list) {
           var info = list[item];
           wordList.push(info);
         }
         //res.setHeader('Content-Type','application/json');
         res.setHeader('content-type','application/json')
         return res.send(
           body
         );
       }
      
      //res.send( body  );
    }
  });
});

server.listen((process.env.PORT || 8001), () => {
  console.log("Server is up and running...");
});