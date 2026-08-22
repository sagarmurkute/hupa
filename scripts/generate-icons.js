import fs from 'fs';
import path from 'path';

const buildDir = path.resolve(process.cwd(), 'build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy SVG to build as icon.svg
const svgPath = path.resolve(process.cwd(), 'public', 'favicon.svg');
const destSvg = path.resolve(buildDir, 'icon.svg');
if (fs.existsSync(svgPath)) {
  fs.copyFileSync(svgPath, destSvg);
}

function generateIcoFile(width, height, outPath) {
  const bpp = 32;
  const imageSize = width * height * 4;
  const headerSize = 40; // BITMAPINFOHEADER
  const totalBytes = 6 + 16 + headerSize + imageSize;

  const buf = Buffer.alloc(totalBytes);

  // 1. ICONDIR (6 bytes)
  buf.writeUInt16LE(0, 0); // reserved
  buf.writeUInt16LE(1, 2); // 1 = ICO
  buf.writeUInt16LE(1, 4); // 1 image

  // 2. ICONDIRENTRY (16 bytes)
  buf.writeUInt8(width >= 256 ? 0 : width, 6); // width (0 = 256)
  buf.writeUInt8(height >= 256 ? 0 : height, 7); // height (0 = 256)
  buf.writeUInt8(0, 8); // color palette count
  buf.writeUInt8(0, 9); // reserved
  buf.writeUInt16LE(1, 10); // color planes
  buf.writeUInt16LE(bpp, 12); // bits per pixel
  buf.writeUInt32LE(headerSize + imageSize, 14); // bytes in resource
  buf.writeUInt32LE(22, 18); // offset to header (6 + 16)

  // 3. BITMAPINFOHEADER (40 bytes)
  let offset = 22;
  buf.writeUInt32LE(headerSize, offset); // biSize
  buf.writeInt32LE(width, offset + 4); // biWidth
  buf.writeInt32LE(height * 2, offset + 8); // biHeight (doubled for ICO mask)
  buf.writeUInt16LE(1, offset + 12); // biPlanes
  buf.writeUInt16LE(bpp, offset + 14); // biBitCount
  buf.writeUInt32LE(0, offset + 16); // biCompression (BI_RGB)
  buf.writeUInt32LE(imageSize, offset + 20); // biSizeImage
  buf.writeInt32LE(0, offset + 24); // biXPelsPerMeter
  buf.writeInt32LE(0, offset + 28); // biYPelsPerMeter
  buf.writeUInt32LE(0, offset + 32); // biClrUsed
  buf.writeUInt32LE(0, offset + 36); // biClrImportant

  // 4. Pixel Data (Bottom-Up BGRA)
  offset = 62;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const pxOffset = offset + ((height - 1 - y) * width + x) * 4;

      if (dist <= radius) {
        // Linear gradient from Indigo (#863bff) to Cyan (#47bfff)
        const t = (x + y) / (width + height);
        const r = Math.round(134 * (1 - t) + 71 * t);
        const g = Math.round(59 * (1 - t) + 191 * t);
        const b = Math.round(255);
        const a = 255;

        // Draw inner "H" icon shape
        const isHLeftBar = x >= cx - radius * 0.45 && x <= cx - radius * 0.15 && y >= cy - radius * 0.5 && y <= cy + radius * 0.5;
        const isHRightBar = x >= cx + radius * 0.15 && x <= cx + radius * 0.45 && y >= cy - radius * 0.5 && y <= cy + radius * 0.5;
        const isHCrossBar = x >= cx - radius * 0.45 && x <= cx + radius * 0.45 && y >= cy - radius * 0.15 && y <= cy + radius * 0.15;

        if (isHLeftBar || isHRightBar || isHCrossBar) {
          // White #ffffff
          buf.writeUInt8(255, pxOffset); // B
          buf.writeUInt8(255, pxOffset + 1); // G
          buf.writeUInt8(255, pxOffset + 2); // R
          buf.writeUInt8(255, pxOffset + 3); // A
        } else {
          // Gradient badge
          buf.writeUInt8(b, pxOffset); // B
          buf.writeUInt8(g, pxOffset + 1); // G
          buf.writeUInt8(r, pxOffset + 2); // R
          buf.writeUInt8(a, pxOffset + 3); // A
        }
      } else if (dist <= radius + 1) {
        // Anti-aliasing edge
        const alpha = Math.round((1 - (dist - radius)) * 255);
        buf.writeUInt8(255, pxOffset);
        buf.writeUInt8(100, pxOffset + 1);
        buf.writeUInt8(100, pxOffset + 2);
        buf.writeUInt8(alpha, pxOffset + 3);
      } else {
        // Transparent
        buf.writeUInt8(0, pxOffset);
        buf.writeUInt8(0, pxOffset + 1);
        buf.writeUInt8(0, pxOffset + 2);
        buf.writeUInt8(0, pxOffset + 3);
      }
    }
  }

  fs.writeFileSync(outPath, buf);
}

generateIcoFile(256, 256, path.resolve(buildDir, 'icon.ico'));
fs.copyFileSync(path.resolve(buildDir, 'icon.ico'), path.resolve(buildDir, 'icon.png'));

console.log('Generated build/icon.ico and build/icon.png successfully.');
