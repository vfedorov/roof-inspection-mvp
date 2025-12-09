Roof Inspection MVP

A lightweight prototype for roof inspections built with **Next.js 14**, **React 18**, **TypeScript**, **Fabric.js 6**, **Tailwind CSS**, and **server-side PDF generation via Puppeteer**.

This MVP demonstrates photo annotation, data entry, and PDF reporting, forming a foundation for a real production-grade inspection platform.

---

## 🚀 Features

* **Upload roof images** (JPG/PNG)
* **Draw annotations directly on the image**

  * Circles
  * Arrows
  * Text labels
* **Editable inspection form**

  * Address
  * Roof Type
  * Notes
* **Generate professional PDF reports**

  * Includes annotated image
  * Includes form details
  * Clean, simple layout
* **PDF opens in a new tab** (not automatically downloaded)
* **Smart UX**

  * Generate button disabled until an image is uploaded
  * Loading state while generating PDF
* **Modern Tailwind layout and styling**

---

## 🛠️ Tech Stack

### Frontend

* Next.js 14 (App Router)
* React 18
* TypeScript
* Tailwind CSS (latest)
* Fabric.js 6 for drawing

### Backend

* Puppeteer for server-side PDF rendering
* Next.js API Route (Node.js runtime)

---

## 📁 Project Structure

```
app/
  page.tsx            → Main UI & canvas
  layout.tsx          → App layout wrapper
  globals.css         → Tailwind + global styles
  api/pdf/route.ts    → Puppeteer HTML → PDF generator
```

---

## 📦 Installation

```bash
npm install
npm run dev
```

Open locally at:

```
http://localhost:3000
```

---

## 📝 How PDF Generation Works

1. Frontend converts canvas → PNG
2. Sends PNG + form data via POST to `/api/pdf`
3. Puppeteer renders HTML template server-side
4. Generates A4 PDF with background image + text
5. Frontend opens PDF in a new browser tab

---

## 🚀 Deployment

### Vercel

* Push repo to GitHub
* Import to Vercel
* Ensure `runtime = "nodejs"` in the PDF route
* Puppeteer runs inside Vercel without extra config

### Linux Server

* No need for system Chrome — Puppeteer downloads Chromium automatically

---

## 👤 Author

**Vladimir** — Senior Full-Stack Developer
Expert in:

* React / Next.js / Node.js / TypeScript
* High-load systems
* SaaS platforms
* EdTech, MediaTech, Real-time apps

If you have questions or want improvements — feel free to reach out!
