import functions from "@google-cloud/functions-framework";
import puppeteer from "puppeteer";

functions.http("main", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).send("URL parameter is missing");
  }

  try {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf();

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="page.pdf"');
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("An error occurred while generating the PDF");
  }
});
