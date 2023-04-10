const defAttr = () => ({
  gl: null,
  vertices: [],
  geoData: [],
  size: 2,
  attrName: "a_Position",
  count: 0,
  types: ["POINTS"],
  circleDot: false,
  u_IsPOINTS: null,
});
export default class Poly {
  constructor(attr) {
    Object.assign(this, defAttr(), attr);
    this.init();
  }
  // 初始化，创建并绑定缓冲区
  init() {
    const { attrName, size, gl, circleDot } = this;
    if (!gl) return;
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    this.updateBuffer();
    // 获取glsl属性名
    const a_Position = gl.getAttribLocation(gl.program, attrName);
    // 将缓冲区对象分配给attribute 变量
    gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0);

    // 开启多点绘制功能
    gl.enableVertexAttribArray(a_Position);

    //
    if (circleDot) {
      this.u_IsPOINTS = gl.getUniformLocation(gl.program, "u_IsPOINTS");
    }
  }
  // 更新缓冲区数据
  updateBuffer() {
    const { gl, vertices } = this;
    this.updateCount();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  }
  // 更新绘制顶点个数
  updateCount() {
    // vertices = [0.1, 0.1, 0.1,0.2], len = 4
    // len / size 则得到绘制的点数
    // 比如 分量 size = 2（二维点） ,那么 count = 2,即绘制两个点
    // size = 3(三维点), 那么 count = 1, 绘制一个点
    this.count = this.vertices.length / this.size;
  }
  // 添加顶点
  addVertices(...params) {
    this.vertices.push(...params);
    this.updateBuffer();
  }
  //  删除最后一个顶点数据
  popVertices() {
    const { vertices, size } = this;
    const len = vertices.length;
    vertices.splice(len - size, len);
    this.updateCount();
  }
  // 根据索引位置设置顶点
  setVertices(index, ...params) {
    const { vertices, size } = this;

    // 4, 2  1 * 2 = 2
    const i = index * size;
    params.forEach((param, paramInd) => {
      vertices[i + paramInd] = param;
    });
    // console.log(vertices)
  }
  // 通过 geoData更新 vertices
  updateVertices(params){
    const {geoData}=this
    const vertices=[]
    geoData.forEach(data=>{
      params.forEach(key=>{
        vertices.push(data[key])
      })
    })
    this.vertices=vertices
  }
  // 绘制
  draw(types = this.types) {
    const {gl,count,u_IsPOINTS,circleDot}=this
    for (let type of types) {
        circleDot&&gl.uniform1f(u_IsPOINTS,type==='POINTS');
        gl.drawArrays(gl[type],0,count);
    }
  }
}
