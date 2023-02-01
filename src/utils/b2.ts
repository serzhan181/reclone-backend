import { FileUpload } from 'graphql-upload-minimal';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const B2 = require('backblaze-b2');
// import B2 from 'backblaze-b2';
import { extname } from 'path';
import { makeid } from 'src/helpers/makeId';

const b2 = new B2({
  applicationKey: process.env.BUCKET_APP_KEY,
  applicationKeyId: process.env.BUCKET_APP_KEY_ID,
});

class Bucket {
  async authorize() {
    try {
      await b2.authorize();
    } catch (e) {
      console.log('Error:', e);
    }
  }

  async uploadImage(image: FileUpload, folderName?: string) {
    let buffer;

    this.authorize();
    const filename = `${makeid(7)}${extname(image.filename)}`;

    await new Promise((res) => {
      const chunks = [];
      const stream = image.createReadStream();

      stream.on('data', (chunk) => chunks.push(chunk));
      stream.once('end', () => {
        console.log('should end');
        buffer = Buffer.concat(chunks);
        res(buffer);
      });
    });

    const upload = await b2.getUploadUrl({
      bucketId: process.env.BUCKET_ID,
    });

    const file = await b2.uploadFile({
      data: buffer,
      fileName: folderName ? `${folderName}/${filename}` : filename,
      uploadUrl: upload.data.uploadUrl,
      uploadAuthToken: upload.data.authorizationToken,
    });

    console.log(`
      dev logs:
      file: ${file},
      uploadUrl: ${upload.data.uploadUrl},
      auth: ${upload.data.authorizationToken},
      bucketId: ${process.env.BUCKET_ID}
    `);

    console.log('file uploaded');

    return file.data.fileId;
  }

  async getFileNameById(fileId: string) {
    this.authorize();
    const file = await b2.getFileInfo({ fileId });
    return file.data.fileName;
  }

  async deleteImage(fileId: string) {
    this.authorize();
    try {
      const file = await b2.getFileInfo({ fileId });

      await b2.deleteFileVersion({
        fileId,
        fileName: file.data.fileName,
      });
    } catch (err) {
      console.log('error', err);
    }
  }
}

export const bucket = new Bucket();
