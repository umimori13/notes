别用 with，来源https://blog.csdn.net/zwkkkk1/article/details/79725934
会导致性能下降并且不好用

内存是通过定时器进行的垃圾整理，主要通过没被引用的东西会被请出内存，注意重复引用，即互相引用，在不用的时候可以清理，同时也可以用解除引用的方式，使用函数来进行特别的赋值

等价性
有四种等价性操作符：==，===，!=，和!==。!形式当然是与它们相对应操作符平行的“不等”版本；不等（non-equality） 不应当与 不等价性（inequality） 相混淆。

==和===之间的不同通常被描述为，==检查值的等价性而===检查值和类型两者的等价性。然而，这是不准确的。描述它们的合理方式是，==在允许强制转换的条件下检查值的等价性，而===是在不允许强制转换的条件下检查值的等价性；因此===常被称为“严格等价”。

考虑这个隐含强制转换，它在==宽松等价性比较中允许，而===严格等价性比较中不允许：

var a = "42";
var b = 42;

a == b; // true
a === b; // false
在 a == b 的比较中，JS 注意到类型不匹配，于是它经过一系列有顺序的步骤将一个值或者它们两者强制转换为一个不同的类型，直到类型匹配为止，然后就可以检查一个简单的值等价性。

如果你仔细想一想，通过强制转换 a == b 可以有两种方式给出 true。这个比较要么最终成为 42 == 42，要么成为"42" == "42"。那么是哪一种呢？

答案："42"变成 42，于是比较成为 42 == 42。在一个这样简单的例子中，只要最终结果是一样的，处理的过程走哪一条路看起来并不重要。但在一些更复杂的情况下，这不仅对比较的最终结果很重要，而且对你 如何 得到这个结果也很重要。

a === b 产生 false，因为强制转换是不允许的，所以简单值的比较很明显将会失败。许多开发者感觉===更可靠，所以他们提倡一直使用这种形式而远离==。我认为这种观点是非常短视的。我相信==是一种可以改进程序的强大工具，如果你花时间去学习它的工作方式。

我们不会详细地讲解强制转换在==比较中是如何工作的。它的大部分都是相当合理的，但是有一些重要的极端用例要小心。你可以阅读 ES5 语言规范的 11.9.3 部分（http://www.ecma-international.org/ecma-262/5.1/）来了解确切的规则，而且与围绕这种机制的所有负面炒作比起来，你会对这它是多么的直白而感到吃惊。

为了将这许多细节归纳为一个简单的包装，并帮助你在各种情况下判断是否使用==或===，这是我的简单规则：

如果一个比较的两个值之一可能是 true 或 false 值，避免==而使用===。
如果一个比较的两个值之一可能是这些具体的值（0，""，或[] —— 空数组），避免==而使用===。
在 所有 其他情况下，你使用==是安全的。它不仅安全，而且在许多情况下它可以简化你的代码并改善可读性。
这些规则归纳出来的东西要求你严谨地考虑你的代码：什么样的值可能通过这个被比较等价性的变量。如果你可以确定这些值，那么==就是安全的，使用它！如果你不能确定这些值，就使用===。就这么简单。

!=不等价形式对应于==，而!==形式对应于===。我们刚刚讨论的所有规则和注意点对这些非等价比较都是平行适用的。

如果你在比较两个非基本类型值，比如 object（包括 function 和 array），那么你应当特别小心==和===的比较规则。因为这些值实际上是通过引用持有的，==和===比较都将简单地检查这个引用是否相同，而不是它们底层的值。

例如 �，array 默认情况下会通过使用逗号（,）连接所有值来被强制转换为 string。你可能认为两个内容相同的 array 将是==相等的，但它们不是：

var a = [1,2,3];
var b = [1,2,3];
var c = "1,2,3";

a == c; // true
b == c; // true
a == b; // false
注意： 更多关于==等价性比较规则的信息，参见 ES5 语言规范（11.9.3 部分），和本系列的 类型与文法 的第四章；更多关于值和引用的信息，参见它的第二章。

The Abstract Equality Comparison Algorithm
The comparison x == y, where x and y are values, produces true or false. Such a comparison is performed as follows:

If Type(x) is the same as Type(y), then
If Type(x) is Undefined, return true.
If Type(x) is Null, return true.
If Type(x) is Number, then
If x is NaN, return false.
If y is NaN, return false.
If x is the same Number value as y, return true.
If x is +0 and y is −0, return true.
If x is −0 and y is +0, return true.
Return false.
If Type(x) is String, then return true if x and y are exactly the same sequence of characters (same length and same characters in corresponding positions). Otherwise, return false.
If Type(x) is Boolean, return true if x and y are both true or both false. Otherwise, return false.
Return true if x and y refer to the same object. Otherwise, return false.
If x is null and y is undefined, return true.
If x is undefined and y is null, return true.
If Type(x) is Number and Type(y) is String,
return the result of the comparison x == ToNumber(y).
If Type(x) is String and Type(y) is Number,
return the result of the comparison ToNumber(x) == y.
If Type(x) is Boolean, return the result of the comparison ToNumber(x) == y.
If Type(y) is Boolean, return the result of the comparison x == ToNumber(y).
If Type(x) is either String or Number and Type(y) is Object,
return the result of the comparison x == ToPrimitive(y).
If Type(x) is Object and Type(y) is either String or Number,
return the result of the comparison ToPrimitive(x) == y.
Return false.
NOTE 1Given the above definition of equality:

String comparison can be forced by: "" + a == "" + b.
Numeric comparison can be forced by: +a == +b.
Boolean comparison can be forced by: !a == !b.
NOTE 2The equality operators maintain the following invariants:

A != B is equivalent to !(A == B).
A == B is equivalent to B == A, except in the order of evaluation of A and B.
NOTE 3The equality operator is not always transitive. For example, there might be two distinct String objects, each representing the same String value; each String object would be considered equal to the String value by the == operator, but the two String objects would not be equal to each other. For Example:

new String("a") == "a" and "a" == new String("a")are both true.
new String("a") == new String("a") is false.
NOTE 4Comparison of Strings uses a simple equality test on sequences of code unit values. There is no attempt to use the more complex, semantically oriented definitions of character or string equality and collating order defined in the Unicode specification. Therefore Strings values that are canonically equal according to the Unicode standard could test as unequal. In effect this algorithm assumes that both Strings are already in normalised form.
