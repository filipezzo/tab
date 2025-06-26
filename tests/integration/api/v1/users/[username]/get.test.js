import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("with exact case", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "exactcase",
          email: "exact@gmail.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/exactcase",
      );

      expect(response2.status).toBe(200);
    });

    test("with case mismatch", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Mismatch",
          email: "Mismatch@gmail.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/mismatch",
      );

      expect(response2.status).toBe(200);
      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        id: response2Body.id,
        username: "Mismatch",
        email: "Mismatch@gmail.com",
        password: "abc123",
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });
    });

    test("with user not found", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "notfound",
          email: "notfound@gmail.com",
          password: "abc123",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        "http://localhost:3000/api/v1/users/notfoundx",
      );

      expect(response2.status).toBe(404);
      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "NotFoundError",
        message: "username not found",
        action: "verify the username param",
        statusCode: 404,
      });
    });
  });
});
