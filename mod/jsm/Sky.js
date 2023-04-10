export default class Sky{
  constructor(gl){
    this.gl=gl
    this.children=[]
  }
  add(obj){
    obj.gl=this.gl
    this.children.push(obj)
  }
  updateVertices(params){
    this.children.forEach(ele=>{
      ele.updateVertices(params)
    })
  }
  draw(){
    this.children.forEach(ele=>{
      ele.init()
      ele.draw()
    })
  }
}

/*
属性：

- gl webgl上下文对象
- children 子级， 存放的是poly对象

方法：

- add() 添加子对象
- updateVertices() 更新子对象的顶点数据
- draw() 遍历子对象绘图，每个子对象对应一个buffer 对象，所以在子对象绘图之前要先初始化。

*/