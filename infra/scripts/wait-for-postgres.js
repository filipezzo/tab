const { exec } = require("node:child_process");
function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", (_, stdout) => {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\nPostgres is ready and accepting connections.\n");
  });
}

process.stdout.write("\n\n🕰️ Waiting for postgres connection.");
checkPostgres();
