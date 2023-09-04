import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

// Import your Room file(s)
import { LocalRoom } from "./rooms/localRoom";

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define("local", LocalRoom);
  },

  initializeExpress: (app) => {
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground);
    } else {
      app.get("/", (req, res) => {
        res.send("Server is up & running");
      });
    }

    app.use("/colyseus", monitor());
  },

  beforeListen: () => {},
});
