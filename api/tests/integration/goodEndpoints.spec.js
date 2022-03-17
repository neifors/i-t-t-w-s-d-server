describe("successful endpoints", () => {
  let api;
  let token;

  beforeAll(async () => {
    api = app.listen(port, () =>
      console.log("Test server running on port 5000...")
    );
    await resetTestDB();
    const loginResponse = await request(api)
      .post("/auth/login")
      .send({ username: "nplatton", password: "nplatton" })
      .set("Accept", "application/json");
    token = loginResponse._body.token;
  }, 100000);

  beforeEach(async () => {
    console.log("-----------------------------------");
    await resetTestDB();
  });

  afterAll(async () => {
    console.log("Stopping test server");
    // await api.close((err) => {});
  });

  describe("user", () => {
    describe("authenticated GET /", () => {
      test("it should return all users", async () => {
        const res = await request(api)
          .get("/users")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(5);
      });
    });

    describe("unauthenticated GET /", () => {
      test("it should return 403 in case of invalid token", async () => {
        const res = await request(api)
          .get("/users")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated GET /:username", () => {
      test("it should retrieve user based on username", async () => {
        const res = await request(api)
          .get("/users/jalexxx")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.username).toEqual("jalexxx");
      });
    });

    describe("unauthenticated GET /:username", () => {
      test("it should return 403 if invalid token sent", async () => {
        const res = await request(api)
          .get("/users/jalexxx")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated PATCH /:username", () => {
      test("it should return 200 if correct password provided", async () => {
        console.log("-- START --");
        const res = await request(api)
          .patch("/users/nplatton")
          .send({
            password: "nplatton",
            newPassword: "smelly",
          })
          .set("Accept", "application/json")
          .set("authorization", token);
        expect(res.statusCode).toEqual(200);
      });

      test("it should return 500 if wrong password sent", async () => {
        const res = await request(api)
          .patch("/users/nplatton")
          .send({
            password: "smelly",
            newPassword: "smelly",
          })
          .set("Accept", "application/json")
          .set("authorization", token);
        expect(res.statusCode).toEqual(500);
      });
    });

    describe("unauthenticated PATCH /:username", () => {
      test("it should return 403 error on invalid token", async () => {
        const res = await request(api)
          .patch("/users/nplatton")
          .send({
            password: "nplatton",
            newPassword: "smelly",
          })
          .set("Accept", "application/json")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
        console.log("-- END --");
      });
    });
  });

  describe("score", () => {
    describe("authenticated GET /", () => {
      test("it should retrieve all users scores", async () => {
        const res = await request(api)
          .get("/scores")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(6);
      });
    });

    describe("unauthenticated GET /", () => {
      test("it should throw 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated GET /username/:username", () => {
      test("it should retrieve all cat data for user", async () => {
        const res = await request(api)
          .get("/scores/username/jalexxx")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
      });

      test("it should return 404 if no user", async () => {
        const res = await request(api)
          .get("/scores/username/tester")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe("unauthenticated GET /username/:username", () => {
      test("it returns 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores/username/jalexxx")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated GET /cat/:cat", () => {
      test("it should retrieve all scores for a category", async () => {
        const res = await request(api)
          .get("/scores/cat/movies")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
      });

      test("it should retrieve all scores for a category", async () => {
        const res = await request(api)
          .get("/scores/cat/physics")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1);
      });

      test("it should return 404 if no category", async () => {
        const res = await request(api)
          .get("/scores/cat/test")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe("unauthenticated GET /cat/:cat", () => {
      test("it returns 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores/cat/test")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated GET /username/:username/cat/:cat", () => {
      test("it should retrieve score for given username and category", async () => {
        const res = await request(api)
          .get("/scores/username/jalexxx/cat/movies")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.score).toEqual(18);
      });

      test("it should retrieve score for given username and category", async () => {
        const res = await request(api)
          .get("/scores/username/gi-ba-bu/cat/animals")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.score).toEqual(23);
      });

      test("it should return 404 if no score for given pair", async () => {
        const res = await request(api)
          .get("/scores/username/gi-ba-bu/cat/movies")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(404);
      });
    });

    describe("unauthenticated GET /username/:username/cat/:cat", () => {
      test("should return 403 error if invalid token sent", async () => {
        const res = await request(api)
          .get("/scores/username/gi-ba-bu/cat/movies")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated GET /leadersboard", () => {
      test("it retrieves array of highest scores", async () => {
        const res = await request(api)
          .get("/scores/leadersboard")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(4);
      });
    });

    describe("unauthenticated GET /leadersboard", () => {
      test("it retrieves array of highest scores", async () => {
        const res = await request(api)
          .get("/scores/leadersboard")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated POST /post", () => {
      test("it returns 201 in case of success and updates score db - new score is higher", async () => {
        const res = await request(api)
          .post("/scores/post")
          .send({
            username: "jalexxx",
            cat: "movies",
            score: 20,
          })
          .set("authorization", token);
        expect(res.statusCode).toEqual(201);
        const newRes = await request(api)
          .get("/scores/username/jalexxx/cat/movies")
          .set("authorization", token);
        expect(newRes.body.score).toBe(20);
      });

      test("it returns 201 in case of success and updates score db - new score is lower", async () => {
        const res = await request(api)
          .post("/scores/post")
          .send({
            username: "jalexxx",
            cat: "movies",
            score: 16,
          })
          .set("authorization", token);
        expect(res.statusCode).toEqual(201);
        const newRes = await request(api)
          .get("/scores/username/jalexxx/cat/movies")
          .set("authorization", token);
        expect(newRes.body.score).toBe(18);
      });

      test("it returns 201 in case of success and updates score db - no previous score in category", async () => {
        const res = await request(api)
          .post("/scores/post")
          .send({
            username: "jalexxx",
            cat: "physics",
            score: 12,
          })
          .set("authorization", token);
        expect(res.statusCode).toEqual(201);
        const newRes = await request(api)
          .get("/scores/username/jalexxx/cat/physics")
          .set("authorization", token);
        expect(newRes.body.score).toBe(12);
      });

      test("it returns 500 in case of error", async () => {
        const res = await request(api)
          .post("/scores/post")
          .send({
            username: "tester",
            cat: "movies",
          })
          .set("authorization", token);
        expect(res.statusCode).toEqual(500);
      });
    });

    describe("unauthenticated POST /post", () => {
      test("it returns 403 error if invalid token", async () => {
        const res = await request(api)
          .post("/scores/post")
          .send({
            username: "tester",
            cat: "movies",
            score: 1,
          })
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });

    describe("authenticated DELETE /username/:username", () => {
      test("it destroys a users data", async () => {
        const res = await request(api)
          .delete("/scores/username/nplatton")
          .set("Accept", "application/json")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(204);
      });

      test("it throws 500 error if username is too long", async () => {
        const res = await request(api)
          .delete("/scores/username/nplattonsndvlsndlvnaeinienpiafnpe")
          .set("Accept", "application/json")
          .set("authorization", token)
          .set("Accept", "application/json");
        expect(res.statusCode).toEqual(500);
      });
    });

    describe("unauthenticated DELETE /username/:username", () => {
      test("it won't destroy a users data if bad token given", async () => {
        const res = await request(api)
          .delete("/scores/username/nplatton")
          .set("Accept", "application/json")
          .set("authorization", "Bearer VERY.GOOD.REAL.TOKEN");
        expect(res.statusCode).toEqual(403);
      });
    });
  });

  describe("auth", () => {
    describe("POST /login", () => {
      test("it retrieves object containing success=true and a token", async () => {
        const res = await request(api)
          .post("/auth/login")
          .send(JSON.stringify({ username: "jalexxx", password: "jalexxx" }))
          .set("Content-Type", "application/json");
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeTruthy();
      });
    });

    describe("POST /register", () => {
      test("it adds a user to the db", async () => {
        const res = await request(api)
          .post("/auth/register")
          .send(JSON.stringify({ username: "tester", password: "tester" }))
          .set("Content-Type", "application/json");
        expect(res.statusCode).toEqual(201);
        expect(res.body.msg).toMatch(/user created/i);
        const newRes = await request(api)
          .get("/users/tester")
          .set("authorization", token);
        expect(newRes.body).toBeTruthy();
      }, 100000);

      // test("it throws 500 error if username is too long", async () => {
      //   const res = await request(api)
      //     .post("/auth/register")
      //     .send(
      //       JSON.stringify({
      //         username: "testersoubvlsbvowhvipwhepivhaed",
      //         password: "tester",
      //       })
      //     )
      //     .set("Content-Type", "application/json");
      //   expect(res.statusCode).toEqual(500);
      // }, 200000);

      // test("it throws 500 error if password is not provided", async () => {
      //   const res = await request(api)
      //     .post("/auth/register")
      //     .send(
      //       JSON.stringify({
      //         username: "tester",
      //       })
      //     )
      //     .set("Content-Type", "application/json");
      //   expect(res.statusCode).toEqual(500);
      // }, 200000);
    });
  });
});
