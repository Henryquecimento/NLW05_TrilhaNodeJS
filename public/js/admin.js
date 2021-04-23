const socket = io();
let connectionsUsers = [];
let connectionInSupport = []; //Fixing client to admin error

socket.on("admin_list_all_users", (connections) => {
  connectionsUsers = connections;

  document.getElementById("list_users").innerHTML = "";

  let template = document.getElementById("template").innerHTML;

  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    document.getElementById("list_users").innerHTML += rendered;
  });
});

function call(id) {

  //Bring me ONe connection
  const connection = connectionsUsers.find(connection => connection.socket_id === id);

  connectionInSupport.push(connection) //Fixing client to admin error

  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id
  });

  document.getElementById("supports").innerHTML += rendered;


  const params = {
    user_id: connection.user_id
  }

  socket.emit("admin_user_in_support", params); //List of users in support

  socket.emit("admin_list_messages_by_user", params, (messages) => {

    const divMessages = document.getElementById(`allMessages${connection.user_id}`);

    messages.forEach((message) => {
      const createDiv = document.createElement("div");

      if (message.admin_id === null) {

        //CLIENT

        createDiv.className = "admin_message_client";

        createDiv.innerHTML = `<span>${connection.user.email}</span>`;
        createDiv.innerHTML += `<span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date" > ${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

      } else {

        //ADMIN

        createDiv.className = "admin_message_admin";

        createDiv.innerHTML = `Atendente: <span>${message.text}</span>`;
        createDiv.innerHTML += `<span class="admin_date" > ${dayjs(message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

      }

      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    text: text.value,
    user_id: id
  }

  socket.emit("admin_send_message", params);


  const divMessages = document.getElementById(`allMessages${id}`);
  const createDiv = document.createElement("div");

  //ADMIN
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `Atendente: <span>${params.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date" > ${dayjs().format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(createDiv);

  //To clean our message's field
  text.value = ""
}

socket.on("admin_receive_message", (data) => {
  //Na aula tava 'connection.socket_id = data.socket_id' tava dando erro no AppendChild
  //const connection = connectionsUsers.find(connection => connection.socket_id === data.socket_id);
  const connection = connectionInSupport.find(connection => connection.socket_id === data.socket_id); //Fixing client to admin error

  const divMessages = document.getElementById(`allMessages${connection.user_id}`);
  const createDiv = document.createElement("div");

  //CLIENT

  createDiv.className = "admin_message_client";

  createDiv.innerHTML = `<span>${connection.user.email}</span>`;
  createDiv.innerHTML += `<span>${data.message.text}</span>`;
  createDiv.innerHTML += `<span class="admin_date" > ${dayjs(data.message.created_at).format("DD/MM/YYYY HH:mm:ss")}</span>`;

  divMessages.appendChild(createDiv);
})
