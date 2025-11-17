# Registry Pattern (Mẫu Đăng Ký)

## 📋 Tổng quan

**Registry Pattern** là một design pattern cho phép đăng ký và truy xuất các đối tượng (handlers) bằng cách sử dụng một key duy nhất. Pattern này rất hữu ích khi bạn cần quản lý một tập hợp các handlers và truy xuất chúng một cách động dựa trên key.

## 🎯 Mục đích

- Quản lý tập hợp các handlers/processors một cách tập trung
- Truy xuất handlers nhanh chóng bằng key thay vì sử dụng if/else hoặc switch/case
- Dễ dàng thêm/xóa handlers mà không cần sửa code hiện có
- Tạo một mapping giữa key và handler implementation

## 🏗️ Cấu trúc Code

### 1. Interface (Animal)
```typescript
interface Animal {
  key: string;
  speak(): Promise<void>;
}
```
- Định nghĩa contract chung cho tất cả các handlers
- Mỗi handler phải có:
  - `key`: Định danh duy nhất
  - `speak()`: Phương thức thực thi (có thể async)

### 2. Concrete Implementations

#### Dog Handler
```typescript
class Dog implements Animal {
  key = 'dog';

  async speak(): Promise<void> {
    console.log('gau gau');
  }
}
```
- Handler cho chó
- Key: `'dog'`
- Khi gọi `speak()`, in ra `'gau gau'`

#### Cat Handler
```typescript
class Cat implements Animal {
  key = 'cat';

  async speak(): Promise<void> {
    console.log('meo meo');
  }
}
```
- Handler cho mèo
- Key: `'cat'`
- Khi gọi `speak()`, in ra `'meo meo'`

### 3. Registry Class
```typescript
class Registry {
  handlers: Record<string, Animal> = {};

  constructor(...animals: Animal[]) {
    animals.forEach(a => (this.handlers[a.key] = a));
  }

  async speak(key: string): Promise<void> {
    const handler = this.handlers[key];

    if (!handler) {
      console.log('handler not found!');
    } else {
      await handler.speak();
    }
  }
}
```

#### Các thành phần:
- **handlers**: Object lưu trữ mapping giữa key và handler
- **constructor**: Nhận danh sách handlers và đăng ký chúng
- **speak()**: Truy xuất handler theo key và gọi phương thức `speak()`

## 💡 Cách sử dụng

```typescript
// 1. Tạo các handlers
const dog = new Dog();
const cat = new Cat();

// 2. Khởi tạo Registry và đăng ký handlers
const registry = new Registry(dog, cat);

// 3. Gọi handler bằng key
await registry.speak('cat');
// Output: meo meo

await registry.speak('dog');
// Output: gau gau

await registry.speak('bird');
// Output: handler not found!
```

## ✅ Ưu điểm

1. **Truy xuất nhanh**: O(1) lookup time với object/Map
2. **Dễ mở rộng**: Thêm handler mới chỉ cần tạo class và đăng ký
3. **Loại bỏ điều kiện**: Không cần if/else hoặc switch/case dài
4. **Tập trung quản lý**: Tất cả handlers được quản lý ở một nơi
5. **Type safety**: Có thể đảm bảo type safety với TypeScript
6. **Lazy loading**: Có thể load handlers khi cần

## ❌ Nhược điểm

1. **Phải quản lý keys**: Cần đảm bảo keys là unique
2. **Runtime errors**: Nếu key không tồn tại, chỉ phát hiện tại runtime
3. **Memory**: Lưu trữ tất cả handlers trong memory
4. **Không có validation**: Không kiểm tra handler có hợp lệ hay không khi đăng ký

## 🔧 Use Cases (Trường hợp sử dụng)

1. **Command handlers**: Xử lý các commands khác nhau (CreateUserCommand, DeleteUserCommand)
2. **Import/Export handlers**: Xử lý import/export các loại file khác nhau (CSV, Excel, JSON)
3. **Payment processors**: Xử lý các phương thức thanh toán (CreditCard, PayPal, BankTransfer)
4. **Notification channels**: Gửi thông báo qua các kênh khác nhau (Email, SMS, Push)
5. **File processors**: Xử lý các loại file khác nhau (Image, Video, Document)
6. **API route handlers**: Xử lý các routes khác nhau trong web framework
7. **Validation rules**: Áp dụng các quy tắc validation khác nhau

## 📝 Lưu ý

1. **Key uniqueness**: Đảm bảo mỗi handler có key duy nhất
2. **Error handling**: Có thể cải thiện xử lý lỗi khi handler không tồn tại
3. **Dynamic registration**: Có thể thêm method để đăng ký handler sau khi khởi tạo
4. **Type safety**: Có thể sử dụng enum hoặc const cho keys để tránh typo

## 🚀 Mở rộng

### Thêm Dynamic Registration
```typescript
class Registry {
  handlers: Record<string, Animal> = {};

  constructor(...animals: Animal[]) {
    animals.forEach(a => this.register(a));
  }

  register(animal: Animal): void {
    if (this.handlers[animal.key]) {
      throw new Error(`Handler with key '${animal.key}' already exists`);
    }
    this.handlers[animal.key] = animal;
  }

  unregister(key: string): void {
    delete this.handlers[key];
  }

  async speak(key: string): Promise<void> {
    const handler = this.handlers[key];
    if (!handler) {
      throw new Error(`Handler with key '${key}' not found`);
    }
    await handler.speak();
  }

  getKeys(): string[] {
    return Object.keys(this.handlers);
  }
}
```

### Sử dụng Enum cho Keys
```typescript
enum AnimalType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird'
}

class Dog implements Animal {
  key = AnimalType.DOG;
  // ...
}

// Sử dụng
await registry.speak(AnimalType.DOG); // Type-safe!
```

### Thêm Handler với Metadata
```typescript
interface Animal {
  key: string;
  name: string;
  description?: string;
  speak(): Promise<void>;
}

class Registry {
  handlers: Record<string, Animal> = {};

  getHandlerInfo(key: string): { name: string; description?: string } | null {
    const handler = this.handlers[key];
    if (!handler) return null;
    
    return {
      name: handler.name,
      description: handler.description
    };
  }

  listHandlers(): Array<{ key: string; name: string }> {
    return Object.values(this.handlers).map(h => ({
      key: h.key,
      name: h.name
    }));
  }
}
```

### Factory Pattern kết hợp
```typescript
class AnimalFactory {
  static create(type: string): Animal {
    switch(type) {
      case 'dog': return new Dog();
      case 'cat': return new Cat();
      default: throw new Error(`Unknown animal type: ${type}`);
    }
  }
}

// Sử dụng với Registry
const registry = new Registry(
  AnimalFactory.create('dog'),
  AnimalFactory.create('cat')
);
```

### Lazy Loading Handlers
```typescript
class Registry {
  handlers: Record<string, () => Animal> = {};

  registerFactory(key: string, factory: () => Animal): void {
    this.handlers[key] = factory;
  }

  async speak(key: string): Promise<void> {
    const factory = this.handlers[key];
    if (!factory) {
      throw new Error(`Handler factory for '${key}' not found`);
    }
    
    const handler = factory(); // Tạo handler khi cần
    await handler.speak();
  }
}
```

## 🔄 So sánh với các Pattern khác

- **Registry vs Factory**: Registry lưu trữ instances, Factory tạo instances mới mỗi lần
- **Registry vs Strategy**: Registry quản lý nhiều handlers, Strategy chọn một strategy để sử dụng
- **Registry vs Chain of Responsibility**: Registry lookup theo key, Chain of Responsibility truyền qua từng handler

## 📚 Tài liệu tham khảo

- [Registry Pattern - SourceMaking](https://sourcemaking.com/design_patterns/registry)
- [Service Locator Pattern](https://en.wikipedia.org/wiki/Service_locator_pattern) - Pattern tương tự
- [Dependency Injection vs Service Locator](https://martinfowler.com/articles/injection.html)

