#include <windows.h>
#include <gl/glew.h>
#include <gl/glut.h>
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <time.h>
#include <io.h>
#include <fcntl.h>
using namespace std;


#define  GLUT_WHEEL_UP 3           //定义滚轮操作  
#define  GLUT_WHEEL_DOWN 4  
typedef struct tagPoint3D
{
	GLfloat x;
	GLfloat y;
	GLfloat z;
}Point3D;
typedef struct color
{
	GLfloat r;
	GLfloat g;
	GLfloat b;
}rgb;

const float PI = 3.141592543f;

vector<Point3D> vec_pts;
vector<rgb> vec_cols;
GLfloat eyeZ;
GLfloat centerX, centerY, centerZ;
GLfloat fWidth, fHeight;
GLfloat halfWidth, halfHeight;
GLfloat translateX, translateY;
GLfloat rotX, rotY;
GLfloat downPtX, downPtY;
bool leftBtnDown;
GLfloat tempEyeZ;
GLuint arb;
GLuint pt3DNum;

bool readFile2()
{
	string filePath = "F:\\teamwork\\notes\\C++\\opengl\\ProjectBasic\\pointcloud.txt";
	ifstream in(filePath.c_str());
	if (!in)
	{
		printf("读取文件失败!");
		return false;
	}
	char buf[80];
	float a, b, c, r, g, bb;
	float minX = 0.0f, maxX = 0.0f, minY = 0.0f, maxY = 0.0f, minZ = 0.0f, maxZ = 0.0f;
	int index = 0;
	while (!in.eof())
	{
		in.getline(buf, 80, '\n');
		sscanf_s(buf, "%f %f %f %f %f %f", &a, &b, &c, &r, &g, &bb);
		cout << r << " " << g << " " << bb<<endl;
		Point3D pt;
		pt.x = a;
		pt.y = b;
		pt.z = c;
		rgb col;
		col.r = r;
		col.g = g;
		col.b = bb;
		if (eyeZ < fabs(pt.z))
			eyeZ = fabs(pt.z);
		if (pt.x < minX)
			minX = pt.x;
		if (pt.x > maxX)
			maxX = pt.x;
		if (pt.y < minY)
			minY = pt.y;
		if (pt.y > maxY)
			maxY = pt.y;
		minZ += pt.z;
		vec_pts.push_back(pt);
		vec_cols.push_back(col);
		index = 0;
	}
	in.close();

	centerX = (maxX + minX) / 2;
	centerY = (maxY + minY) / 2;
	centerZ = minZ / vec_pts.size();

	halfWidth = fabs(maxX) > fabs(minX) ? fabs(maxX) : fabs(minX);
	halfHeight = fabs(maxY) > fabs(minY) ? fabs(maxY) : fabs(minY);

	pt3DNum = vec_pts.size();
	Point3D* pData = new Point3D[pt3DNum];
	for (int i = 0; i < pt3DNum; i++)
	{
		pData[i].x = vec_pts[i].x;
		pData[i].y = vec_pts[i].y;
		pData[i].z = vec_pts[i].z;
	}
	delete[] pData;
	pData = NULL;

	return true;
}

GLfloat position[] = { 0.0f, 0.0f, 2.0f, 1.0f };//因为是点光源，最后一个参数设置为1
void init()
{
	glClearColor(0.0f, 0.0f, 0.0f, 0.0f);

	GLfloat LightAmbient[] = { 0.3f, 0.3f, 0.3f, 1.0f };  //环境光参数
	GLfloat LightDiffuse[] = { 1.0f, 1.0f, 1.0f, 1.0f };  //漫散光参数
	GLfloat Lightspecular[] = { 1.0f, 1.0f, 1.0f, 1.0f }; // 镜面强度

	glEnable(GL_LIGHTING);
	//glEnable(GL_COLOR_MATERIAL);  //光照时显示衣服颜色

	//GLfloat position[] = { -1.0f, 0.0f, 0.0f, 1.0f };//因为是点光源，最后一个参数设置为1	glLightfv(GL_LIGHT1, GL_POSITION, position);
	glLightfv(GL_LIGHT1, GL_AMBIENT, LightAmbient);
	glLightfv(GL_LIGHT1, GL_DIFFUSE, LightDiffuse);
	glLightfv(GL_LIGHT1, GL_SPECULAR, Lightspecular);
	glEnable(GL_LIGHT1);

	GLfloat spot_direction[] = { -3.0f, -3.4f, 0.0f };
	glLightfv(GL_LIGHT2, GL_POSITION, position);
	glLightfv(GL_LIGHT2, GL_SPOT_DIRECTION, spot_direction);
	GLfloat cf[] = { 45.0f };
	glLightfv(GL_LIGHT2, GL_SPOT_CUTOFF, cf);
	glLightfv(GL_LIGHT2, GL_AMBIENT, LightAmbient);
	glLightfv(GL_LIGHT2, GL_DIFFUSE, LightDiffuse);
	glLightfv(GL_LIGHT2, GL_SPECULAR, Lightspecular);
	glEnable(GL_LIGHT2);
}

void display()
{
	glClear(GL_COLOR_BUFFER_BIT);
	glLoadIdentity();
	gluLookAt(0, 0, 6 * eyeZ, 0, 0, 0, 0, 1, 0);
	glTranslatef(translateX, translateY, 0);
	glRotatef(rotX, 1, 0, 0);
	glRotatef(rotY, 0, 1, 0);
	glTranslatef(-centerX, -centerY, -centerZ);
	glBegin(GL_POINTS);
	for (int i = 0; i < vec_pts.size(); i++)
	{
		glColor4f(vec_cols[i].r / 255.0f, vec_cols[i].g / 255.0f, vec_cols[i].b / 255.0f, 1.0f);
		glVertex3f(vec_pts[i].x, vec_pts[i].y, vec_pts[i].z);
	}
	glEnd();
	glFlush();
}

void reshape(int width, int height)
{
	fWidth = (float)width;
	fHeight = (float)height;
	glViewport(0, 0, width, height);

	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(20, (float)width / (float)height, 0, 10);

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	gluLookAt(0, 0, 6 * eyeZ, 0, 0, 0, 0, 1, 0);
}

//鼠标控制放大缩小和旋转
void mouseFunc(int mouse, int state, int x, int y)
{
	if (state == GLUT_UP && mouse == GLUT_WHEEL_UP)
	{
		eyeZ -= eyeZ / 10;
		glutPostRedisplay();
	}
	if (state == GLUT_UP && mouse == GLUT_WHEEL_DOWN)
	{
		eyeZ += eyeZ / 10;
		glutPostRedisplay();
	}
	if (state == GLUT_DOWN && mouse == GLUT_LEFT_BUTTON)
	{
		downPtX = (float)x;
		downPtY = (float)y;
		leftBtnDown = true;
		tempEyeZ = eyeZ;
	}
	if (state == GLUT_DOWN && mouse == GLUT_RIGHT_BUTTON)
	{
		downPtX = (float)x;
		downPtY = (float)y;
		leftBtnDown = false;
		tempEyeZ = eyeZ;
	}
}

//鼠标控制旋转
void mousemoveBtnDownFunc(int x, int y)
{
	if (leftBtnDown)
	{
		rotX += PI * 4 * (y - downPtY) / fHeight;
		rotY += PI * 4 * (x - downPtX) / fWidth;
	}
	else
	{
		double scale = y / downPtY;
		eyeZ = tempEyeZ * scale;
	}

	glutPostRedisplay();
}

//键盘控制上下左右移动
void specialKeyFunc(int key, int x, int y)
{
	if (key == GLUT_KEY_UP)
	{
		translateY += halfHeight / 30;
	}
	else if (key == GLUT_KEY_DOWN)
	{
		translateY -= halfHeight / 30;
	}
	else if (key == GLUT_KEY_LEFT)
	{
		translateX -= halfWidth / 30;
	}
	else if (key == GLUT_KEY_RIGHT)
	{
		translateX += halfWidth / 30;
	}
	glutPostRedisplay();
}
int light1 = 1;
int light2 = 1;
void processNormalKeys(unsigned char key, int x, int y)
{
	if (key == 49)//键盘1开关灯
	{
		if (light1 == 1)
		{
			light1 = 0;
			glDisable(GL_LIGHTING);
			printf("light1 off\n");
		}
		else
		{
			light1 = 1;
			glEnable(GL_LIGHTING);
			glEnable(GL_LIGHT1);
			printf("light1 on\n");
		}
	}
	else if (key == 50)//键盘2开关灯
	{
		if (light2 == 1)
		{
			light2 = 0;
			glDisable(GL_LIGHTING);
			printf("light2 off\n");
		}
		else
		{
			light2 = 1;
			glEnable(GL_LIGHTING);
			glEnable(GL_LIGHT2);
			printf("light2 on\n");
		}
	}
}

int main(int argc, char* argv[])
{

	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA | GLUT_SINGLE);
	glutInitWindowPosition(100, 100);
	glutInitWindowSize(800, 800);
	glutCreateWindow("Display Cloud Points");

	glutDisplayFunc(display);
	glutReshapeFunc(reshape);
	glutMouseFunc(mouseFunc);
	glutMotionFunc(mousemoveBtnDownFunc);
	glutKeyboardFunc(processNormalKeys);
	glutSpecialFunc(specialKeyFunc);

	init();

	if (!readFile2())
	{
		printf("读取点云数据失败!");
		return -1;
	}

	glutMainLoop();
	return 0;
}