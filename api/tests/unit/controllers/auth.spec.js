require("dotenv").config();

const authController = require("../../../controllers/auth");
const User = require("../../../models/User");

// Need to mock out bcrypt
const bcryptjs = require("bcryptjs");
jest.mock("bcryptjs");

// Need to mock out JWT
const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

const mockSend = jest.fn();
const mockJson = jest.fn();
const mockStatus = jest.fn((code) => ({
  send: mockSend,
  json: mockJson,
}));
const mockRes = { status: mockStatus };

// ----------------------------------------------------------------------------------------
// Tests won't pass unless .send method is removed from error responses

describe("auth controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("login", () => {
    test("it to resolve with token and status code 200", async () => {
      const testPswrd =
        "$2a$10$ovlXEPRhziLESsFPZaxlNenr9f6orAFcVX0ed9MeEhEBJXBmybO0u";
      const testUser = {
        username: "nplatton",
        password: "nplatton",
      };
      jest
        .spyOn(User, "findByUsername")
        .mockResolvedValue(
          new User({ username: testUser.username, password_digest: testPswrd })
        );
      jest.spyOn(bcryptjs, "compare").mockResolvedValueOnce(true);
      jest.spyOn(jwt, "sign").mockResolvedValue("testtoken");
      const mockReq = { body: testUser };
      await authController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalled();
    });

    test("it responds with 401 if no username sent in request body", async () => {
      const testUser = {
        password: "testword",
      };
      const mockReq = { body: testUser };
      await authController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(401);
    });

    test("it responds with 401 if no password sent in request body", async () => {
      const testUser = {
        username: "tester",
      };
      const mockReq = { body: testUser };
      await authController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(401);
    });

    // test("it responds with code 401 in case of unsuccessful token generation", async () => {
    //   const testPswrd = "testword";
    //   const testUser = {
    //     username: "tester",
    //     password: "testword",
    //   };
    //   jest
    //     .spyOn(User, "findByUsername")
    //     .mockResolvedValue(
    //       new User({ ...testUser, password_digest: testPswrd })
    //     );
    //   jest.spyOn(bcryptjs, "compare").mockResolvedValueOnce(true);
    //   jest.spyOn(jwt, "sign").mockImplementation(() => {
    //     throw new Error();
    //   });
    //   const mockReq = { body: testUser };
    //   await authController.login(mockReq, mockRes);
    //   expect(mockStatus).toHaveBeenCalledWith(401);
    // });

    test("it responds with code 401 in case of invalid password", async () => {
      const testUser = {
        username: "tester",
        password: "testword",
      };
      jest.spyOn(User, "findByUsername").mockResolvedValue(new User(testUser));
      jest.spyOn(bcryptjs, "compare").mockResolvedValueOnce(false);
      const mockReq = { body: testUser };
      await authController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(401);
    });

    test("it responds with code 401 in case of no user", async () => {
      const testUser = {
        username: "tester",
        password: "testword",
      };
      jest.spyOn(User, "findByUsername").mockResolvedValue(null);
      const mockReq = { body: testUser };
      await authController.login(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(401);
    });
  });

  describe("register", () => {
    test("it returns success message with 201 status code", async () => {
      const testUser = {
        username: "tester",
        password: "testword",
      };
      jest.spyOn(User, "findIfUsernameExists").mockResolvedValueOnce(false);
      jest.spyOn(User, "create").mockResolvedValue("User created!");
      const mockReq = { body: testUser };
      await authController.register(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(201);
    });

    test("it responds with code 500 if user already exists", async () => {
      const testUser = {
        username: "tester",
        password: "testword",
      };
      jest.spyOn(User, "findIfUsernameExists").mockResolvedValueOnce(true);
      const mockReq = { body: testUser };
      await authController.register(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(500);
    });

    test("it responds with code 500 in case of error", async () => {
      const testUser = {
        username: "tester",
        password: "testword",
      };
      jest.spyOn(User, "create").mockImplementation(() => {
        throw new Error();
      });
      const mockReq = { body: testUser };
      await authController.register(mockReq, mockRes);
      expect(mockStatus).toHaveBeenCalledWith(500);
    });
  });
});
