#include <glad/glad.h>
#include <shader.h>
#include <GLFW/glfw3.h>

#include <iostream>

void framebuffer_size_callback(GLFWwindow* window, int width, int height);
void processInput(GLFWwindow* window);

// settings
const unsigned int SCR_WIDTH  = 800;
const unsigned int SCR_HEIGHT = 600;

const char* vertexShaderSource =
    "#version 330 core\n"
    "layout (location = 0) in vec3 aPos;\n"
    "void main()\n"
    "{\n"
    "   gl_Position = vec4(aPos.x, aPos.y, aPos.z, 1.0);\n"
    "}\0";
const char* fragmentShaderSource =
    "#version 330 core\n"
    "out vec4 FragColor;\n"
    "void main()\n"
    "{\n"
    "   FragColor = vec4(1.0f, 0.5f, 0.2f, 1.0f);\n"
    "}\n\0";

int main()
{
    // glfw: initialize and configure
    // ------------------------------

    //��ʼ��GLFW
    glfwInit();
    //��һ����������ѡ�����ƣ��ڶ���������ֵ
    // GLFW_CONTEXT_VERSION_MAJOR and GLFW_CONTEXT_VERSION_MINOR specify the
    // client API version that the created context must be compatible with. The
    // exact behavior of these hints depend on the requested client API.
    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);

    /*
    GLFW_OPENGL_PROFILE specifies which OpenGL profile to create the context
    for. Possible values are one of GLFW_OPENGL_CORE_PROFILE or
    GLFW_OPENGL_COMPAT_PROFILE, or GLFW_OPENGL_ANY_PROFILE to not request a
    specific profile. If requesting an OpenGL version below 3.2,
    GLFW_OPENGL_ANY_PROFILE must be used. If OpenGL ES is requested, this hint
    is ignored.
    */
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

/*
macOS: The OS only supports forward-compatible core profile contexts for OpenGL
versions 3.2 and later. Before creating an OpenGL context of version 3.2 or
later you must set the GLFW_OPENGL_FORWARD_COMPAT and GLFW_OPENGL_PROFILE hints
accordingly. OpenGL 3.0 and 3.1 contexts are not supported at all on macOS.
*/
#ifdef __APPLE__
    glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE);
#endif

    // glfw window creation
    // --------------------
    // glfwCreateWindow������Ҫ���ڵĿ�͸���Ϊ����ǰ����������������������ʾ������ڵ����ƣ����⣩
    GLFWwindow* window =
        glfwCreateWindow(SCR_WIDTH, SCR_HEIGHT, "LearnOpenGL", NULL, NULL);
    if (window == NULL) {
        std::cout << "Failed to create GLFW window" << std::endl;
        glfwTerminate();
        return -1;
    }
    glfwMakeContextCurrent(window);

    //��framebuffer_size_callback��Ҳ���Ǹı䴰�ڴ�С�ĺ������ص�������ע�������
    glfwSetFramebufferSizeCallback(window, framebuffer_size_callback);

    // glad: load all OpenGL function pointers
    // ---------------------------------------
    if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return -1;
    }

    // build and compile our shader program
    // ------------------------------------
    // vertex shader
    /*
    ��������Ҫ�����Ǵ���һ����ɫ������ע�⻹����ID�����õġ��������Ǵ������������ɫ��
    Ϊunsigned int��Ȼ����glCreateShader���������ɫ��,
    */
    int vertexShader = glCreateShader(GL_VERTEX_SHADER);
    /*
    glShaderSource������Ҫ�������ɫ��������Ϊ��һ���������ڶ�����ָ���˴��ݵ�Դ���ַ���������
    ����ֻ��һ���������������Ƕ�����ɫ��������Դ�룬���ĸ���������������ΪNULL��
    */
    glShaderSource(vertexShader, 1, &vertexShaderSource, NULL);
    glCompileShader(vertexShader);
    // check for shader compile errors
    /*
    �������Ƕ���һ�����ͱ�������ʾ�Ƿ�ɹ����룬��������һ�����������Ϣ������еĻ�����������
    Ȼ��������glGetShaderiv����Ƿ����ɹ����������ʧ�ܣ����ǻ���glGetShaderInfoLog��ȡ������Ϣ��Ȼ���ӡ����
    */
    int  success;
    char infoLog[512];
    glGetShaderiv(vertexShader, GL_COMPILE_STATUS, &success);
    if (!success) {
        glGetShaderInfoLog(vertexShader, 512, NULL, infoLog);
        std::cout << "ERROR::SHADER::VERTEX::COMPILATION_FAILED\n"
                  << infoLog << std::endl;
    }
    // fragment shader
    int fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
    glShaderSource(fragmentShader, 1, &fragmentShaderSource, NULL);
    glCompileShader(fragmentShader);
    // check for shader compile errors
    glGetShaderiv(fragmentShader, GL_COMPILE_STATUS, &success);
    if (!success) {
        glGetShaderInfoLog(fragmentShader, 512, NULL, infoLog);
        std::cout << "ERROR::SHADER::FRAGMENT::COMPILATION_FAILED\n"
                  << infoLog << std::endl;
    }

    // link shaders
    /*
    glCreateProgram��������һ�����򣬲������´�����������ID���á�
    ����������Ҫ��֮ǰ�������ɫ�����ӵ���������ϣ�Ȼ����glLinkProgram�������ǣ�
    */
    int shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);
    // check for linking errors
    glGetProgramiv(shaderProgram, GL_LINK_STATUS, &success);
    if (!success) {
        glGetProgramInfoLog(shaderProgram, 512, NULL, infoLog);
        std::cout << "ERROR::SHADER::PROGRAM::LINKING_FAILED\n"
                  << infoLog << std::endl;
    }
    /*
    ��glUseProgram��������֮��ÿ����ɫ�����ú���Ⱦ���ö���ʹ������������Ҳ����֮ǰд����ɫ��)�ˡ�
    glUseProgram��ֱ������ while ѭ����

    ���ˣ��ڰ���ɫ���������ӵ���������Ժ󣬼ǵ�ɾ����ɫ���������ǲ�����Ҫ�����ˣ�
    */
    glDeleteShader(vertexShader);
    glDeleteShader(fragmentShader);

    // set up vertex data (and buffer(s)) and configure vertex attributes
    // ------------------------------------------------------------------
    float vertices[] = {
        0.5f,  0.5f,  0.0f,  // ���Ͻ�
        0.5f,  -0.5f, 0.0f,  // ���½�
        -0.5f, -0.5f, 0.0f,  // ���½�
        -0.5f, 0.5f,  0.0f   // ���Ͻ�
    };

    unsigned int indices[] = {
        // ע��������0��ʼ!
        0, 1, 3,  // ��һ��������
        1, 2, 3   // �ڶ���������
    };
    unsigned int VBO, VAO, EBO;
    glGenVertexArrays(1, &VAO);
    glGenBuffers(1, &EBO);
    //���ǿ���ʹ��glGenBuffers������һ������ID����һ��VBO����
    glGenBuffers(1, &VBO);
    // bind the Vertex Array Object first, then bind and set vertex buffer(s),
    // and then configure vertex attributes(s).
    glBindVertexArray(VAO);

    // 0. ���ƶ������鵽�����й�OpenGLʹ��
    // OpenGL�кܶ໺��������ͣ����㻺�����Ļ���������GL_ARRAY_BUFFER��OpenGL��������ͬʱ�󶨶������
    //��ֻҪ�����ǲ�ͬ�Ļ������͡����ǿ���ʹ��glBindBuffer�������´����Ļ���󶨵�GL_ARRAY_BUFFERĿ����
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);

    /*
    glBufferData��һ��ר���������û���������ݸ��Ƶ���ǰ�󶨻���ĺ��������ĵ�һ��������Ŀ�껺������ͣ�
    ���㻺�����ǰ�󶨵�GL_ARRAY_BUFFERĿ���ϡ��ڶ�������ָ���������ݵĴ�С(���ֽ�Ϊ��λ)��
    ��һ���򵥵�sizeof������������ݴ�С���С�����������������ϣ�����͵�ʵ�����ݡ�

    ���ĸ�����ָ��������ϣ���Կ���ι�����������ݡ�����������ʽ��

    GL_STATIC_DRAW �����ݲ���򼸺�����ı䡣
    GL_DYNAMIC_DRAW�����ݻᱻ�ı�ܶࡣ
    GL_STREAM_DRAW ������ÿ�λ���ʱ����ı䡣
    */
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices,
                 GL_STATIC_DRAW);

    /*
    glVertexAttribPointer�����Ĳ����ǳ��࣬�����һ���һ�������ǣ�

    ��һ������ָ������Ҫ���õĶ������ԡ����ǵ������ڶ�����ɫ����ʹ��
    layout(location=0)������position�������Ե�λ��ֵ(Location)�������԰Ѷ������Ե�λ��ֵ����Ϊ0��
    ��Ϊ����ϣ�������ݴ��ݵ���һ�����������У������������Ǵ���0��
    �ڶ�������ָ���������ԵĴ�С������������һ��vec3������3��ֵ��ɣ����Դ�С��3��
    ����������ָ�����ݵ����ͣ�������GL_FLOAT(GLSL��vec*�����ɸ�����ֵ��ɵ�)��
    �¸��������������Ƿ�ϣ�����ݱ���׼��(Normalize)�������������ΪGL_TRUE���������ݶ��ᱻӳ�䵽0
    �������з�����signed������-1����1֮�䡣���ǰ�������ΪGL_FALSE��
    �����������������(Stride)�������������������Ķ���������֮��ļ���������¸���λ��������3��float֮�����ǰѲ�������Ϊ3
    * sizeof(float)��Ҫע�������������֪����������ǽ������еģ���������������֮��û�п�϶������Ҳ��������Ϊ0����OpenGL�������岽���Ƕ��٣�ֻ�е���ֵ�ǽ�������ʱ�ſ��ã���һ�������и���Ķ������ԣ����Ǿͱ����С�ĵض���ÿ����������֮��ļ���������ں���ῴ����������ӣ�
    * ��ע:
    �����������˼��˵���Ǵ�������Եڶ��γ��ֵĵط�����������0λ��֮���ж����ֽڣ���
    ���һ��������������void*��������Ҫ���ǽ��������ֵ�ǿ������ת��������ʾλ�������ڻ�������ʼλ�õ�ƫ����(Offset)������λ������������Ŀ�ͷ������������0�����ǻ��ں�����ϸ�������������
    */
    // 1. ���ö�������ָ��
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float),
                          (void*)0);

    /*
    ÿ���������Դ�һ��VBO������ڴ��л���������ݣ��������Ǵ��ĸ�VBO�������п����ж��VBO��
    ��ȡ����ͨ���ڵ���glVertexAttribPointerʱ�󶨵�GL_ARRAY_BUFFER��VBO�����ġ�
    �����ڵ���glVertexAttribPointer֮ǰ�󶨵�����ǰ�����VBO���󣬶�������0���ڻ����ӵ����Ķ������ݡ�
    */
    glEnableVertexAttribArray(0);

    // note that this is allowed, the call to glVertexAttribPointer registered
    // VBO as the vertex attribute's bound vertex buffer object so afterwards we
    // can safely unbind
    glBindBuffer(GL_ARRAY_BUFFER, 0);

    // You can unbind the VAO afterwards so other VAO calls won't accidentally
    // modify this VAO, but this rarely happens. Modifying other VAOs requires a
    // call to glBindVertexArray anyways so we generally don't unbind VAOs (nor
    // VBOs) when it's not directly necessary.
    glBindVertexArray(0);

    // uncomment this call to draw in wireframe polygons.
    // glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    /*
    �߿�ģʽ(Wireframe Mode)

Ҫ�����߿�ģʽ������������Σ������ͨ��glPolygonMode(GL_FRONT_AND_BACK,
GL_LINE)��������OpenGL��λ���ͼԪ����һ��������ʾ���Ǵ��㽫��Ӧ�õ����е������ε�����ͱ��棬�ڶ������������������������ơ�֮��Ļ��Ƶ��û�һֱ���߿�ģʽ���������Σ�ֱ��������glPolygonMode(GL_FRONT_AND_BACK,
GL_FILL)�������û�Ĭ��ģʽ��
*/
    glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);

    // render loop
    // -----------
    // glfwWindowShouldClose
    // ��һֱΪtrue��ֱ��glfwSetWindowShouldClose�������ֵ�仯
    while (!glfwWindowShouldClose(window)) {
        // input
        // -----
        processInput(window);

        //���������ɫ
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        //���������ɫ������գ�����GL_COLOR_BUFFER_BIT�Ǳ�ʾ�����ɫ�Ļ���λ��
        glClear(GL_COLOR_BUFFER_BIT);

        // draw our first triangle
        glUseProgram(shaderProgram);
        glBindVertexArray(VAO);
        // seeing as we only have a single VAO there's
        // no need to bind it every time, but we'll do
        // so to keep things a bit more organized
        /*glDrawArrays��������ʹ�õ�ǰ�������ɫ����֮ǰ����Ķ����������ã���VBO�Ķ������ݣ�ͨ��VAO��Ӱ󶨣�������ͼԪ
         */
        // glDrawArrays(GL_TRIANGLES, 0, 3);
        //ʹ��glDrawElementsʱ�����ǻ�ʹ�õ�ǰ�󶨵�������������е��������л��ƣ�
        glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);

        // glfw: swap buffers and poll IO events (keys pressed/released, mouse
        // moved etc.)
        // -------------------------------------------------------------------------------
        //���������������ں󻺳��ϻ��ƺ���ֱ�ӽ�����ǰ�����У����������û���һ������һ�����ػ��ƵĹ��̲���չ�ֳ���
        //���ػ����Ǵ������£��������ҵ�
        glfwSwapBuffers(window);

        //�����û�г������¼�
        glfwPollEvents();
    }

    // glfw: terminate, clearing all previously allocated GLFW resources.
    // ------------------------------------------------------------------
    glfwTerminate();
    return 0;
}

// process all input: query GLFW whether relevant keys are pressed/released this
// frame and react accordingly
// ---------------------------------------------------------------------------------------------------------
void processInput(GLFWwindow* window)
{
    if (glfwGetKey(window, GLFW_KEY_ESCAPE) == GLFW_PRESS)
        glfwSetWindowShouldClose(window, true);
}

// glfw: whenever the window size changed (by OS or user resize) this callback
// function executes
// ---------------------------------------------------------------------------------------------
void framebuffer_size_callback(GLFWwindow* window, int width, int height)
{
    // make sure the viewport matches the new window dimensions; note that width
    // and height will be significantly larger than specified on retina
    // displays.
    //����������Ⱦ���ڵĴ�С�������ܱ�glfw�Ĵ���С�����viewportҲ���ǻ����������С���ñ�׼���豸����ϵת������
    //���ڴ�С������ϵ��
    glViewport(0, 0, width, height);
}