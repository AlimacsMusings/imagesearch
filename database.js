
const mongoClient = require('mongodb').MongoClient;

const databaseName = "imagesearch";
const collectionName = "images";
const mongoURL = "mongodb://localhost:27017/" + databaseName;


exports.saveSearch = function(searchString, error) {

  mongoClient.connect(mongoURL, function(err, db) {
    if (err) callback(err);
      var coll = db.collection(collectionName);
      var imgsearch = { "term" : searchString, "when" : new Date() };
      //console.log("NEW ID to save to database: " + JSON.stringify(imgsearch));

      coll.insertOne(imgsearch, function(err, data) {
        if(err) throw err;
        console.log("Saved to database " + JSON.stringify(data));
      });
      db.close();
  });
};


exports.getSearches =  function(callback) {

  mongoClient.connect(mongoURL, function(err, db){
    if(err) throw(err);
      var coll = db.collection(collectionName);
      var output = [];
      coll.find().toArray(function(err, data) {
        if (err) callback(err);
        if(data !== null && data.length >=1) {
          //console.log("DB retrieved : " + JSON.stringify(data));
          for(var i=0; i<data.length; i++) {
            var item = data[i];
            output.push({term : item.term,
                         when : item.when});
          }
          //console.log("Output " + JSON.stringify(output));
          callback(output);
        }
    });
    db.close();
  });

}
