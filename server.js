const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors());

app.use(bodyParser.json());

app.post("/print", (req, res) => {
  const { ip, zpl } = req.body;

  if (!ip || !zpl) {
    return res.status(400).send("IP y comando ZPL son necesarios");
  }

  const net = require("net");
  const client = new net.Socket();
  client.connect(9100, ip, () => {
    console.log("Conectado a la impresora");
    client.write(zpl);
    client.end();
    res.send("Impresión enviada");
  });

  client.on("error", (err) => {
    console.error("Error al conectar con la impresora:", err);
    res.status(500).send("Error al conectar con la impresora");
  });

  client.on("close", () => {
    console.log("Conexión cerrada");
  });
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
