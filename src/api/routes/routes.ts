import { ServerRoute } from "@hapi/hapi";
import {
  createContactPayloadSchema,
  createContactHandler,
} from "../handlers/contacts/create.js";
import { getContactsHandler } from "../handlers/contacts/getAll.js";
import {
  identifyPayloadSchema,
  identifyHandler,
} from "../handlers/contacts/identify.js";

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
    path: "/contacts",
    options: {
      description: "Create a contact",
      validate: {
        payload: createContactPayloadSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
      handler: createContactHandler,
    },
  },
  {
    method: "GET",
    path: "/contacts",
    options: {
      description: "Get all contacts",
      handler: getContactsHandler,
    },
  },
  {
    method: "POST",
    path: "/identify",
    options: {
      tags: ["api"],
      description: "Identifies and merges user contacts",
      validate: {
        payload: identifyPayloadSchema,
        failAction: (request, h, err) => {
          throw err;
        },
      },
      handler: identifyHandler,
    },
  },
];
