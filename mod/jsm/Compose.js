export default class Compose {
  constructor() {
    this.parent = null; // 父对象， 合成对象可以互相嵌套
    this.children = []; // 子对象集合, 其集合元素可以是时间轨，也可以是合成对象
  }
  /**
   * @desc  添加子对象
   */
  add(obj) {
    obj.parent = this;
    this.children.push(obj);
  }
  /**
   * @desc  基于当前时间更新子对象状态的方法
   */
  update(t) {
    this.children.forEach((ele) => {
      ele.update(t);
    });
  }
}
