import controller from "infra/controller";
import { user } from "models/user";

import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userData = await user.findOneByUsername(request.query.username);
  return response.status(200).json(userData);
}
