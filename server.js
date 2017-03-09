

var express = require('express');
var app = express();
var GoogleImages = require('google-images');
var url = require('url');
var request = require('request');

const GOOGLE_API_SEARCH_ENDPOINT = "https://www.googleapis.com/customsearch/v1";
const GOOGLE_API_SEARCH_CX = 'YOUR CX KEY';
const GOOGLE_API_SEARCH_KEY ="YOUR API KEY";

var searchForImages = function(imgSearch, offset, res, err){
  if(err) throw err;

  if (offset===null) {
    offset = 0;
  }
  var fullURL = url.parse(GOOGLE_API_SEARCH_ENDPOINT);
  fullURL.query = {
        q: imgSearch.replace(" ", "+"),
        start: offset ? parseInt(offset) : 1,
        cx: GOOGLE_API_SEARCH_CX,
        key: GOOGLE_API_SEARCH_KEY,
        searchType: 'image'
    };

  fullURL = url.format(fullURL);
  console.log(fullURL);

  var request = require('request');
  request(fullURL, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    var json = JSON.parse(body);
    var items = [];
    var output = [];

    items = json.items;

    for(var i=0; i<items.length; i++) {
      var item = items[i];
      output.push({ url: item.link,
                    snippet: item.snippet,
                    thumbnail: item.thumbnailLink,
                    context: item.contextLink});
    }

    res.send(output);
  });

};

app.get('/', function(req, res) {
    res.send("Hello World");
});

app.get('/imagesearch/:query', function(req, res){
  var q = req.params.query;
  var offset = req.query.offset;
  console.log("Query = " + q + " Offset = " + offset);
  //res.send("<p> Query: " + q + "</p><p> Offset: " + offset + "</p>");
  searchForImages(q, offset, res);
});

app.get('/latest/imagesearch', function(req, res){
   res.send("<p>Latest imagesearch TBA</p>");
});

app.listen(process.env.PORT || 8085, function(){
	console.log('ImageSearch app listening on port 8085');
});
