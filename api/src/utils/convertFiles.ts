import { Express } from 'express';
import PdfParse from 'pdf-parse';

export const covertPdfToText = async (file: Express.Multer.File) => {
  if (file.mimetype.split('/')[1] === 'pdf') {
    const document = await PdfParse(file.buffer);
    return document;
  }
};
