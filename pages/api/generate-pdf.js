import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { htmlContent } = req.body;
      const pdfBuffer = await getHtmlToPdf(htmlContent);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="example.pdf"');
      res.setHeader('Content-Length', pdfBuffer.length);

      res.end(pdfBuffer); // Properly send binary PDF
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).send('Error generating PDF');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

export async function getHtmlToPdf(htmlContent) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  // Wait to ensure fonts/styles apply
  await new Promise((r) => setTimeout(r, 1000));

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' }
  });

  await browser.close();
  return pdfBuffer;
}
