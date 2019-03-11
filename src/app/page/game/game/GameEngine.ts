export class GameEngine {
  // 里程数
  private mile: number = 0;

  // 速度 400km
  private speed: number = 0;

  // 位置
  private position: number = 0;

  private nowDate = 0;
  private lastDate = 0;

  constructor() {

  }

  updateMile() {
    // 一秒就是2分钟
    this.mile += this.speed * (this.nowDate - this.lastDate) / 1000 / 30;
  }

  addSpeed(dSpeed) {
    this.speed += dSpeed;
  }

  setPosition(position) {
    this.position = position;
  }

  updateLoad() {
  }
}
