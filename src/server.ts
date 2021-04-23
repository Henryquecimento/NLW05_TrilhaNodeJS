import { http } from "./http";
import "./websocket/client";
import "./websocket/admin";

http.listen(4000, () => {
  console.log("Server is running normally!");
});
