# JavaScript 基础核心知识

## 一、数据类型系统

### 1.1 基本数据类型（Primitive Types）

JavaScript 有 7 种基本数据类型：

| 类型          | 说明             | 示例                               | 特点                   |
| ------------- | ---------------- | ---------------------------------- | ---------------------- |
| **Undefined** | 未定义           | `undefined`                        | 只有一个值 `undefined` |
| **Null**      | 空值             | `null`                             | 只有一个值 `null`      |
| **Boolean**   | 布尔值           | `true` / `false`                   | 两个值                 |
| **String**    | 字符串           | `'hello'` / `"world"`              | 不可变                 |
| **Number**    | 数字             | `42` / `3.14` / `NaN` / `Infinity` | 64位浮点数             |
| **Symbol**    | 符号（ES6）      | `Symbol('key')`                    | 唯一值，不可枚举       |
| **BigInt**    | 大整数（ES2020） | `9007199254740991n`                | 任意精度整数           |

#### Symbol 详解

**特点**：
- 唯一性：每个 Symbol 值都是唯一的
- 不可枚举：`Object.keys()` 和 `for...in` 无法遍历
- 不可转换：不能转换为字符串或数字

**应用场景**：
```javascript
// 1. 定义私有属性
const privateData = Symbol('privateData');

class MyClass {
  constructor() {
    this[privateData] = 'This is private';
  }

  getPrivateData() {
    return this[privateData];
  }
}

const instance = new MyClass();
console.log(instance.getPrivateData()); // "This is private"
console.log(Object.keys(instance));     // []（不可枚举）

// 2. 消除魔法字符串
const TYPE_A = Symbol('typeA');
const TYPE_B = Symbol('typeB');

function handleType(type) {
  switch(type) {
    case TYPE_A: return '处理类型A';
    case TYPE_B: return '处理类型B';
  }
}

// 3. 定义对象属性
const obj = {
  [Symbol('key')]: 'value'
};
```

#### BigInt 详解

**特点**：
- 表示任意精度整数，不受 `Number.MAX_SAFE_INTEGER` 限制
- 不能与 Number 类型直接运算，需要先转换
- 使用 `n` 后缀或 `BigInt()` 构造函数创建

**应用场景**：
```javascript
// 大整数运算
const bigNum = 9007199254740991n;
const anotherBig = BigInt('9007199254740992');

console.log(bigNum + anotherBig); // 18014398509481983n

// 与 Number 转换
const num = Number(bigNum);
const big = BigInt(num);

// 最大安全整数
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(Number.MAX_VALUE);         // 1.7976931348623157e+308
```

### 1.2 引用数据类型（Reference Types）

| 类型         | 说明          | 特点               |
| ------------ | ------------- | ------------------ |
| **Object**   | 对象          | 所有引用类型的基类 |
| **Array**    | 数组          | Object 的子类型    |
| **Function** | 函数          | Object 的子类型    |
| **Date**     | 日期          | Object 的子类型    |
| **RegExp**   | 正则          | Object 的子类型    |
| **Map**      | 映射（ES6）   | 键值对集合         |
| **Set**      | 集合（ES6）   | 值唯一集合         |
| **WeakMap**  | 弱映射（ES6） | 键必须是对象       |
| **WeakSet**  | 弱集合（ES6） | 值必须是对象       |

### 1.3 数据存储机制

#### 栈（Stack）和堆（Heap）

**基本类型存储**：
- 存储在**栈内存**中
- 按值访问
- 大小固定，系统自动分配和释放

**引用类型存储**：
- 数据存储在**堆内存**中
- 栈中存储**地址指针**
- 按引用访问，通过指针找到堆中的数据

**内存模型**：
```
栈内存（Stack）          堆内存（Heap）
┌─────────────┐         ┌─────────────┐
│ a = 10      │         │             │
│ b = 'hello' │         │  {name:...} │
│ obj = 0x001 │ ──────→ │  [1,2,3]    │
│ arr = 0x002 │ ──────→ │  function   │
└─────────────┘         └─────────────┘
```

**示例**：
```javascript
// 基本类型：值拷贝
let a = 10;
let b = a;
b = 20;
console.log(a); // 10（a 不变）

// 引用类型：引用拷贝
let obj1 = { name: 'Alice' };
let obj2 = obj1;
obj2.name = 'Bob';
console.log(obj1.name); // 'Bob'（obj1 也变了）
```

### 1.4 装箱和拆箱

#### 装箱（Boxing）

**隐式装箱**：基本类型调用方法时，自动转换为包装对象
```javascript
let str = 'hello';
let result = str.indexOf('h'); // 0

// 后台实际执行：
// 1. 创建 String 包装对象
let temp = new String('hello');
// 2. 调用方法
let result = temp.indexOf('h');
// 3. 销毁临时对象
temp = null;
```

**显式装箱**：
```javascript
let num = new Number(42);
let str = new String('hello');
let bool = new Boolean(true);
```

#### 拆箱（Unboxing）

**转换规则**：
1. 优先调用 `valueOf()`
2. 如果返回非原始值，再调用 `toString()`
3. 如果仍是非原始值，报错

```javascript
let numObj = new Number(42);
console.log(typeof numObj);           // 'object'
console.log(typeof numObj.valueOf());  // 'number'（拆箱）
console.log(typeof numObj.toString()); // 'string'

// 对象转原始值
let obj = {
  valueOf() { return 100; },
  toString() { return 'object'; }
};

console.log(obj + 1);      // 101（优先 valueOf）
console.log(String(obj));  // 'object'（优先 toString）
```

---

## 二、类型判断

### 2.1 typeof 操作符

**语法**：`typeof operand`

**返回值**：
| 类型        | 返回值        | 说明               |
| ----------- | ------------- | ------------------ |
| `undefined` | `'undefined'` | ✅ 正确             |
| `null`      | `'object'`    | ❌ 历史遗留问题     |
| `boolean`   | `'boolean'`   | ✅ 正确             |
| `number`    | `'number'`    | ✅ 正确             |
| `string`    | `'string'`    | ✅ 正确             |
| `symbol`    | `'symbol'`    | ✅ 正确             |
| `bigint`    | `'bigint'`    | ✅ 正确             |
| `function`  | `'function'`  | ✅ 正确             |
| 其他对象    | `'object'`    | ⚠️ 无法区分具体类型 |

**示例**：
```javascript
typeof undefined;        // 'undefined'
typeof null;            // 'object'（注意：这是 bug）
typeof true;            // 'boolean'
typeof 42;              // 'number'
typeof 'hello';         // 'string'
typeof Symbol('key');    // 'symbol'
typeof 9007199254740991n; // 'bigint'
typeof function(){};    // 'function'
typeof [];              // 'object'
typeof {};              // 'object'
typeof new Date();      // 'object'
```

**局限性**：
- 无法区分 `null` 和对象
- 无法区分数组、日期、正则等具体对象类型

### 2.2 instanceof 操作符

**语法**：`object instanceof constructor`

**原理**：检查构造函数的 `prototype` 是否出现在对象的原型链上

**示例**：
```javascript
[] instanceof Array;           // true
[] instanceof Object;          // true（Array 继承自 Object）
{} instanceof Object;           // true
new Date() instanceof Date;     // true
new Date() instanceof Object;   // true

// 基本类型无法使用
'hello' instanceof String;      // false（基本类型）
new String('hello') instanceof String; // true（包装对象）
```

**局限性**：
- 无法判断基本类型
- 跨框架/iframe 时可能失效
- 原型链可能被修改

### 2.3 Object.prototype.toString()

**语法**：`Object.prototype.toString.call(value)`

**返回值**：`[object Type]` 格式的字符串

**示例**：
```javascript
Object.prototype.toString.call('');           // '[object String]'
Object.prototype.toString.call(1);            // '[object Number]'
Object.prototype.toString.call(true);         // '[object Boolean]'
Object.prototype.toString.call(Symbol());     // '[object Symbol]'
Object.prototype.toString.call(9007199254740991n); // '[object BigInt]'
Object.prototype.toString.call(undefined);    // '[object Undefined]'
Object.prototype.toString.call(null);         // '[object Null]'
Object.prototype.toString.call([]);           // '[object Array]'
Object.prototype.toString.call({});           // '[object Object]'
Object.prototype.toString.call(new Date());   // '[object Date]'
Object.prototype.toString.call(/regex/);      // '[object RegExp]'
Object.prototype.toString.call(function(){}); // '[object Function]'
```

**封装通用类型判断函数**：
```javascript
function getType(value) {
  return Object.prototype.toString.call(value)
    .slice(8, -1)
    .toLowerCase();
}

getType([]);        // 'array'
getType({});        // 'object'
getType(null);      // 'null'
getType(undefined); // 'undefined'
```

### 2.4 Array.isArray()

**语法**：`Array.isArray(value)`

**用途**：专门判断是否为数组

**示例**：
```javascript
Array.isArray([]);           // true
Array.isArray({});           // false
Array.isArray('array');      // false
Array.isArray(null);         // false
```

### 2.5 类型判断方法对比

| 方法                        | 优点           | 缺点                     | 适用场景     |
| --------------------------- | -------------- | ------------------------ | ------------ |
| `typeof`                    | 简单快速       | 无法区分对象类型         | 基本类型判断 |
| `instanceof`                | 可判断继承关系 | 跨框架失效、原型链可修改 | 对象类型判断 |
| `Object.prototype.toString` | 最准确         | 语法稍复杂               | 精确类型判断 |
| `Array.isArray`             | 专门判断数组   | 仅限数组                 | 数组判断     |
| `constructor`               | 可获取构造函数 | 不稳定（可被修改）       | 不推荐使用   |

**最佳实践**：
```javascript
// 通用类型判断函数
function typeOf(value) {
  if (value === null) return 'null';
  if (typeof value === 'object') {
    return Object.prototype.toString.call(value)
      .slice(8, -1)
      .toLowerCase();
  }
  return typeof value;
}

// 使用
typeOf([]);        // 'array'
typeOf({});        // 'object'
typeOf(null);      // 'null'
typeOf(undefined); // 'undefined'
typeOf(42);        // 'number'
```

---

## 三、类型转换

### 3.1 隐式类型转换

#### 触发场景

**1. 算术运算**：
```javascript
'5' - 2;    // 3（字符串转数字）
'5' + 2;    // '52'（数字转字符串，+ 优先字符串拼接）
'5' * '2';  // 10（字符串转数字）
```

**2. 比较运算**：
```javascript
'5' == 5;   // true（类型转换后比较）
'5' === 5;  // false（严格相等，不转换）
null == undefined; // true（特殊规则）
```

**3. 逻辑运算**：
```javascript
if ('hello') { }  // 字符串转布尔值
if (0) { }        // 数字转布尔值
if (null) { }     // null 转布尔值
```

**4. 对象转原始值**：
```javascript
let obj = {
  valueOf() { return 1; },
  toString() { return '2'; }
};

obj + 1;        // 2（优先 valueOf）
String(obj);    // '2'（优先 toString）
```

#### 转换规则

**ToNumber（转数字）**：
```javascript
Number('123');     // 123
Number('123abc');  // NaN
Number('');        // 0
Number(true);      // 1
Number(false);     // 0
Number(null);      // 0
Number(undefined); // NaN
Number([]);        // 0（空数组）
Number([1]);       // 1（单元素数组）
Number([1,2]);     // NaN（多元素数组）
```

**ToString（转字符串）**：
```javascript
String(123);       // '123'
String(true);      // 'true'
String(null);      // 'null'
String(undefined); // 'undefined'
String([]);        // ''（空数组）
String([1,2]);     // '1,2'（数组元素用逗号连接）
String({});        // '[object Object]'
```

**ToBoolean（转布尔值）**：
```javascript
// 假值（Falsy）：转换为 false
Boolean(false);    // false
Boolean(0);        // false
Boolean(-0);      // false
Boolean(NaN);     // false
Boolean('');      // false
Boolean(null);     // false
Boolean(undefined); // false

// 真值（Truthy）：转换为 true
Boolean(true);     // true
Boolean(1);        // true
Boolean('hello');  // true
Boolean([]);       // true（注意：空数组也是 true）
Boolean({});       // true（注意：空对象也是 true）
```

### 3.2 显式类型转换

#### Number() / parseInt() / parseFloat()

```javascript
// Number：整体转换
Number('123');     // 123
Number('123abc');  // NaN

// parseInt：解析整数
parseInt('123');      // 123
parseInt('123abc');   // 123（解析到非数字字符停止）
parseInt('abc123');   // NaN
parseInt('10', 2);    // 2（二进制转十进制）

// parseFloat：解析浮点数
parseFloat('3.14');   // 3.14
parseFloat('3.14abc'); // 3.14
```

#### String() / toString()

```javascript
String(123);        // '123'
(123).toString();   // '123'
(123).toString(2);  // '1111011'（转二进制）

// 注意：null 和 undefined 没有 toString 方法
String(null);       // 'null'
String(undefined);  // 'undefined'
```

#### Boolean()

```javascript
Boolean(0);         // false
Boolean(1);         // true
Boolean('');        // false
Boolean('hello');   // true
```

### 3.3 避免隐式转换

**使用严格相等**：
```javascript
// ❌ 不推荐
if (value == 0) { }

// ✅ 推荐
if (value === 0) { }
```

**明确类型转换**：
```javascript
// ❌ 不推荐
let num = '123' - 0;

// ✅ 推荐
let num = Number('123');
// 或
let num = parseInt('123', 10);
```

---

## 四、数字精度问题

### 4.1 精度丢失原因

**IEEE 754 双精度浮点数**：
- JavaScript 使用 64 位双精度浮点数表示数字
- 二进制无法精确表示某些十进制小数
- 导致运算结果不准确

**示例**：
```javascript
0.1 + 0.2;              // 0.30000000000000004
0.3 - 0.1;              // 0.19999999999999998
0.1 * 3;                // 0.30000000000000004
```

### 4.2 解决方案

#### 方案1：转换为整数运算
```javascript
function add(a, b) {
  const factor = Math.pow(10, Math.max(
    String(a).split('.')[1]?.length || 0,
    String(b).split('.')[1]?.length || 0
  ));
  return (a * factor + b * factor) / factor;
}

add(0.1, 0.2); // 0.3
```

#### 方案2：使用 toFixed()（注意返回字符串）
```javascript
(0.1 + 0.2).toFixed(2);  // '0.30'
Number((0.1 + 0.2).toFixed(2)); // 0.3
```

#### 方案3：使用第三方库
- `decimal.js`
- `big.js`
- `number-precision`

#### 方案4：使用 BigInt（仅限整数）
```javascript
const a = BigInt(9007199254740991);
const b = BigInt(1);
console.log(a + b); // 9007199254740992n
```

### 4.3 数字范围

```javascript
// 最大安全整数
Number.MAX_SAFE_INTEGER;  // 9007199254740991

// 最小安全整数
Number.MIN_SAFE_INTEGER;  // -9007199254740991

// 最大数值
Number.MAX_VALUE;         // 1.7976931348623157e+308

// 最小数值
Number.MIN_VALUE;         // 5e-324

// 判断是否为安全整数
Number.isSafeInteger(9007199254740991); // true
Number.isSafeInteger(9007199254740992); // false
```

---

## 五、原型和原型链

### 5.1 原型规则

**规则 A**：所有引用类型都具有对象特性，可自由扩展属性
```javascript
let obj = {};
obj.name = 'Alice';  // ✅ 可以扩展

let arr = [];
arr.custom = 'test'; // ✅ 可以扩展

function fn() {}
fn.custom = 'test';   // ✅ 可以扩展
```

**规则 B**：所有引用类型都有一个 `__proto__` 属性（隐式原型）
```javascript
let obj = {};
console.log(obj.__proto__); // 指向 Object.prototype
```

**规则 C**：所有函数都有一个 `prototype` 属性（显式原型）
```javascript
function Person() {}
console.log(Person.prototype); // 指向原型对象
```

**规则 D**：引用类型的 `__proto__` 指向其构造函数的 `prototype`
```javascript
let obj = {};
obj.__proto__ === Object.prototype; // true

let arr = [];
arr.__proto__ === Array.prototype;  // true

function fn() {}
fn.__proto__ === Function.prototype; // true
```

**规则 E**：属性查找时，先在自身查找，找不到则沿原型链向上查找
```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log('Hello, ' + this.name);
};

let person = new Person('Alice');
person.sayHello(); // 'Hello, Alice'

// 查找过程：
// 1. person.sayHello → 自身没有
// 2. person.__proto__ (Person.prototype) → 找到 sayHello
```

### 5.2 原型链图示

```
person (实例)
  │
  ├─ name: 'Alice' (自身属性)
  │
  └─ __proto__ → Person.prototype
       │
       ├─ sayHello: function (原型属性)
       │
       └─ __proto__ → Object.prototype
            │
            ├─ toString: function
            ├─ valueOf: function
            │
            └─ __proto__ → null (原型链终点)
```

### 5.3 instanceof 原理

**手动实现**：
```javascript
function myInstanceof(obj, constructor) {
  let proto = obj.__proto__;
  const prototype = constructor.prototype;
  
  while (proto !== null) {
    if (proto === prototype) {
      return true;
    }
    proto = proto.__proto__;
  }
  
          return false; 
}

// 使用
myInstanceof([], Array);   // true
myInstanceof([], Object);  // true
```

---

## 六、继承实现

### 6.1 原型链继承

```javascript
function Parent() {
  this.name = 'Parent';
}

Parent.prototype.sayHello = function() {
  console.log('Hello from Parent');
};

function Child() {
  this.age = 10;
}

Child.prototype = new Parent(); // 继承

let child = new Child();
child.sayHello(); // 'Hello from Parent'
```

**缺点**：
- 子类实例共享父类引用属性
- 无法向父类传参

### 6.2 构造函数继承

```javascript
function Parent(name) {
  this.name = name;
}

function Child(name, age) {
  Parent.call(this, name); // 调用父构造函数
  this.age = age;
}

let child = new Child('Alice', 10);
```

**缺点**：
- 无法继承父类原型方法

### 6.3 组合继承（推荐）

```javascript
function Parent(name) {
  this.name = name;
}

Parent.prototype.sayHello = function() {
  console.log('Hello, ' + this.name);
};

function Child(name, age) {
  Parent.call(this, name); // 继承属性
  this.age = age;
}

Child.prototype = new Parent(); // 继承方法
Child.prototype.constructor = Child; // 修正构造函数

let child = new Child('Alice', 10);
child.sayHello(); // 'Hello, Alice'
```

### 6.4 ES6 Class 继承

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }
  
  sayHello() {
    console.log('Hello, ' + this.name);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父类构造函数
    this.age = age;
  }
}

let child = new Child('Alice', 10);
child.sayHello(); // 'Hello, Alice'
```

**Class 本质**：语法糖，底层仍基于原型链

---

## 七、数组方法详解

### 7.1 修改原数组的方法

| 方法           | 说明          | 返回值         | 示例                                      |
| -------------- | ------------- | -------------- | ----------------------------------------- |
| `push()`       | 末尾添加元素  | 新数组长度     | `[1,2].push(3)` → `3`                     |
| `pop()`        | 删除末尾元素  | 删除的元素     | `[1,2].pop()` → `2`                       |
| `shift()`      | 删除首元素    | 删除的元素     | `[1,2].shift()` → `1`                     |
| `unshift()`    | 首部添加元素  | 新数组长度     | `[1,2].unshift(0)` → `3`                  |
| `splice()`     | 删除/插入元素 | 删除的元素数组 | `[1,2,3].splice(1,1,4)` → `[2]`           |
| `reverse()`    | 反转数组      | 原数组         | `[1,2,3].reverse()` → `[3,2,1]`           |
| `sort()`       | 排序          | 原数组         | `[3,1,2].sort()` → `[1,2,3]`              |
| `fill()`       | 填充数组      | 原数组         | `new Array(3).fill(0)` → `[0,0,0]`        |
| `copyWithin()` | 复制元素      | 原数组         | `[1,2,3,4].copyWithin(0,2)` → `[3,4,3,4]` |

### 7.2 不修改原数组的方法

| 方法            | 说明     | 返回值    | 示例                                |
| --------------- | -------- | --------- | ----------------------------------- |
| `concat()`      | 合并数组 | 新数组    | `[1,2].concat([3,4])` → `[1,2,3,4]` |
| `slice()`       | 截取数组 | 新数组    | `[1,2,3].slice(1)` → `[2,3]`        |
| `join()`        | 转字符串 | 字符串    | `[1,2,3].join('-')` → `'1-2-3'`     |
| `indexOf()`     | 查找索引 | 索引或 -1 | `[1,2,3].indexOf(2)` → `1`          |
| `lastIndexOf()` | 最后索引 | 索引或 -1 | `[1,2,2].lastIndexOf(2)` → `2`      |
| `includes()`    | 是否包含 | 布尔值    | `[1,2,3].includes(2)` → `true`      |

### 7.3 遍历方法

| 方法            | 说明       | 返回值                   | 是否中断 |
| --------------- | ---------- | ------------------------ | -------- |
| `forEach()`     | 遍历执行   | `undefined`              | ❌        |
| `map()`         | 映射新数组 | 新数组                   | ❌        |
| `filter()`      | 过滤数组   | 新数组                   | ❌        |
| `find()`        | 查找元素   | 找到的元素或 `undefined` | ✅        |
| `findIndex()`   | 查找索引   | 索引或 -1                | ✅        |
| `some()`        | 是否有满足 | 布尔值                   | ✅        |
| `every()`       | 是否都满足 | 布尔值                   | ✅        |
| `reduce()`      | 累积计算   | 累积值                   | ❌        |
| `reduceRight()` | 从右累积   | 累积值                   | ❌        |

### 7.4 ES6+ 新增方法

#### flat() / flatMap()（ES2019）

```javascript
// flat：扁平化数组
[1, [2, [3]]].flat();        // [1, 2, [3]]
[1, [2, [3]]].flat(2);       // [1, 2, 3]
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]

// flatMap：先 map 后 flat(1)
[1, 2, 3].flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
```

#### Array.from() / Array.of()

```javascript
// Array.from：类数组转数组
Array.from('hello');           // ['h','e','l','l','o']
Array.from({length: 3}, (_, i) => i); // [0, 1, 2]

// Array.of：创建数组
Array.of(1, 2, 3);            // [1, 2, 3]
Array.of(3);                  // [3]（与 new Array(3) 不同）
```

#### find() / findIndex()（ES6）

```javascript
const arr = [1, 2, 3, 4, 5];

arr.find(x => x > 3);         // 4（找到第一个）
arr.findIndex(x => x > 3);    // 3（找到第一个索引）
```

#### includes()（ES2016）

```javascript
[1, 2, 3].includes(2);        // true
[1, 2, NaN].includes(NaN);    // true（indexOf 无法判断 NaN）
```

### 7.5 常用数组操作场景

#### 数组去重

```javascript
// 方法1：Set
[...new Set([1,2,2,3])];      // [1,2,3]

// 方法2：filter + indexOf
[1,2,2,3].filter((item, index) => 
  arr.indexOf(item) === index
);

// 方法3：reduce
[1,2,2,3].reduce((acc, cur) => 
  acc.includes(cur) ? acc : [...acc, cur], []
);
```

#### 数组扁平化

```javascript
// 方法1：flat
[1, [2, [3]]].flat(Infinity);

// 方法2：递归
function flatten(arr) {
  return arr.reduce((acc, cur) => 
    Array.isArray(cur) ? [...acc, ...flatten(cur)] : [...acc, cur], 
    []
  );
}

// 方法3：toString（仅数字）
[1, [2, [3]]].toString().split(',').map(Number);
```

#### 数组分组

```javascript
function groupBy(arr, key) {
  return arr.reduce((acc, cur) => {
    const group = cur[key];
    if (!acc[group]) acc[group] = [];
    acc[group].push(cur);
    return acc;
  }, {});
}

groupBy([
  {type: 'fruit', name: 'apple'},
  {type: 'fruit', name: 'banana'},
  {type: 'veg', name: 'carrot'}
], 'type');
```

---

## 八、模块化

### 8.1 export 和 export default

#### export（命名导出）

```javascript
// 方式1：直接导出
export const name = 'Alice';
export function sayHello() { }

// 方式2：先定义后导出
const name = 'Alice';
function sayHello() { }
export { name, sayHello };

// 方式3：重命名导出
export { name as userName, sayHello as greet };
```

**导入**：
```javascript
import { name, sayHello } from './module';
import { name as userName } from './module';
import * as module from './module'; // 全部导入
```

#### export default（默认导出）

```javascript
// 一个模块只能有一个默认导出
export default function sayHello() { }

// 或
function sayHello() { }
export default sayHello;
```

**导入**：
```javascript
import sayHello from './module';
import myFunc from './module'; // 可以任意命名
```

#### 区别对比

| 特性     | export             | export default   |
| -------- | ------------------ | ---------------- |
| 数量     | 可以有多个         | 只能有一个       |
| 导入语法 | `import { name }`  | `import name`    |
| 重命名   | 需要 `as`          | 可直接重命名     |
| 导出方式 | 可直接导出或先定义 | 只能先定义后导出 |

---

## 九、核心面试题

### 1. JavaScript 有哪些数据类型？
- **基本类型**：Undefined、Null、Boolean、String、Number、Symbol、BigInt
- **引用类型**：Object、Array、Function、Date、RegExp、Map、Set 等

### 2. null 和 undefined 的区别？
- `null`：表示空值，是对象类型，`typeof null === 'object'`
- `undefined`：表示未定义，是 undefined 类型，`typeof undefined === 'undefined'`
- `null == undefined` 为 `true`，但 `null === undefined` 为 `false`

### 3. 如何判断数组类型？
- `Array.isArray(arr)`（推荐）
- `Object.prototype.toString.call(arr) === '[object Array]'`
- `arr instanceof Array`（跨框架可能失效）

### 4. 值类型和引用类型的区别？
- **值类型**：存储在栈中，按值访问，赋值时复制值
- **引用类型**：数据在堆中，栈中存储指针，赋值时复制指针

### 5. 什么是原型链？
- 对象通过 `__proto__` 属性连接形成链式结构
- 属性查找时沿原型链向上查找，直到找到或到达 `null`

### 6. 如何实现继承？
- 原型链继承、构造函数继承、组合继承
- ES6 Class 继承（推荐）

### 7. 数组去重的方法？
- `[...new Set(arr)]`
- `filter + indexOf`
- `reduce`

### 8. 如何避免数字精度问题？
- 转换为整数运算
- 使用 `toFixed()` 并转回数字
- 使用第三方库（decimal.js）
- 整数使用 BigInt

### 9. `some` 和 `every` 在空数组上的返回值？
- `[].some(callback)` 返回 **false**：相当于问“是否至少有一个元素满足条件”，空数组中没有任何元素，自然没有“至少一个满足”的情况
- `[].every(callback)` 返回 **true**：相当于问“是否所有元素都满足条件”，空数组中没有反例（没有任何元素不满足），逻辑上视为“命题对所有元素都成立”，这也叫**空真值（vacuous truth）**

**面试易踩坑点**：不能用 `every` 来判断“数组不为空且全部满足条件”，要先判断 `length > 0`，否则空数组也会返回 `true`。
