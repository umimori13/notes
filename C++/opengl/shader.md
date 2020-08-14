# 数据类型

---

## 向量

GLSL 中的向量是一个可以包含有 1、2、3 或者 4 个分量的容器，分量的类型可以是前面默认基础类型的任意一个。它们可以是下面的形式（n 代表分量的数量）：

| 类型  | 含义                       |
| ----- | -------------------------- |
| bvecn | 包含 n 个 bool 分量的向量  |
| ivecn | 包含 n 个 int 分量的向量   |
| vecn  | 包含 n 个 float 分量的默认 |
| uvecn | 包含 n 个 unsigned int 分  |
| dvecn | 包含 n 个 double 分量的向  |

一个向量的分量可以通过 vec.x 这种方式获取，这里 x 是指这个向量的第一个分量。你可以分别使用.x、.y、.z 和.w 来获取它们的第 1、2、3、4 个分量。GLSL 也允许你对颜色使用 rgba，或是对纹理坐标使用 stpq 访问相同的分量。

向量这一数据类型也允许一些有趣而灵活的分量选择方式，叫做重组(Swizzling)。重组允许这样的语法：

```GLSL
vec2 someVec;
vec4 differentVec = someVec.xyxx;
vec3 anotherVec = differentVec.zyw;
vec4 otherVec = someVec.xxxx + anotherVec.yxzy;
```

你可以使用上面 4 个字母任意组合来创建一个和原来向量一样长的（同类型）新向量，只要原来向量有那些分量即可；然而，你不允许在一个 vec2 向量中去获取.z 元素。我们也可以把一个向量作为一个参数传给不同的向量构造函数，以减少需求参数的数量：

```GLSL
vec2 vect = vec2(0.5, 0.7);
vec4 result = vec4(vect, 0.0, 0.0);
vec4 otherResult = vec4(result.xyz, 1.0);
```

# 输入与输出

---

layout (location = 0)。顶点着色器需要为它的输入提供一个额外的 layout 标识，这样我们才能把它链接到顶点数据。

你也可以忽略 layout (location = 0)标识符，通过在 OpenGL 代码中使用 glGetAttribLocation 查询属性位置值(Location)，但是我更喜欢在着色器中设置它们，这样会更容易理解而且节省你（和 OpenGL）的工作量。

如果是 Uniform 的话也可以通过
glGetUniformLocation(shaderProgram, "ourColor");
来获取对应的属性位置值

# Uniform

---

首先，uniform 是全局的(Global)。全局意味着 uniform 变量必须在每个着色器程序对象中都是独一无二的，而且它可以被着色器程序的任意着色器在任意阶段访问。第二，无论你把 uniform 值设置成什么，uniform 会一直保存它们的数据，直到它们被重置或更新。
如果你声明了一个 uniform 却在 GLSL 代码中没用过，编译器会静默移除这个变量，导致最后编译出的版本中并不会包含它，这可能导致几个非常麻烦的错误，记住这点！

接着，我们用 glGetUniformLocation 查询 uniform ourColor 的位置值。我们为查询函数提供着色器程序和 uniform 的名字（这是我们希望获得的位置值的来源）。如果 glGetUniformLocation 返回-1 就代表没有找到这个位置值。最后，我们可以通过 glUniform4f 函数设置 uniform 值。注意，查询 uniform 地址不要求你之前使用过着色器程序，但是更新一个 uniform 之前你必须先使用程序（调用 glUseProgram)，因为它是在当前激活的着色器程序中设置 uniform 的。

```GLSL
    int vertexColorLocation = glGetUniformLocation(shaderProgram, "ourColor");
    glUniform4f(vertexColorLocation, 0.0f, greenValue, 0.0f, 1.0f);
```
