export class GameEngine {
  // 里程数
  private mile: number = 0;

  // 速度 400km
  private speed: number = 100;

  // 位置
  private position: number = 0;

  private nowDate = 0;
  private lastDate: number;

  constructor() {

  }

  /**
   * 更细里程
   */
  updateMile() {
    this.nowDate = new Date().getTime();

    if (this.lastDate) {
      // 一秒就是2分钟
      this.mile += this.speed * (this.nowDate - this.lastDate) / 10 / 60;
      this.lastDate = this.nowDate;
    } else {
      this.lastDate = this.nowDate;
    }

    console.log(this.mile);
    return this.mile;
  }

  updateTime() {
    this.lastDate = new Date().getTime();
  }

  addSpeed(dSpeed) {
    this.speed += dSpeed;
    if (this.speed > 3000) {
      this.speed = 3000;
    } else if (this.speed < 100) {
      this.speed = 100;
    }
  }

  setPosition(position) {
    this.position = position;
  }
}
