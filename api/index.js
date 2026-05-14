import handler from "../dist/server/index.js";

export const config = {
  runtime: "nodejs",
};

export default async function (request) {
  try {
    return await handler.fetch(request, {}, {});
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
