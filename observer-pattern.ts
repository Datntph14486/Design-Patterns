// Observer interface
interface Observer {
  update(event: string, data: { content: string }): void;
}

// Concrete Observer: User
class User implements Observer {
  private readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  update(event: string, data: { content: string }): void {
    console.log(`[User] Event: ${event}, To: ${this.name}, Content: ${data.content}`);
  }
}

// Subject
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

// Usage
const user1 = new User('Dat');
const user2 = new User('Cuong');

const notifier = new NotifierSubject();

notifier.subscribe(user1);
notifier.subscribe(user2);

notifier.notify('new noti', { content: 'Hello' });

// Optional: thử unsubscribe
notifier.unsubscribe(user1);
notifier.notify('new noti', { content: 'After unsubscribe' });
