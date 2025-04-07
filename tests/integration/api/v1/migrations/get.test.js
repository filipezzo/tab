import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

test("get to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  const body = await response.json();
  expect(response.status).toBe(200);
  expect(Array.isArray(body)).toBe(true);

  expect(body.length).toBeGreaterThan(0);
});
