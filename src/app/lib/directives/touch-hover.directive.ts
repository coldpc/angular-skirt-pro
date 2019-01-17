import { Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[skHover]'
})
export class TouchHoverDirective {
  // hover的颜色值
  @Input('skHover') hoverColor: string;

  // hover的类
  private _hoverClass = 'hover';
  private _originColor: string;

  constructor(private el: ElementRef) {

  }

  @HostListener('touchstart') startHover(): void {
    this.addHover();
  }

  @HostListener('touchmove')
  @HostListener("touchend")
  @HostListener("touchcancel")
  endHover(): void {
    this.removeHover();
  }

  /**
   * 添加hover效果
   * 添加class
   * 添加背景色
   */
  private addHover(): void {
    let color = this.hoverColor;
    this.el.nativeElement.classList.add(this.getHoverClass());

    if (color) {
      let style = this.el.nativeElement.style;
      this.saveOriginColor(style.backgroundColor);
      style.backgroundColor = color;
    }
  }

  /**
   * 移除hover效果
   * 移除class
   * 还原背景色
   */
  private removeHover(): void {
    let color = this.hoverColor;
    this.el.nativeElement.classList.remove(this.getHoverClass());

    if (color) {
      this.el.nativeElement.style.backgroundColor = this.getOriginColor();
    }
  }

  /**
   * 防止hover之后，原来的背景色丢失
   * @param color 原背景色
   */
  private saveOriginColor(color: string): void {
    this._originColor = color;
  }

  private getOriginColor(): string {
    return this._originColor;
  }

  public getHoverClass(): string {
    return this._hoverClass;
  }
}
