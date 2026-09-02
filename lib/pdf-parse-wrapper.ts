if (typeof (global as any).DOMMatrix === "undefined") {
  (global as any).DOMMatrix = class DOMMatrix {
    constructor(init?: any) { return this; }
    translate(x = 0, y = 0) { return this; }
    scale(x = 1, y = 1) { return this; }
    multiply(other?: any) { return this; }
    inverse() { return this; }
    transformPoint(x = 0, y = 0) { return { x, y, z: 0, w: 1 }; }
    toFloat32Array() { return new Float32Array([1,0,0,1,0,0]); }
    toFloat64Array() { return new Float64Array([1,0,0,1,0,0]); }
    isIdentity() { return true; }
    isFinite() { return true; }
    m11 = 1; m12 = 0; m13 = 0; m14 = 0;
    m21 = 0; m22 = 1; m23 = 0; m24 = 0;
    m31 = 0; m32 = 0; m33 = 1; m34 = 0;
    m41 = 0; m42 = 0; m43 = 0; m44 = 1;
  } as any;
}
if (typeof (global as any).Path2D === "undefined") {
  (global as any).Path2D = class Path2D {};
}

export async function parsePdf(buffer: Buffer): Promise<{ text: string; nPages: number }> {
  let pdfjs;
  try { pdfjs = require("pdfjs-dist/build/pdf.js"); }
  catch { try { pdfjs = require("pdfjs-dist/legacy/build/pdf.js"); } 
  catch { try { pdfjs = require("pdfjs-dist"); } catch { pdfjs = null; } }}

  if (pdfjs && pdfjs.getDocument) {
    try {
      const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
      let text = "";
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map((item: any) => item.str || "").join(" ") + "\n";
      }
      return { text, nPages: doc.numPages };
    } catch (e: any) {
      console.error("pdfjs error:", e.message);
    }
  }
  // If PDF parsing fails or file is .txt, treat as text
  return { text: buffer.toString("utf-8"), nPages: 1 };
}