import controller from "infra/controller";
import { user } from "models/user";

import { createRouter } from "next-connect";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userData = await user.create(request.body);
  return response.status(201).json(userData);
}
