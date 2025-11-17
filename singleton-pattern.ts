class Logger {
  // Biến tĩnh lưu instance duy nhất
  private static instance: Logger;

  // Private constructor để không thể new Logger trực tiếp
  private constructor() {}

  // Method tĩnh để lấy instance duy nhất
  static getInstance(): Logger {
    // Nếu chưa có instance → tạo mới
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    // Trả về instance duy nhất
    return Logger.instance;
  }

  // Method bình thường của Logger
  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}

//  Lấy instance Singleton
const log1 = Logger.getInstance();
const log2 = Logger.getInstance();

// Kiểm tra 2 biến có cùng instance không
console.log(log1 === log2); // true

// Sử dụng Logger
log1.log("Server started");
log2.log("User logged in");
