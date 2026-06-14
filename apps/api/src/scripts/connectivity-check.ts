import "dotenv/config";
import { ConnectivityService } from "../health/connectivity.service";

async function main() {
  const service = new ConnectivityService();
  const report = await service.runChecks();

  console.log(JSON.stringify(report, null, 2));

  if (report.status !== "ok") {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
