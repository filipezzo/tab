test("get to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const status = response.status;

  expect(status).toBe(200);
});
