function initShaders(gl, vsSource, fsSource) {
  //创建程序对象
  const program = gl.createProgram();
  //建立着色对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  //把顶点着色对象装进程序对象中
  gl.attachShader(program, vertexShader);
  //把片元着色对象装进程序对象中
  gl.attachShader(program, fragmentShader);
  //连接webgl上下文对象和程序对象
  gl.linkProgram(program);
  //启动程序对象
  gl.useProgram(program);
  //将程序对象挂到上下文对象上
  gl.program = program;
  return true;
}

function loadShader(gl, type, source) {
  //根据着色类型，建立着色器对象
  const shader = gl.createShader(type);
  //将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source);
  //编译着色器对象
  gl.compileShader(shader);
  //返回着色器对象
  return shader;
}

function getMousePosInWebgl(event, canvas) {
  // 获取鼠标在浏览器二维坐标的位置
  const { clientX, clientY } = event;
  // 获取 canvas 在浏览器二维中左上角的坐标位置
  const { left, top } = canvas.getBoundingClientRect();

  // 鼠标在canvas 二维坐标中的位置
  const [cssX, cssY] = [clientX - left, clientY - top];

  // webgl 坐标原点(即canvas 2d的画布中心)
  const [halfW, halfH] = [canvas.width / 2, canvas.height / 2];

  // 这里记 canvas 原点为O(x0, y0), webgl坐标原点为 B(xb, yb), 鼠标点击的点在canvas 2d中的坐标为 C(x1, y1)
  // 那么 B 与 C 的距离，通过勾股定理得到的 xl = x1- xb, yl = y1 - xb,
  // 那么 点 X(xl, yl) 就是以 webgl原点B为坐标原点的点
  const [xl, yl] = [cssX - halfW, cssY - halfH];

  // y 轴 取反
  const ylTop = -yl;

  // 分量归一化，基底差异处理
  const [x, y] = [xl / halfW, ylTop / halfH];

  return { x, y };
}

function glToCssPos({ x, y }, { width, height }) {
  const [halfWidth, halfHeight] = [width / 2, height / 2];
  return {
    x: x * halfWidth,
    y: -y * halfHeight,
  };
}

// 轴映射
function ScaleLinear(ax, ay, bx, by) {
  const delta = {
    x: bx - ax,
    y: by - ay,
  };
  const k = delta.y / delta.x;
  const b = ay - ax * k;
  return function (x) {
    return k * x + b;
  };
}

// 正弦函数
function SinFn(a, Omega, phi) {
  return function (x) {
    return a * Math.sin(Omega * x + phi);
  };
}

/* GetIndexInGrid 
  在由一维数组建立的栅格矩阵中，基于行列获取元素的索引位置 
*/

function GetIndexInGrid(w, size) {
  return function (x, y) {
    return (y * w + x) * size;
  };
}

export {
  initShaders,
  getMousePosInWebgl,
  glToCssPos,
  ScaleLinear,
  SinFn,
  GetIndexInGrid,
};
