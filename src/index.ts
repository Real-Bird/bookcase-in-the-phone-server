import dotenv from "dotenv";
import app from "./app";
import connect from "./db/index";
import path from "path";
import https from "https";
import fs from "fs";

dotenv.config();
const port = process.env.PORT || 8001;
const __DEV__ = process.env.NODE_ENV !== "production";
connect();

if (__DEV__) {
  const keyPath = path.join(__dirname, "..", "dev", "config", "key.pem");
  const certPath = path.join(__dirname, "..", "dev", "config", "cert.pem");

  const httpsServer = https.createServer(
    { key: fs.readFileSync(keyPath), cert: fs.readFileSync(certPath) },
    app
  );

  httpsServer.listen(port, () => {
    console.log(port, "번 포트에서 대기 중");
  });
} else {
  app.listen(port, () => {
    console.log(port, "번 포트에서 대기 중");
  });
}
