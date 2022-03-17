const { init } = require("../dbConfig/config");

class User {
  constructor(data) {
    this.id = data._id;
    this.username = data.username;
    this.passwordDigest = data.password_digest;
  }

  static get all() {
    return new Promise(async (res, rej) => {
      try {
        const db = await init();
        const usersData = await db.collection("users").find().toArray();
        if (!usersData.length) {
          throw new Error("No users found");
        }
        const users = usersData.map((d) => new User(d));
        res(users);
      } catch (err) {
        rej(err);
      }
    });
  }

  static findByUsername(username) {
    return new Promise(async (res, rej) => {
      try {
        const db = await init();
        const userData = await db
          .collection("users")
          .find({ username: { $eq: username } })
          .toArray();
        if (!userData.length) {
          throw new Error("User not found");
        }
        const user = new User(userData[0]);
        res(user);
      } catch (err) {
        rej(err);
      }
    });
  }

  static findIfUsernameExists(username) {
    return new Promise(async (res, rej) => {
      try {
        const db = await init();
        const userData = await db
          .collection("users")
          .find({ username: { $eq: username } })
          .toArray();
        res(!!userData.length);
      } catch (err) {
        rej(err);
      }
    });
  }

  static create(data) {
    return new Promise(async (res, rej) => {
      try {
        const db = await init();
        await db.collection("users").insertOne(data);
        res("User created");
      } catch (err) {
        rej(err);
      }
    });
  }

  static changePassword(username, newPassword) {
    return new Promise(async (res, rej) => {
      try {
        const db = await init();
        await db
          .collection("users")
          .findOneAndUpdate(
            { username: { $eq: username } },
            { $set: { password_digest: newPassword } }
          );
        res("Password updated");
      } catch (err) {
        rej(err);
      }
    });
  }

  // destroy() {
  //   return new Promise(async (res, rej) => {
  //     try {
  //       const db = await init();
  //       await db
  //         .collection("users")
  //         .deleteOne({ username: { $eq: this.username } });
  //       res("User deleted");
  //     } catch (err) {
  //       rej(err);
  //     }
  //   });
  // }
}

module.exports = User;
