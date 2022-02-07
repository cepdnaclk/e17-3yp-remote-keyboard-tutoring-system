var request = require('request');
var FlatApi = require('flat-api');
const axios = require('axios');

FlatApi.ApiClient.instance.authentications.OAuth2.accessToken = "70c264855fbc225c970a55e23ffe70514d3329623a0cd5e45c48aa5fde57267a385399c4907709ae41096f875ea0da0e4fdc28a6f6f1148bab2d1fd6309555aa";

var scoreToImport = 'https://gist.githubusercontent.com/gierschv/938479bec2bbe8c39eebbc9e19d027a0/raw/2caa4fa312184412d0d544feb361f918869ceaa5/hello-world.xml';

// const data = JSON.stringify({
//   title : 
// });

// Download a MusicXML "Hello World"
request(scoreToImport, function (error, response, body) {
  // Create the document and print the meta returned by the API
  // console.log(body);
  //axios.post("https://api.flat.io/v2/scores",{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  new FlatApi.ScoreApi().createScore({
    title: 'Hello world 3',
    privacy: 'public',
    data: body
  }, function (error, data, response) {
    if (error) {
      console.error(error);
    }
    else {
      console.log('Successfully create the document:', data);
    }})
});
