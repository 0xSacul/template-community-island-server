import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

/*
  Import your Room files
*/
import { exampleRoom } from "./rooms/exampleRoom";

export default config({
  initializeGameServer: (gameServer) => {
    /*
      Define your room handlers:
    */
    gameServer.define("exampleRoom", exampleRoom);
  },

  initializeExpress: (app) => {
    /*
      Define any custom Express routes before registering @colyseus/social routes.

      For example, here we define a basic route to either, return the playground if you're
      running in development mode, or a simple message if you're running in production mode.
    */
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
    } else {
      app.get("/", (req, res) => {
        res.send("Server is up and running.");
      });
    }

    /*
      This is the monitor panel, where you can see your room(s), the user(s) connected to each room,
      and the state of each room.

      Warning: This route should be secured with some basic Auth middleware before you deploy to production.
    */
    app.use("/admin", monitor());
  },

  beforeListen: () => {},
});
