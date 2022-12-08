export const constructNativeImgUrl = (fileId: string) => {
  return `${process.env.BUCKET_DOWNLOAD_URL}/b2_download_file_by_id?fileId=${fileId}`;
};
