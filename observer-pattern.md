# Observer Pattern (Mẫu Quan Sát)

## 📋 Tổng quan

**Observer Pattern** là một design pattern thuộc nhóm Behavioral Patterns, định nghĩa sự phụ thuộc một-nhiều giữa các đối tượng. Khi một đối tượng thay đổi trạng thái, tất cả các đối tượng phụ thuộc của nó sẽ được thông báo và cập nhật tự động.

## 🎯 Mục đích

- Tạo mối quan hệ loose coupling giữa Subject và Observers
- Cho phép Subject thông báo cho nhiều Observers mà không cần biết chi tiết về chúng
- Hỗ trợ broadcast communication (giao tiếp một-nhiều)
- Tuân thủ nguyên tắc **Dependency Inversion**: Subject phụ thuộc vào abstraction (Observer interface), không phụ thuộc vào concrete classes

## 🏗️ Cấu trúc Code

### 1. Observer Interface
```typescript
interface Observer {
  update(event: string, data: { content: string }): void;
}
```
- Định nghĩa contract cho tất cả các observers
- Phương thức `update()` được gọi khi Subject thay đổi trạng thái

### 2. Concrete Observer (User)
```typescript
class User implements Observer {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(event: string, data: { content: string }): void {
    console.log(`[User] Event: ${event}, To: ${this.name}, Content: ${data.content}`);
  }
}
```
- **Concrete Observer**: Implement Observer interface
- Mỗi User có tên riêng và xử lý thông báo theo cách riêng
- Khi nhận được thông báo, User sẽ log ra console

### 3. Subject (NotifierSubject)
```typescript
class NotifierSubject {
  private observers: Observer[] = [];

  subscribe(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  unsubscribe(observer: Observer): void {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(event: string, data: { content: string }): void {
    for (const observer of this.observers) {
      observer.update(event, data);
    }
  }
}
```

#### Các phương thức:
- **subscribe()**: Đăng ký observer mới (có kiểm tra trùng lặp)
- **unsubscribe()**: Hủy đăng ký observer
- **notify()**: Thông báo cho tất cả observers đã đăng ký

## 💡 Cách sử dụng

```typescript
// 1. Tạo các observers (users)
const user1 = new User('Dat');
const user2 = new User('Cuong');

// 2. Tạo subject (notifier)
const notifier = new NotifierSubject();

// 3. Đăng ký observers
notifier.subscribe(user1);
notifier.subscribe(user2);

// 4. Gửi thông báo - tất cả observers sẽ nhận được
notifier.notify('new noti', { content: 'Hello' });
// Output:
// [User] Event: new noti, To: Dat, Content: Hello
// [User] Event: new noti, To: Cuong, Content: Hello

// 5. Hủy đăng ký một observer
notifier.unsubscribe(user1);

// 6. Gửi thông báo mới - chỉ user2 nhận được
notifier.notify('new noti', { content: 'After unsubscribe' });
// Output:
// [User] Event: new noti, To: Cuong, Content: After unsubscribe
```

## ✅ Ưu điểm

1. **Loose Coupling**: Subject không biết chi tiết về observers, chỉ biết interface
2. **Dễ mở rộng**: Thêm observer mới không cần sửa Subject
3. **Dynamic relationships**: Có thể thêm/xóa observers tại runtime
4. **Broadcast communication**: Một thay đổi có thể thông báo cho nhiều observers
5. **Tuân thủ Open/Closed Principle**: Mở để thêm observers, đóng để sửa Subject

## ❌ Nhược điểm

1. **Thứ tự thông báo**: Không đảm bảo thứ tự observers nhận thông báo
2. **Memory leaks**: Nếu quên unsubscribe, observer có thể không được garbage collected
3. **Performance**: Nếu có quá nhiều observers, việc notify có thể chậm
4. **Error handling**: Nếu một observer throw error, có thể ảnh hưởng đến các observers khác

## 🔧 Use Cases (Trường hợp sử dụng)

1. **Notification systems**: Thông báo cho users khi có sự kiện mới
2. **Event handling**: DOM events, custom events
3. **Model-View architecture**: MVC, MVP, MVVM patterns
4. **Stock market**: Thông báo khi giá cổ phiếu thay đổi
5. **Weather station**: Thông báo cho các displays khi thời tiết thay đổi
6. **Social media**: Thông báo cho followers khi có bài đăng mới
7. **Logging systems**: Ghi log vào nhiều destinations (file, console, database)

## 📝 Lưu ý

1. **Error handling**: Nên thêm try-catch trong phương thức `notify()` để xử lý lỗi từ observers
2. **Type safety**: Có thể định nghĩa enum cho event types thay vì dùng string
3. **Async notifications**: Có thể cần xử lý async nếu observers thực hiện I/O operations
4. **Memory management**: Luôn unsubscribe khi không cần thiết để tránh memory leaks

## 🚀 Mở rộng

### Thêm Error Handling
```typescript
notify(event: string, data: { content: string }): void {
  for (const observer of this.observers) {
    try {
      observer.update(event, data);
    } catch (error) {
      console.error(`Error notifying observer:`, error);
    }
  }
}
```

### Thêm Event Types
```typescript
enum EventType {
  NEW_NOTIFICATION = 'new_noti',
  MESSAGE = 'message',
  ALERT = 'alert'
}

notify(event: EventType, data: { content: string }): void {
  // ...
}
```

### Thêm Priority cho Observers
```typescript
interface Observer {
  priority?: number;
  update(event: string, data: { content: string }): void;
}

notify(event: string, data: { content: string }): void {
  const sortedObservers = [...this.observers].sort((a, b) => 
    (b.priority || 0) - (a.priority || 0)
  );
  
  for (const observer of sortedObservers) {
    observer.update(event, data);
  }
}
```

### Push vs Pull Model
- **Push Model** (hiện tại): Subject gửi toàn bộ data cho observers
- **Pull Model**: Observers tự lấy data từ Subject khi cần

```typescript
// Pull Model
interface Observer {
  update(subject: NotifierSubject): void;
}

class User implements Observer {
  update(subject: NotifierSubject): void {
    const data = subject.getState(); // Observer tự lấy data
    console.log(`Content: ${data.content}`);
  }
}
```

## 🔄 So sánh với các Pattern khác

- **Observer vs Pub/Sub**: Observer pattern là một phần của Pub/Sub, nhưng Pub/Sub thường có message broker trung gian
- **Observer vs Mediator**: Observer là one-to-many, Mediator là many-to-many với trung gian điều phối
- **Observer vs Chain of Responsibility**: Observer broadcast cho tất cả, Chain of Responsibility truyền qua từng handler

## 📚 Tài liệu tham khảo

- [Observer Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/observer)
- [RxJS Observables](https://rxjs.dev/guide/overview) - Implementation của Observer pattern trong JavaScript
- [Design Patterns: Elements of Reusable Object-Oriented Software - Gang of Four](https://en.wikipedia.org/wiki/Design_Patterns)

