import { ServerRoute } from "@hapi/hapi";

export const routes: ServerRoute[] = [
  {
    method: "GET",
    path: "/health",
    handler: (request, h) => {
      return { statusCode: 200, message: "I am alright!" };
    },
  },
  {
    method: "POST",
    path: "/identify",
    handler: (request, h) => {
      return "This is the about page.";
    },
  },
  // Add more routes as needed
];
