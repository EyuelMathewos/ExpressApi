const mongodb = require('mongodb');
const ObjectID = require('mongodb').ObjectID;
const uri = process.env.MONGODBURL;
const dbName = 'MovieSource';
const client = new mongodb.MongoClient(uri,{ 
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db;


    // function main (){
    //     console.log("main is running");
    // }

module.exports = {
    connectToServer: function(callback) {
    client.connect(function(error) {
        //assert.ifError(error);
        db = client.db(dbName);
        //const collection = db.collection('documents');
        console.log("db connected successfully!");
        return callback(error);
      });
 },
 getDb: function() {
    // console.log(db)
    return db = client.db(dbName);
 },
 
filtter: function ( collection, value){
    return new Promise( async function(resolve, reject) {
    try {        
       // var objectID = new ObjectID(value);
        let val = await db.collection(collection).find(value).toArray();
        // console.log("value found account "+val.length);
        // if (val.length > 0) {
        //     return ('E-mail already in use');
        // }
        resolve(val);
    } catch (error) {
        reject(error);
        // if (error) {
        //     console.log(`Error worth logging: ${error}`); // special case for some reason
        //     return ('main server not responding');
        // }
    }
});
},


create:  function (collection, value) {

    return new Promise( async function(resolve, reject) {
       try{
         let res = await db.collection(collection).insertOne(value)
         resolve(res);
       }catch (error){
        reject(error);
       }
    });
  },
  getAll: async function (collection){
    try {
        let val = await db.collection(collection).find({}).toArray();
        console.log("value found account "+val.length);
        return (val);

    } catch (error) {
        if (error) {
            console.log(`Error worth logging: ${error}`);
            return ('main server not responding');
        }}
    
},
update: function (collection, id, value, data){
    return new Promise( async function(resolve, reject) {
    try {        
        var objectID = new ObjectID(value);
        let val = await db.collection(collection).updateOne({[id] : objectID}, { $set: data });
        resolve(val);
    } catch (error) {
        reject(error);
    }
});
},
delete: function (collection, id ,value){
    return new Promise( async function(resolve, reject) {
    try {     
        var objectID = new ObjectID(value);
        let val = await db.collection(collection).deleteOne({[id] :objectID});
        resolve(val);
    } catch (error) {
        reject(error);
    }
});
}

};