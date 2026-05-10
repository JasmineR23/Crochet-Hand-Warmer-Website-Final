/**
 * Auth Controller Unit Tests (ESM backend + Jest CJS tests)
 * This file runs in CommonJS mode because backend/tests/package.json sets:
 * { "type": "commonjs" }
 *
 * We must use jest.unstable_mockModule() to mock ESM modules BEFORE importing them.
 */

// --- Mock ESM modules BEFORE importing them ---
jest.unstable_mockModule("../../src/config/db.js", () => ({
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    }
  }
}));

jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  }
}));

jest.unstable_mockModule("jsonwebtoken", () => ({
  default: {
    sign: jest.fn(),
  }
}));

// --- Variables to hold imported modules ---
let signup, login;
let prisma;
let bcrypt;
let jwt;

// --- Import ESM modules AFTER mocks are applied ---
beforeAll(async () => {
  const controller = await import("../../src/controllers/authController.js");
  signup = controller.signup;
  login = controller.login;

  prisma = (await import("../../src/config/db.js")).default;
  bcrypt = (await import("bcryptjs")).default;
  jwt = (await import("jsonwebtoken")).default;
});

// --- Helper to mock req/res ---
const mockReqRes = (body = {}) => {
  const req = { body };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  return { req, res };
};

// ----------------------
// SIGNUP TESTS
// ----------------------
describe("Auth Controller - Signup", () => {
  test("signup fails if email already exists", async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });

    const { req, res } = mockReqRes({
      username: "Jasmine",
      email: "test1@gmail.com",
      password: "123456",
    });

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email already registered",
    });
  });

  test("signup succeeds and returns token", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedpw");

    prisma.user.create.mockResolvedValue({
      id: 1,
      username: "testuser1",
      email: "testuser1@gmail.com",
    });

    jwt.sign.mockReturnValue("mocktoken");

    const { req, res } = mockReqRes({
      username: "testuser1",
      email: "testuser1@gmail.com",
      password: "testuser1password",
    });

    await signup(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Signup successful",
      user: {
        id: 1,
        username: "testuser1",
        email: "testuser1@gmail.com",
      },
      token: "mocktoken",
    });
  });
});

// ----------------------
// LOGIN TESTS
// ----------------------
describe("Auth Controller - Login", () => {
  test("login fails if user not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const { req, res } = mockReqRes({
      email: "testuser2@gmail.com",
      password: "testuser2password",
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  test("login fails if password is wrong", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 3,
      email: "testuser3@gmail.com",
      password: "hashedpw",
    });

    bcrypt.compare.mockResolvedValue(false);

    const { req, res } = mockReqRes({
      email: "testuser3@gmail.com",
      password: "wrongpw",
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  test("login succeeds and returns token", async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 4,
      email: "testuser4@gmail.com",
      password: "hashedpw",
    });

    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mocktoken");

    const { req, res } = mockReqRes({
      email: "testuser4@gmail.com",
      password: "testuser4password",
    });

    await login(req, res);

    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      user: {
        id: 4,
        username: undefined,
        email: "testuser4@gmail.com",
      },
      token: "mocktoken",
    });
  });
});
