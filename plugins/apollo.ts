/* eslint-disable @typescript-eslint/no-unused-vars */
import { createHttpLink } from "apollo-link-http";
export default function (ctx: any) {
  const link = createHttpLink({
    uri: "https://gbigbe.hasura.app/v1/graphql",
    fetch,
    headers: {
      "x-hasura-admin-secret":
        "fafdaa2dae75edb5fd37a3d9fca820e2af2cce8a2ce9b7c0497bd647aaf3a57c"
    }
  });
  return {
    link
  };
}
