import { HttpException, HttpStatus } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload-minimal';
import { extname, join } from 'path';
import { makeid } from './makeId';

export const uploadImg = async (
  img: Promise<FileUpload>,
  pathFolder = '/',
): Promise<string> => {
  const { filename, createReadStream, mimetype } = await img;

  if (!['image/jpeg', 'image/png'].includes(mimetype)) {
    console.log('should return error');

    throw new HttpException('file not an image.', HttpStatus.BAD_REQUEST);
  }

  console.log('INITIAL FILENAME', filename);
  console.log('EXT', extname(filename));
  const randomId = makeid(7);

  const newFilename = `${randomId}${extname(filename)}`;

  return new Promise(async (resolve) => {
    createReadStream()
      .pipe(
        createWriteStream(
          join(process.cwd(), `${join('public', pathFolder, newFilename)}`),
        ),
      )
      .on('finish', () => resolve(newFilename))
      .on('error', () => {
        new HttpException('Could not save image', HttpStatus.BAD_REQUEST);
      });
  });
};
