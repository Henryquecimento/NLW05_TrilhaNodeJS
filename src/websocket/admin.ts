import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionsService";
import { MessagesService } from "../services/MessagesService";

io.on("connect", async (socket) => {
  const connectionsService = new ConnectionsService();
  const messagesService = new MessagesService();

  const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

  io.emit("admin_list_all_users", allConnectionsWithoutAdmin);

  //Bringing all clients messages
  socket.on("admin_list_messages_by_user", async (params, callback) => {
    const { user_id } = params;

    const allMessages = await messagesService.listByUser(user_id);

    callback(allMessages);
  });

  // SEND MESSAGE

  socket.on("admin_send_message", async (params) => {
    const { user_id, text } = params;

    //Saving the admin message
    await messagesService.create({
      text,
      user_id,
      admin_id: socket.id,
    });

    //User socket
    const { socket_id } = await connectionsService.findByUserId(user_id);

    //Now the client(chat.js) needs to hear this event
    io.to(socket_id).emit("admin_send_to_client", {
      text,
      socket_id: socket.id,
    });
  });

  socket.on("admin_user_in_support", async (params) => {
    //Now I need to update my connection to put a Admin to it
    const { user_id } = params;
    // Socket.id -> ID do ADMIN
    const connection = await connectionsService.updateAdminId(
      user_id,
      socket.id
    );

    //Updating the list
    const allConnectionsWithoutAdmin = await connectionsService.findAllWithoutAdmin();

    io.emit("admin_list_all_users", allConnectionsWithoutAdmin);
  });
});
