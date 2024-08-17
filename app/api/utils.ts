import PDFParser from "pdf2json";

export const pdfToString = (pdfPath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);

        pdfParser.on("pdfParser_dataError", (errData) => {
            reject(errData.parserError);
        });

        pdfParser.on("pdfParser_dataReady", () => {
            resolve(pdfParser.getRawTextContent());
        });

        pdfParser.loadPDF(pdfPath);
    });
};

// const pdfPath = "resume.pdf";
// pdfToString(pdfPath)
//     .then((text) => {
//         console.log(text);
//     })
//     .catch((error) => {
//         console.error("Error:", error);
//     });
