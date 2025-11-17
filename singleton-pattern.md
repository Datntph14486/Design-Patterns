# Singleton Pattern (Mẫu Đơn Thể)

## 📋 Tổng quan

**Singleton Pattern** là một design pattern thuộc nhóm Creational Patterns, đảm bảo rằng một class chỉ có một instance duy nhất và cung cấp một điểm truy cập toàn cục đến instance đó. Pattern này rất hữu ích khi bạn cần một đối tượng duy nhất để điều phối các hành động trong toàn bộ hệ thống.

## 🎯 Mục đích

- Đảm bảo chỉ có một instance duy nhất của class
- Cung cấp điểm truy cập toàn cục đến instance đó
- Kiểm soát việc truy cập vào tài nguyên được chia sẻ
- Lazy initialization: Chỉ tạo instance khi cần thiết

## 🏗️ Cấu trúc Code

### Logger Class (Singleton Implementation)

```typescript
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
```

### Các thành phần chính:

1. **Private static instance**: 
   - Lưu trữ instance duy nhất của class
   - `static`: Thuộc về class, không thuộc về instance
   - `private`: Không thể truy cập từ bên ngoài

2. **Private constructor**:
   - Ngăn chặn việc tạo instance bằng `new Logger()`
   - Chỉ có thể tạo instance thông qua `getInstance()`

3. **Static getInstance()**:
   - Phương thức công khai để lấy instance
   - Kiểm tra nếu chưa có instance thì tạo mới (Lazy initialization)
   - Luôn trả về cùng một instance

## 💡 Cách sử dụng

```typescript
// ❌ KHÔNG THỂ làm điều này (constructor là private)
// const logger = new Logger(); // Error!

// ✅ Lấy instance Singleton
const log1 = Logger.getInstance();
const log2 = Logger.getInstance();

// Kiểm tra 2 biến có cùng instance không
console.log(log1 === log2); // true - cùng một instance!

// Sử dụng Logger
log1.log("Server started");
// Output: [LOG]: Server started

log2.log("User logged in");
// Output: [LOG]: User logged in

// log1 và log2 là cùng một object
log1.log("Same instance");
log2.log("Same instance");
```

## ✅ Ưu điểm

1. **Đảm bảo một instance duy nhất**: Không thể tạo nhiều instances
2. **Truy cập toàn cục**: Có thể truy cập từ bất kỳ đâu trong ứng dụng
3. **Lazy initialization**: Chỉ tạo instance khi cần thiết, tiết kiệm memory
4. **Kiểm soát truy cập**: Có thể kiểm soát cách instance được tạo và sử dụng
5. **Tài nguyên được chia sẻ**: Phù hợp cho logging, database connections, cấu hình

## ❌ Nhược điểm

1. **Vi phạm Single Responsibility Principle**: Class vừa quản lý instance, vừa có business logic
2. **Khó test**: Khó mock và test vì instance là global
3. **Thread safety**: Trong multi-threaded environment, cần xử lý synchronization
4. **Hidden dependencies**: Khó nhận biết dependencies vì truy cập qua global
5. **Tight coupling**: Code phụ thuộc vào Singleton, khó thay thế
6. **Memory leaks**: Instance tồn tại suốt lifecycle của ứng dụng

## 🔧 Use Cases (Trường hợp sử dụng)

1. **Logging**: Logger duy nhất cho toàn bộ ứng dụng
2. **Database connections**: Connection pool manager
3. **Configuration**: Global configuration object
4. **Cache**: Application-level cache
5. **Thread pools**: Quản lý thread pool
6. **Device drivers**: Truy cập phần cứng (printer, scanner)
7. **File managers**: Quản lý truy cập file system

## 📝 Lưu ý

1. **Thread Safety**: 
   - Trong JavaScript/TypeScript (single-threaded), không cần lo lắng
   - Trong Java/C#, cần sử dụng `synchronized` hoặc `lock`

2. **Anti-pattern**: 
   - Singleton thường được coi là anti-pattern vì khó test và maintain
   - Nên cân nhắc sử dụng Dependency Injection thay thế

3. **Alternatives**:
   - Dependency Injection: Inject instance thay vì truy cập global
   - Service Locator: Tương tự nhưng linh hoạt hơn

## 🚀 Mở rộng

### Thread-Safe Singleton (cho các ngôn ngữ multi-threaded)
```typescript
class Logger {
  private static instance: Logger;
  private static lock: boolean = false;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      // Double-checked locking pattern
      if (!Logger.lock) {
        Logger.lock = true;
        Logger.instance = new Logger();
        Logger.lock = false;
      }
    }
    return Logger.instance;
  }
}
```

### Eager Initialization (Tạo sẵn instance)
```typescript
class Logger {
  // Tạo instance ngay khi class được load
  private static instance: Logger = new Logger();

  private constructor() {}

  static getInstance(): Logger {
    return Logger.instance;
  }

  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}
```

### Singleton với Initialization Parameters
```typescript
class Logger {
  private static instance: Logger;
  private logLevel: string;

  private constructor(logLevel: string) {
    this.logLevel = logLevel;
  }

  static getInstance(logLevel?: string): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(logLevel || 'INFO');
    }
    return Logger.instance;
  }

  log(message: string) {
    console.log(`[${this.logLevel}]: ${message}`);
  }
}
```

### Enum Singleton (TypeScript)
```typescript
enum Logger {
  INSTANCE;

  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

// Sử dụng
Logger.INSTANCE.log("Hello");
```

### Singleton với Reset (cho testing)
```typescript
class Logger {
  private static instance: Logger;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Reset instance (chỉ dùng cho testing)
  static reset(): void {
    Logger.instance = null as any;
  }

  log(message: string) {
    console.log(`[LOG]: ${message}`);
  }
}
```

### Singleton với Multiple Instances (Multiton Pattern)
```typescript
class Logger {
  private static instances: Map<string, Logger> = new Map();

  private constructor(private name: string) {}

  static getInstance(name: string = 'default'): Logger {
    if (!Logger.instances.has(name)) {
      Logger.instances.set(name, new Logger(name));
    }
    return Logger.instances.get(name)!;
  }

  log(message: string) {
    console.log(`[${this.name}]: ${message}`);
  }
}

// Sử dụng
const fileLogger = Logger.getInstance('file');
const consoleLogger = Logger.getInstance('console');
```

## ⚠️ Best Practices

1. **Tránh Singleton khi có thể**: Ưu tiên Dependency Injection
2. **Sử dụng cho resources thực sự cần unique**: Database connection, Logger
3. **Document rõ ràng**: Giải thích tại sao cần Singleton
4. **Thread safety**: Đảm bảo thread-safe trong multi-threaded environment
5. **Testing**: Cung cấp method reset() cho testing (chỉ trong test environment)

## 🔄 So sánh với các Pattern khác

- **Singleton vs Factory**: Singleton trả về cùng instance, Factory tạo instance mới
- **Singleton vs Dependency Injection**: DI linh hoạt hơn, dễ test hơn
- **Singleton vs Static Class**: Singleton có thể implement interfaces, có thể kế thừa

## 📚 Tài liệu tham khảo

- [Singleton Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/singleton)
- [Why Singletons are Evil](https://blogs.msdn.microsoft.com/scottdensmore/2004/05/25/why-singletons-are-evil/) - Bài viết về nhược điểm của Singleton
- [Design Patterns: Elements of Reusable Object-Oriented Software - Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)

