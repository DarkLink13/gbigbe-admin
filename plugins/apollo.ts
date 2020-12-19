/* eslint-disable @typescript-eslint/no-unused-vars */
import { createHttpLink } from "apollo-link-http";
export default function (ctx: any) {
  const link = createHttpLink({
    uri: "https://gbigbe.hasura.app/v1/graphql",
    fetch,
    headers: {
      "x-hasura-admin-secret": localStorage.getItem("token")
    }
  });
  return {
    link
  };
}
