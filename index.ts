import fs from "fs"
import * as pdf from "pdf-lib"

const PAGES_PER_FILE = 53

async function main() {
	const doc_bytes = await fs.promises.readFile("./og.pdf")
	const pdf_file = await pdf.PDFDocument.load(doc_bytes)
	const new_file = await pdf.PDFDocument.create()

	await slice_pdf(new_file, 0, PAGES_PER_FILE, pdf_file)
}

async function slice_pdf(file: pdf.PDFDocument, index: number, max: number, og: pdf.PDFDocument) {
	const [copiedPages] = await file.copyPages(og, [index])
	file.addPage(copiedPages)
	if (index === max) {
		const final = await file.save()
		await writePdfBytesToFile("kimetsu.pdf", final)
	} else {
		await slice_pdf(file, index + 1, max, og)
	}
}

async function writePdfBytesToFile(fileName: string, pdfBytes: Uint8Array) {
	return fs.promises.writeFile(fileName, pdfBytes)
}

main()
