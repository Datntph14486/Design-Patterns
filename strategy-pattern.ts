interface UploadStrategy {
  upload(file: any): string;
}

class LocalUpload implements UploadStrategy {
  upload(file: any): string {
   return "/uploads/" + file.filename;
  }
}

class S3Upload implements UploadStrategy {
  upload(file: any): string {
   return "https://s3.amazonaws.com/bucket/" + file.filename;
  }
}

class UploadService {
  constructor(
    private localUpload: LocalUpload,
    private s3Upload: S3Upload){}

  getStrategy(type: string): UploadStrategy {
    switch(type){
      case 'local':
        return this.localUpload
        
      case 's3':
        return this.s3Upload
      default:
         throw new Error("Invalid type");
    }
  }

  upload(key: string, file: any): string {
    const strategy = this.getStrategy(key);

    return strategy.upload(file);
  }
};

const localUpload = new LocalUpload();
const s3Upload = new S3Upload();
const uploadService = new UploadService(localUpload, s3Upload);

const file = {
  name: 'file 1',
};

console.log(uploadService.upload('local', file));

console.log(uploadService.upload('s3', file));



