// fix-images.js
import fs from "fs";
import sharp from "sharp";

const images = [
  "assets/icon.png",
  "assets/adaptive-icon.png",
  "assets/splash-icon.png"
];

for (const path of images) {
  if (!fs.existsSync(path)) {
    console.log("⚠️  Not found:", path);
    continue;
  }
  const tmp = path + ".tmp.png";
  await sharp(path)
    .png({ compressionLevel: 9 })
    .toFile(tmp);
  fs.renameSync(tmp, path);
  console.log("✅ Fixed CRC:", path);
}

