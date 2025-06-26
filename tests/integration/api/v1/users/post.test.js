import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("with unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "filipe",
          email: "filipetsx@gmail.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "filipe",
        email: "filipetsx@gmail.com",
        password: "abc123",
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("user with email already taken", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado1@gmail.com",
          email: "emailteste@gmail.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2@gmail.com",
          email: "Emailteste@gmail.com",
          password: "abc123",
        }),
      });

      expect(response2.status).toBe(400);
      const responseBody = await response2.json();

      expect(responseBody).toEqual({
        message: "Error with creedentials",
        action: "Verify your creedentials and try again.",
        name: "ValidationError",
        statusCode: 400,
      });
    });
    test("user with username already taken", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "emailtestex@gmail.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response3 = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "User1",
          email: "Emw@gmail.com",
          password: "abc123",
        }),
      });

      expect(response3.status).toBe(400);
      const responseBody = await response3.json();

      expect(responseBody).toEqual({
        message: "this username is already taken.",
        action: "Verify your creedentials and try again.",
        name: "ValidationError",
        statusCode: 400,
      });
    });
  });
});
