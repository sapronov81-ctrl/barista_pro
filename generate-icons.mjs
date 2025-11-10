// generate-icons.mjs
import sharp from "sharp";
import fs from "fs";

async function createImage(width, height, text, output) {
  const svg = `
  <svg width="${width}" height="${height}">
    <rect width="100%" height="100%" fill="#ffffff"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${Math.min(
      width,
      height
    ) / 5}" fill="#000000" text-anchor="middle" alignment-baseline="middle">
      ${text}
    </text>
  </svg>`;
  await sharp(Buffer.from(svg))
    .png()
    .toFile(output);
  console.log("✅ Generated:", output);
}

fs.mkdirSync("assets", { recursive: true });

await createImage(512, 512, "ICON", "assets/icon.png");
await createImage(1024, 1024, "ADAPT", "assets/adaptive-icon.png");
await createImage(1242, 2436, "SPLASH", "assets/splash-icon.png");

console.log("🎨 All icons generated successfully!");
