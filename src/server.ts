import { Server } from "@hapi/hapi";
import { routes } from "./api/routes/routes.js";
import { sequelize } from "./sequelize.js";
import "./api/models/Contact.js"
const init = async () => {
  const server = new Server({
    port: 3000,
    host: "localhost",
  });

  server.route(routes);
  await sequelize.authenticate();
  console.log(`✅ Connected to postgres db`);
  await sequelize.sync();
  console.log(`🔁 Syncing sequelize...`);

  await server.start();
  console.log(`✅ Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();
