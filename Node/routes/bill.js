const express = require('express');
const connection = require('../connection');
const router = express.Router();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const auth = require('../services/authentication');
// const PDFDocument = require('pdfkit');
const pdf = require('html-pdf');
const rootFolderPath = path.join(__dirname, '../generatedpdf');

const templatePath = path.resolve(__dirname, './report.ejs');
const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
router.post('/generatereport', auth.authenticationToken, async (req, res) => {
    const generateuuid = uuid.v1();
    const orderDetails = req.body;
    const productDetailsReport = JSON.parse(orderDetails.productDetails);
    let data = {
        name: orderDetails.name,
        email: orderDetails.email,
        contactNumber: orderDetails.contactNumber,
        paymentMethod: orderDetails.paymentMethod,
        totalAmount: orderDetails.totalAmount,
        productDetails: productDetailsReport,
    };

    console.log("productDetailsReport", productDetailsReport, generateuuid, orderDetails);

    let query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)";
    connection.query(query, [orderDetails.name, generateuuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], async (err, resp) => {
        if (!err) {
            const html = await ejs.renderFile(templatePath, data);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html);

            const pdfBytes = await page.pdf({ format: 'A4' });
            await browser.close();

            const outputPath = path.join(rootFolderPath, `./${generateuuid}.pdf`);
            fs.writeFileSync(outputPath, pdfBytes);

            console.log('PDF generated successfully');
            return res.status(200).json({ uuid: generateuuid });
        } else {
            console.error('Error generating PDF:', err);
            return res.status(500).json({ error: err });
        }
    });
});

router.post('/getpdf', auth.authenticationToken, async (req, res) => {
    const orderDetails = req.body
    const pdfpath = `./generatedpdf/${orderDetails.uuid}.pdf`
    console.log("pdfpath", pdfpath)
    if (fs.existsSync(pdfpath)) {
        res.contentType("application/pdf");
        fs.createReadStream(pdfpath).pipe(res)
    } else {
        var productDetailsReport = JSON.parse(orderDetails.productDetails)
        orderDetails.productDetails = productDetailsReport
        const html = await ejs.renderFile(templatePath, orderDetails);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBytes = await page.pdf({ format: 'A4' });
        await browser.close();

        const outputPath = path.join(rootFolderPath, `./${orderDetails.uuid}.pdf`);
        fs.writeFileSync(outputPath, pdfBytes);

        console.log('PDF generated successfully');
        res.contentType("application/pdf");
        fs.createReadStream(pdfpath).pipe(res)
    }
})
router.get('/getbills', auth.authenticationToken, (req, res) => {
    let query = 'select * from bill order by id desc;'
    connection.query(query, (error, resp) => {
        if (!error) {
            return res.status(200).json(resp)
        }
        return res.status(500).json(error)

    })
})

router.delete("/delete/:id", auth.authenticationToken, (req, res) => {
    const id = req.params.id;
    let query = "delete from bill where id=?;"
    connection.query(query, [id], (err, resp) => {
        if (resp) {
            if (resp.affectedRows == 0) {
                return res.status(404).json({ message: "Invalid id" })
            } else {
                console.log("resp", resp)
                return res.status(200).json({ message: "Id deleted successfully" })
            }
        } else {
            return res.status(500).json(err)
        }

    })
})

module.exports = router;



