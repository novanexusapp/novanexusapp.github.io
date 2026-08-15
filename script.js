// Vercel backend URL'ini buraya yaz
const socket = io("https://senin-backend.vercel.app");

function sendMsg() {
  const msg = document.getElementById("msg").value;
  if (msg.trim() !== "") {
    socket.emit("chat message", msg);
    document.getElementById("msg").value = "";
  }
}

socket.on("chat message", function(msg) {
  const chat = document.getElementById("chat");
  chat.innerHTML += "<p>" + msg + "</p>";
});

function sendFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  fetch("https://senin-backend.vercel.app/api/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    socket.emit("chat file", data.fileUrl);
  });
}

socket.on("chat file", function(fileUrl) {
  const chat = document.getElementById("chat");
  if (fileUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
    chat.innerHTML += `<img src="${fileUrl}" style="max-width:200px;">`;
  } else {
    chat.innerHTML += `<a href="${fileUrl}" target="_blank">Dosya indir</a>`;
  }
});
