import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    const { image, address, roofType, notes } = await req.json();

    const html = `
    <html>
      <body style="font-family: sans-serif; padding: 20px;">
        <h1>Inspection Report</h1>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Roof Type:</strong> ${roofType}</p>
        <p><strong>Notes:</strong> ${notes}</p>
        <img src="${image}" style="width: 500px; margin-top: 20px;" />
      </body>
    </html>
  `;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-gpu",
            "--disable-dev-shm-usage"
        ]
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline; filename=report.pdf"
        }
    });
}
