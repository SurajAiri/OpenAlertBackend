// var admin = require("firebase-admin");
import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve(process.env.FIREBASE_SECRET_KEY_PATH);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
