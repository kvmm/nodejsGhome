const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const server = express();

server.use(bodyParser.urlencoded({
  extended: true
}));

server.use(bodyParser.json());


server.post('/getDictionaryAPI', (req, res) => {

  var type = req.body.result.parameters.type;
  var word = req.body.result.parameters.word;
  
  if(type == 'synonym' ){
     type = 'synonyms';
     }
  console.log('--',type);
  if(type == 'antonym' || type == 'Antonyms' || type == 'Antonym'){
    type = 'antonyms';
  }
  
  console.log(type,'------',word);
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
      var list = JSON.parse(body);
      var wordList = [];
      //console.log('lll', list.length)
      if (type == 'antonyms') {
        if (list) {
          var obj = list.results[0].lexicalEntries[0].entries[0].senses;

          for (var i = 0; i < obj.length; i++) {
            var obj2 = obj[i];
            for (var j = 0; j < obj2.antonyms.length; j++) {
              if (obj2.antonyms[j].text)
                //console.log(obj2.antonyms[j].text);
              wordList.push(obj2.antonyms[j].text)
            }
          }

          console.log('if part--', word);
          res.setHeader('content-type', 'application/json');
          return res.json({
            speech: 'the ' + type + ' of the word ' + word + ' is ' + wordList.toString(),
            displayText: 'the ' + type + ' of the word ' + word + ' is ' + wordList.toString(),
            source: 'getDictionaryAPI'
          });
        } else {
          console.log('else');
          res.setHeader('content-type', 'application/json')
          return res.json({
            speech: 'Invaild PNR Number',
            displayText: 'Invaild PNR Number',
            source: 'getDictionaryAPI'
          });
        };
      } else {
        if (list) {
          var obj = list.results[0].lexicalEntries[0].entries[0].senses;

          for (var i = 0; i < obj.length; i++) {
            var obj2 = obj[i];
            for (var j = 0; j < obj2.synonyms.length; j++) {
              if (obj2.synonyms[j].text)
               //console.log(obj2.synonyms[j].text);
              wordList.push(obj2.synonyms[j].text)
            }
          }

          console.log('if part--', word);
          res.setHeader('content-type', 'application/json');
          return res.json({
            speech: 'the ' + type + ' of the word ' + word + ' is ' + wordList.toString(),
            displayText: 'the ' + type + ' of the word ' + word + ' is ' + wordList.toString(),
            source: 'getDictionaryAPI'
          });
        } else {
          console.log('else');
          res.setHeader('content-type', 'application/json')
          return res.json({
            speech: 'Invaild text',
            displayText: 'Invaild text',
            source: 'getDictionaryAPI'
          });
        }
      }
    }
  });
});

server.listen((process.env.PORT || 8001), () => {
  console.log("Server is up and running...");
});
