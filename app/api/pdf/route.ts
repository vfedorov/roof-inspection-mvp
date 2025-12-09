import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const { image, address, roofType, notes } = await req.json();

        const html = `
          <html lang="en">
            <body style="font-family: sans-serif; padding: 20px;">
              <h1>Inspection Report</h1>
              <p><strong>Address:</strong> ${address}</p>
              <p><strong>Roof Type:</strong> ${roofType}</p>
              <p><strong>Notes:</strong> ${notes}</p>
              <img src="${image}" style="width: 500px; margin-top: 20px;" alt="generated" />
            </body>
          </html>
        `;

        const isLocalWindows =
            process.platform === "win32" && !process.env.VERCEL;

        const localChromePath =
            "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

        const browser = await puppeteer.launch(
            isLocalWindows
                ? {
                    headless: true,
                    executablePath: localChromePath,
                }
                : {
                    args: chromium.args,
                    executablePath: await chromium.executablePath(),
                    headless: true,
                }
        );

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        await browser.close();

        return new NextResponse(Buffer.from(pdfBuffer), {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": "inline; filename=report.pdf"
            }
        });

    } catch (err) {
        console.error(err);
        return new NextResponse(
            JSON.stringify({ error: "PDF generation failed", details: String(err) }),
            { status: 500 }
        );
    }
}
