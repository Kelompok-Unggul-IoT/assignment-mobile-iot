mqtt = require("mqtt");

const client = mqtt.connect("mqtt://mqtt.rekycode.id:1883", {
  clientId: "mqtt_nodejs_cli",
  username: "reky",
  password: "reky.iot",
});
client.on("connect", function () {
  console.log("connected");
  client.subscribe("reky/iot#", err => {
    if (!err) {
      client.publish("reky/iot", "Hello mqtt");
    }
  });
});

client.on("message", (topic, message) => {
  console.log(message.toString());
});

client.on("error", function (error) {
  console.log("Can't connect" + error);
});

client.on('disconnect', function () {
  console.log("Disconnected");
});

client.on('offline', function () {
  console.log("Offline");
});