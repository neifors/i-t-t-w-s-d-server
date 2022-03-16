const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb+srv://";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "cluster0";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);

         // Use the collection "users"
         const col1 = db.collection("scores");
         col1.drop();

         // Construct a document

         let userDocument = [
            {cat: "maths", username: "ewhite1999", score: 20},
            {cat: "physics", username: "nplatton", score: 23},
            {cat: "movies", username: "saminakhan999", score: 16},
            {cat: "animals", username: "gi-ba-bu", score: 23},
            {cat: "movies", username: "jalexxx", score: 18},
          
            {cat: "maths", username: "nplatton", score: 21},
            {cat: "physics", username: "saminakhan999", score: 24},
            {cat: "movies", username: "gi-ba-bu", score: 8},
            {cat: "animals", username: "jalexxx", score: 2},
            {cat: "movies", username: "ewhite1999", score: 1},
            
            {cat: "maths", username: "saminakhan999", score: 30},
            {cat: "physics", username: "gi-ba-bu", score: 19},
            {cat: "movies", username: "jalexxx", score: 9},
            {cat: "animals", username: "ewhite1999", score: 21},
            {cat: "movies", username: "nplatton", score: 18}
           ]

         // Insert all documents, wait for promise so we can read them back
         await col1.insertMany(userDocument);
         // Find all documents
         let myCol1 = await col1.find().toArray();
         // Print to the console
         console.log(myCol1);

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
