import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("get to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const status = response.status;
  expect(status).toBe(200);

  const {
    updated_at,
    dependencies: { database },
  } = await response.json();

  const parsedDate = new Date(updated_at).toISOString();
  expect(updated_at).toEqual(parsedDate);

  expect(database.version).toEqual("16.0");

  expect(database.max_connections).toEqual(100);

  expect(database.opened_connections).toEqual(1);
});
