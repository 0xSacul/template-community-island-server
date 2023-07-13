/*
    Here, we import the app configuration and start the server (aka listen).
*/

import { listen } from "@colyseus/tools";
import app from "./app.config";

listen(app);
