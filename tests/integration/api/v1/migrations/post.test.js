import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("DROP schema public cascade; CREATE schema public;");
}

test("post to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const body = await response.json();
  console.log(body);

  expect(response.status).toBe(201);
  expect(Array.isArray(body)).toBe(true);
  expect(body.length).toBeGreaterThan(0);
  expect(body.some((migration) => "path" in migration)).toBe(true);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  const body2 = await response2.json();

  expect(response2.status).toBe(200);
  expect(Array.isArray(body2)).toBe(true);
  expect(body2.length).toBe(0);
});
