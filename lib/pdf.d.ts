declare module "pdf-parse/lib/pdf-parse.js" {
    interface PdfResult {
      numpages: number;
      numrender: number;
      info: unknown;
      metadata: unknown;
      text: string;
      version: string;
    }
    function pdfParse(dataBuffer: Buffer, options?: Record<string, unknown>): Promise<PdfResult>;
    export default pdfParse;
  }
  