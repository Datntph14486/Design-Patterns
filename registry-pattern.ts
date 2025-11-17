interface Animal {
  key: string;
  speak(): Promise<void>;
}

class Dog implements Animal {
  key = 'dog';

  async speak(): Promise<void> {
    console.log('gau gau');
  }
}

class Cat implements Animal {
  key = 'cat';

  async speak(): Promise<void> {
    console.log('meo meo');
  }
}

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

const dog = new Dog();
const cat = new Cat();
const registry = new Registry(dog, cat);

registry.speak('cat');
registry.speak('dog');
