export default class Track {
  constructor(target) {
    this.target = target; // 合成对象目标
    this.parent = null; // 父级对象
    this.start = 0; // 时间起点(时间轨建立的时间)
    this.timeLen = 5; // 时间轨道总时长 默认5
    this.loop = false; // 是否循环
    this.keyMap = new Map(); // 关键帧集合
    /*
      [
       [
        '对象属性1Opacity'，
        [
          [时间1， 属性值]， // 关键帧
          [时间2， 属性值], // 关键帧
        ]
       ],
       [
        '对象属性2；width'，
        [
          [时间1， 属性值]， // 关键帧
          [时间2， 属性值], // 关键帧
        ]
       ]
      ]
    */
  }
  /**
   * @desc 单个时间轨的更新函数
   */
  /*
    逻辑
    遍历关键帧集合：
    * 若本地时间小于第一个帧的时间， 目标对象的状态等于第一帧的状态
    * 若本地时间大于最后一帧的时间，目标对象的状态等于最后一帧的状态
    * 否则，计算
  */
  update(t) {
    const { keyMap, timeLen, target, loop, start } = this;
    // time就是一个时间点，也叫动画的本地时间，用于判断动画应该取哪一帧
    // 比如, start = 0; 帧集合中有三个关键帧[1s, 2s, 3s]
    // 那么 update(1), 表示执行， 0 - 1秒的补间动画
    let time = t - start;
    // 如果是循环动画，在 timeLen后，重置时间
    // 比如  1s的循环动画, 时间轨总时长为 5， 1 % 5 = 1
    // time = 1 还是表示 进行 0-1的补间动画
    if (loop) {
      time = time % timeLen;
    }
    // fms 帧数据，包含关键帧的始末时间和属性
    for (const [key, fms] of keyMap) {
      const last = fms.length - 1;
      // 如果time 小于 第一个关键帧fms[0][0]的时间
      if (time < fms[0][0]) {
        // 取第一帧
        target[key] = fms[0][1];
      } else if (time > fms[last][0]) {
        // 如果时间比第最后一帧还大，那么取最后一帧
        target[key] = fms[last][1];
      } else {
        // 在第一帧和最后一帧，则计算补间动画
        target[key] = getValBetweenFms(time, fms, last);
      }
    }
  }
}

/**
 * @desc 补间算法
 * @param time 本地时间(处于fms[0][0]与fms[last][0]之间）
 * @param fms 某个属性的关键帧集合
 * @param last 最后一个关键帧的索引位置(即 fms.length - 1)
 */
/*


*/
function getValBetweenFms(time, fms, last) {
  for (let i = 0; i < last; i++) {
    // 两个关键帧
    const fm1 = fms[i];
    const fm2 = fms[i + 1];

    if (time >= fm1[0] && time <= fm2[0]) {
      // y = kx + b 点斜式
      const delta = {
        x: fm2[0] - fm1[0],
        y: fm2[1] - fm1[1],
      };
      // 斜率， 描述直线的倾斜程度 k = (y2- y1) / (x2 - x1)
      const k = delta.y / delta.x;
      // 截距， 直线与 y轴交点的值 b = y - kx
      const b = fm1[1] - fm1[0] * k;
      return k * time + b;
    }
  }
}
