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
         const col1 = db.collection("users");
         col1.drop();

         // Construct a document

         let userDocument = [
            {
              username: "ewhite1999",
              password_digest:
                "$2a$10$tCppT1FG0aaUBFeYpFfDX..sitL9Hj4sHGyZHh6r5OUTLEvAcIorq",
            },
            {
              username: "gi-ba-bu",
              password_digest:
                "$2a$10$1r.PF9X3eD8KmZmIBdrK5ufokHBePZrNXv564aKijge2rZDp0hDju",
            },
            {
              username: "jalexxx",
              password_digest:
                "$2a$10$trsIf9zyAe.xiKQpanD5jOtD3if0lY.h4IQp/JfEsYCeL8m6rVHIe",
            },
            {
              username: "nplatton",
              password_digest:
                "$2a$10$ovlXEPRhziLESsFPZaxlNenr9f6orAFcVX0ed9MeEhEBJXBmybO0u",
            },
            {
              username: "saminakhan999",
              password_digest:
                "$2a$10$tr7TlkmfM8CAsbGCbA.ooe0GRAhjilm0eqhe6Ed3svL8BJCbCRVGK",
            },
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
