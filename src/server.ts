import { http } from "./http";
import "./websocket/client";

http.listen(4000, () => {
  console.log("Server is running normally!");
});
