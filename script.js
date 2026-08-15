// Vercel backend URL'in
const socket = io("https://novanexus-backend.vercel.app");

// Mesaj gönderme
function sendMsg() {
  const msg = document.getElementById("msg").value;
  if (msg.trim() !== "") {
    socket.emit("chat message", msg);
    document.getElementById("msg").value = "";
  }
}

// Gelen mesajları göster
socket.on("chat message", function(msg) {
  const chat = document.getElementById("chat");
  chat.innerHTML += "<p>" + msg + "</p>";
});

// Dosya gönderme
function sendFile() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  fetch("https://novanexus-backend.vercel.app/api/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    socket.emit("chat file", data.fileUrl);
  })
  .catch(err => console.error("Dosya yükleme hatası:", err));
}

// Gelen dosyaları göster
socket.on("chat file", function(fileUrl) {
  const chat = document.getElementById("chat");
  if (fileUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
    chat.innerHTML += `<img src="${fileUrl}" style="max-width:200px;">`;
  } else {
    chat.innerHTML += `<a href="${fileUrl}" target="_blank">Dosya indir</a>`;
  }
});
