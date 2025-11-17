# Strategy Pattern (Mẫu Chiến Lược)

## 📋 Tổng quan

**Strategy Pattern** là một design pattern thuộc nhóm Behavioral Patterns, cho phép định nghĩa một họ các thuật toán, đóng gói từng thuật toán và làm cho chúng có thể hoán đổi cho nhau. Pattern này cho phép thuật toán thay đổi độc lập với các client sử dụng nó.

## 🎯 Mục đích

- Cho phép chọn thuật toán tại runtime thay vì compile-time
- Tách biệt logic xử lý khỏi context sử dụng nó
- Tuân thủ nguyên tắc **Open/Closed Principle**: mở rộng bằng cách thêm strategy mới mà không cần sửa code hiện có
- Loại bỏ các câu lệnh if/else hoặc switch/case phức tạp

## 🏗️ Cấu trúc Code

### 1. Strategy Interface
```typescript
interface UploadStrategy {
  upload(file: any): string;
}
```
- Định nghĩa contract chung cho tất cả các strategies
- Mỗi strategy phải implement phương thức `upload()`

### 2. Concrete Strategies (Các chiến lược cụ thể)

#### LocalUpload
```typescript
class LocalUpload implements UploadStrategy {
  upload(file: any): string {
    return "/uploads/" + file.filename;
  }
}
```
- Upload file lên local storage
- Trả về đường dẫn file trong thư mục `/uploads/`

#### S3Upload
```typescript
class S3Upload implements UploadStrategy {
  upload(file: any): string {
    return "https://s3.amazonaws.com/bucket/" + file.filename;
  }
}
```
- Upload file lên Amazon S3
- Trả về URL công khai của file trên S3

### 3. Context (UploadService)
```typescript
class UploadService {
  constructor(
    private localUpload: LocalUpload,
    private s3Upload: S3Upload
  ) {}

  getStrategy(type: string): UploadStrategy {
    switch(type) {
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
}
```
- **Context**: Lớp sử dụng strategy
- **getStrategy()**: Chọn strategy dựa trên key
- **upload()**: Gọi phương thức upload của strategy được chọn

## 💡 Cách sử dụng

```typescript
// 1. Khởi tạo các strategies
const localUpload = new LocalUpload();
const s3Upload = new S3Upload();

// 2. Khởi tạo UploadService với các strategies
const uploadService = new UploadService(localUpload, s3Upload);

// 3. Tạo file object
const file = {
  name: 'file 1',
  filename: 'document.pdf' // Lưu ý: cần có thuộc tính filename
};

// 4. Upload với strategy khác nhau
console.log(uploadService.upload('local', file)); 
// Output: /uploads/document.pdf

console.log(uploadService.upload('s3', file)); 
// Output: https://s3.amazonaws.com/bucket/document.pdf
```

## ✅ Ưu điểm

1. **Linh hoạt**: Dễ dàng thêm strategy mới (ví dụ: Google Cloud Storage, Azure Blob)
2. **Tách biệt logic**: Mỗi strategy độc lập, dễ test và maintain
3. **Tuân thủ SOLID**: 
   - **Single Responsibility**: Mỗi strategy chỉ làm một việc
   - **Open/Closed**: Mở để mở rộng, đóng để sửa đổi
4. **Loại bỏ điều kiện**: Thay thế if/else hoặc switch/case dài
5. **Dễ test**: Có thể test từng strategy riêng biệt

## ❌ Nhược điểm

1. **Số lượng class tăng**: Mỗi strategy là một class riêng
2. **Client phải biết các strategies**: Client cần hiểu sự khác biệt giữa các strategies
3. **Overhead**: Nếu chỉ có 1-2 thuật toán đơn giản, pattern này có thể quá phức tạp

## 🔧 Use Cases (Trường hợp sử dụng)

1. **Upload files**: Local, S3, Google Cloud, Azure
2. **Payment processing**: Credit card, PayPal, Stripe, Bank transfer
3. **Compression algorithms**: ZIP, RAR, 7Z
4. **Sorting algorithms**: Quick sort, Merge sort, Bubble sort
5. **Validation strategies**: Email validation, Phone validation, Password validation
6. **Notification systems**: Email, SMS, Push notification

## 📝 Lưu ý

1. **File object**: Trong ví dụ, file object cần có thuộc tính `filename` để code hoạt động đúng
2. **Error handling**: Có thể thêm try-catch trong phương thức `upload()` của context
3. **Type safety**: Có thể thay `any` bằng interface cụ thể cho file object
4. **Dependency Injection**: Có thể cải thiện bằng cách inject strategies thông qua DI container

## 🚀 Mở rộng

### Thêm Strategy mới (ví dụ: Google Cloud Storage)
```typescript
class GCSUpload implements UploadStrategy {
  upload(file: any): string {
    return "https://storage.googleapis.com/bucket/" + file.filename;
  }
}

// Thêm vào UploadService
case 'gcs':
  return this.gcsUpload
```

### Sử dụng Factory Pattern
```typescript
class StrategyFactory {
  static create(type: string): UploadStrategy {
    switch(type) {
      case 'local': return new LocalUpload();
      case 's3': return new S3Upload();
      default: throw new Error("Invalid type");
    }
  }
}
```

## 📚 Tài liệu tham khảo

- [Strategy Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/strategy)
- [Design Patterns: Elements of Reusable Object-Oriented Software - Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)

