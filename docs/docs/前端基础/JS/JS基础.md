# js

## 变量和类型

- Undefined
- Null

- Boolean

- String

- Number

- Symbol（es6引入，为了防止属性名冲突：独一无二的值，应用：定义常量，消除魔法字符串）

- Object（是引用数据类型，访问时访问的是引用，function和Array是子类型）

- Bigint：（用来表示任意精度整数的基本数据类型，使用BigInt可以安全的存储和操作任意大小的整数而不受Number类型的安全值范围的限制。用于表示大于 2^53 - 1（Number.MAX_SAFE_INTEGER）的整数。）
## 数据类型的底层数据结构

答：基本数据类型的变量是按`值`存储在栈中的，引用数据类型按`地址指针`栈中，数据存储在堆中，当我们想要访问引用类型的值的时候，需要先从栈中获得对象的地址指针，然后，在通过地址指针找到堆中的所需要的数据
堆是一种特殊的树形数据结构，一般讨论的堆都是二叉堆。堆的特点是根结点的值是所有结点中最小的或者最大的，并且根结点的两个子树也是一个堆结构：
栈是一种特殊的线性表，它只能在一个表的一个固定端进行数据结点的插入和删除操作。栈按照后进先出的原则来存储数据，也就是说，先插入的数据将被压入栈底，最后插入的数据在栈顶，读出数据时，从栈顶开始逐个读出。栈在汇编语言程序中，经常用于重要数据的现场保护。栈中没有数据时，称为空栈。先进后出， 后进先出。
JavaScript基本类型数据都是直接按`值`存储在栈中的(Undefined、Null、不是new出来的布尔、数字和字符串)，每种类型的数据占用的内存空间的大小是确定的，并由系统自动分配和自动释放。这样带来的好处就是，内存可以及时得到回收，相对于堆来说 ，更加容易管理内存空间。

JavaScript引用类型数据被存储于堆中 (如对象、数组、函数等，它们是通过拷贝和new出来的）。其实，说存储于堆中，也不太准确，因为，引用类型的数据的地址指针是存储于栈中的，`当我们想要访问引用类型的值的时候，需要先从栈中获得对象的地址指针，然后，在通过地址指针找到堆中的所需要的数据`。


## Symbol类型在实际开发中的应用、可手动实现一个简单的Symbol

答：一个简单的应用是创建一个不可枚举的私有属性：
```js
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
console.log(Object.keys(instance)); // []
let mySymbol = Symbol('key');
// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';
// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};
```

## 基本类型对应的内置对象，以及他们之间的装箱拆箱操作 - String(), Number(), Boolean()

### 隐式装箱
``` js
let a = 'sun'
let b = a.indexof('s') // 0 // 返回下标
// 上面代码在后台实际的步骤为：
// 创建String类型的一个实例；
let a = new String('sun')
// 在实例上调用指定的方法；
let b = a.indexof('s')
// 销毁这个实例；
a = null
```

### 拆箱：

拆箱操作中主要有两个方法，`valueOf()`方法和`toString()`方法。这两个方法主要用来检测你返回的是不是一个基本类型的值。一般是先用valueOf()来检测，如果返回的不是一个基本类型的值，是对象自身，则会继续用toString()来检测，如果检测结果不是一个基本类型的值，则会报错(Uncaught SyntaxError: Invalid or unexpected token)

#### valueOf()

- valueOf() 方法返回指定对象的原始值。
- JavaScript调用valueOf方法将对象转换为原始值。你很少需要自己调用valueOf方法；当遇到要预期的原始值的对象时，JavaScript会自动调用它。
- 默认情况下，valueOf方法由Object后面的每个对象继承。 每个内置的核心对象都会覆盖此方法以返回适当的值。如果对象没有原始值，则valueOf将返回对象本身。
- JavaScript的许多内置对象都重写了该函数，以实现更适合自身的功能需要。因此，不同类型对象的valueOf()方法的返回值和返回值类型均可能不同
#### toString()
- toString() 方法返回一个表示该对象的字符串。
- 每个对象都有一个 toString() 方法，当该对象被表示为一个文本值时，或者一个对象以预期的字符串方式引用时自动调用。
- 默认情况下，toString() 方法被每个 Object 对象继承。如果此方法在自定义对象中未被覆盖，toString() 返回 “[object type]”，其中 type 是对象的类型。
``` js
例子：
    let name = new String('sun')
    let age = new Number(24)
    console.log(typeof name) // object
    console.log(typeof age) //  object
    // 拆箱操作
    console.log(typeof age.valueOf()); // number // 24  基本的数字类型
    console.log(typeof name.valueOf()); // string  // 'sun' 基本的字符类型
    console.log(typeof age.toString()); // string  // '24' 基本的字符类型
    console.log(typeof name.toString()); // string  // 'sun' 基本的字符类型
```
## 理解值类型和引用类型

JavaScript中的变量分为基本类型和引用类型:
- 基本类型: 保存在栈内存中的简单数据段，它们的值都有固定的大小，保存在栈空间，通过按值访问

- 引用类型: 保存在堆内存中的对象，值大小不固定，栈内存中存放的该对象的访问地址指向堆内存中的对象，JavaScript 不允许直接访问堆内存中的位置，因此操作对象时，实际操作对象的引用


## 至少可以说出三种判断JavaScript数据类型的方式，以及他们的优缺点，如何准确的判断数组类型

- typeof：判断不出null和数组 ，日期，正则这些内置对象的具体类型：都会显示object
有些时候，typeof 操作符会返回一些令人迷惑但技术上却正确的值：
对于基本类型，除 null 以外，均可以返回正确的结果。
对于引用类型，除 function 以外，一律返回 object 类型。
对于 null ，返回 object 类型。
对于 function 返回  function 类型。
其中，null 有属于自己的数据类型 Null ， 引用类型中的 数组、日期、正则 也都有属于自己的具体类型，而 typeof 对于这些类型的处理，只返回了处于其原型链最顶端的 Object 类型，没有错，但不是我们想要的结果。

```js
typeof'';// string 有效
typeof1;// number 有效
typeofSymbol();// symbol 有效
typeoftrue;//boolean 有效
typeofundefined;//undefined 有效
typeofnull;//object 无效
typeof[] ;//object 无效
typeofnewFunction();// function 有效
typeofnewDate();//object 无效
typeofnewRegExp();//object 无效 
```
- instanceof：
  - instanceof 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型。

  - null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，这两种类型的数据需要通过其他方式来判断。

  - 函数的 constructor 是不稳定的，这个主要体现在自定义对象上，当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 Object
  - constructor：返回对象对应的构造函数
- Array.isArray
- tostring：
``` js
Object.prototype.toString.call('') ;  // [object String]
Object.prototype.toString.call(1) ;   // [object Number]
Object.prototype.toString.call(true) ;// [object Boolean]
Object.prototype.toString.call(Symbol());//[object Symbol]
Object.prototype.toString.call(undefined) ;// [object Undefined]
Object.prototype.toString.call(null) ;// [object Null]
Object.prototype.toString.call(newFunction()) ;// [object Function]
Object.prototype.toString.call(newDate()) ;// [object Date]
Object.prototype.toString.call([]) ;// [object Array]
Object.prototype.toString.call(newRegExp()) ;// [object RegExp]
Object.prototype.toString.call(newError()) ;// [object Error]
Object.prototype.toString.call(document) ;// [object HTMLDocument]
Object.prototype.toString.call(window) ;//[object global] window 是全局对象 global 的引用
```
## 可能发生隐式类型转换的场景以及转换原则，应如何避免或巧妙应用

if做判断时 会隐式转换
## 出现小数精度丢失的原因，JavaScript可以存储的最大数字、最大安全数字，JavaScript处理大数字的方法、避免精度丢失的方法

答：精度丢失原因，说是 JavaScript 使用了 IEEE 754 规范，二进制储存十进制的小数时不能完整的表示小数
能够表示的最大数字 Number.MAX_VALUE 等于 1.7976931348623157e+308 ,最大安全数字 Number.MAX_SAFE_INTEGER 等于 9007199254740991
`先变成整数，在运算，或者使用提案的新数据类型 bigint`
## 原型和原型链

1.理解原型设计模式以及JavaScript中的原型规则
- A. 所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性；
- B. 所有的引用类型（数组、对象、函数），都有一个`__proto__`属性（隐式原型），属性值是一个普通的对象；
- C. 所有的函数，都具有一个 `prototype`（显式原型），属性值也是一个普通对象；
- D. 所有的引用类型（数组、对象、函数），其隐式原型指向其构造函数的显式原型；`（obj._proto_ === Object.prototype）`；
- E. 当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的 `__proto__` （即它的构造函数的 `prototype`）中去寻找；
## instanceof的底层实现原理
- 手动实现一个instanceof：`就是看实例对象的隐式原型是否全等于构造函数的显示原型`
``` js
function instanceOf(obj, object) {//obj 表示实例对象，object 表示对象
  var O = object.prototype;
  obj = obj.__proto__;
  while (true) { 
      if (obj === null) 
          return false; 
      if (O === obj) // 这里重点：当 O 严格等于 obj 时，返回 true 
          return true; 
      obj = obj.__proto__; // 继续向上查找原型
  } 
}
```
## 实现继承的几种方式以及他们的优缺点

## 理解es6 class构造以及继承的底层实现原理





## 如何处理循环的异步操作

- 将异步操作变同步，使用 async/await.
- 去掉循环，将循环变成递归

- callback (回调函数)
  - 回调函数代表着，当某个任务处理完，然后需要做的事。比如读取文件，连接数据库，等文件准备好，或数据库连接成功执行编写的回调函数，又比如像一些动画处理，当动画走完，然后执行回调。

- 发布订阅模式
  - 顾名思义，便是先订阅了事件，有人一发布事件你就知道了，接着执行后面的操作。

- Promise
  - Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件的结果，相比回调函数，Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

- Generator (生成器)函数
  - Generator 函数是 ES6 提供的一种异步编程解决方案，其行为类似于状态机。

- async/await
  - async/await 本质上还是基于 Generator 函数，可以说是 Generator 函数的语法糖，async 就相当于之前写的run函数(执行Generator函数的函数),而 await 就相当于 yield ，只不过 await 表达式后面只能跟着 Promise 对象，如果不是 Promise 对象的话，会通过 Promise.resolve 方法使之变成 Promise 对象。async 修饰 function,其返回一个 Promise 对象。

## export default 和 export 有什么区别
export 、export default，都属于ES6里面的语法

1. export与export default均可用于导出常量、函数、文件、模块等

2. 你可以在其它文件或模块中通过import+(常量 | 函数 | 文件 | 模块)名的方式，将其导入，以便能够对其进行使用

3. 在一个文件或模块中，export、import可以有多个，export default仅有一个

export default 用于规定模块的默认对外接口，只能有一个，所以 export default 在同一个模块中只能出现一次。

4. 通过export方式导出，在导入时要加{ }，export default则不需要，因为它本身只能有一个

export default的import方式之所以不需要使用大括号包裹。因为对于export default 其输出的本来就只有一个接口，提供的是模块的默认接口，自然不需要使用大括号包裹。

5、 export 可以直接导出或者先定义后导出都可以，export default只能先定义后导出

## 数组常用的方法
join(separator):将数组的元素组起一个字符串，以separator为分隔符，省略的话则用默认用逗号为分隔符

push()：将参数添加到原数组末尾，并返回数组的长度(修改原数组)

pop()：删除原数组最后一项，并返回删除元素的值；如果数组为空则返回undefined（修改原数组）

shift()：删除原数组第一项，并返回删除元素的值；如果数组为空则返回undefined

unshift()： 将参数添加到原数组开头，并返回数组的长度（修改原数组）

slice(start,end):可以截取出数组某部份的元素为一个新的数组，有两个必填的参数，第一个是起始位置，第二个是结束位置( 操作时数字减1 ) 原数组不改变

splice(start,deleteCount,val1,val2,…):从start位置开始删除deleteCount项，并从该位置起插入。（修改原数组）

fill()：使用特定值填充数组中的一个或多个元素(修改原数组)

filter()：过滤,数组中的每一项运行给定函数，返回满足过滤条件组成的数组

concat()：可以将两个数组合并在一起，如果是使用ES6语法也可以用扩展运算符…来代替

indexOf()：返回当前值在数组中第一次出现位置的索引

lastIndexOf()：返回查找的字符串最后出现的位置，如果没有找到匹配字符串则返回 -1。

every()：判断数组中每一项是否都符合条件

some()：判断数组中是否存在满足的项

includes()：判断一个数组是否包含指定的值

sort(orderfunction):按指定的参数对数组进行排序(修改原数组)

reverse()：将数组反序(修改原数组)

forEach()：循环遍历数组每一项（没有返回值）

map()：循环遍历数组的每一项（有返回值）

copyWithin(): 从数组的指定位置拷贝元素到数组的另一个指定位置中（修改原数组）

find(): 返回第一个匹配的值，并停止查找

findIndex(): 返回第一个匹配值的索引，并停止查找

toLocaleString()、toString():将数组转换为字符串

flat()、flatMap()：扁平化数组

entries() 、keys() 、values():遍历数组
