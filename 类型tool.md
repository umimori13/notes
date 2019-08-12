typeof 
直接和变量就可以
不过需要注意的是，null是对象，在不同浏览器里，正则可能是function可能是object，而函数也一般是function

parseInt()
可以把字符串前面变为数字，不能对"2e2"进行有效转换
>>>parseInt("2e2")
2
>>>parseInt("10",16)
A
>>>parseInt("AF",16)
175
>>>parseInt("0xAF",16)
175
>>>parseInt("AF")
NaN
>>>parseInt("22.2")
22

parseFloat()
这个可以对小数解析，但只会看一个小数点，只解析十进制
>>>parseFloat("22.33.5")
22.33
>>>parseFloat("2e3")
2000


