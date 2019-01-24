import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, AfterContentChecked, ChangeDetectorRef} from '@angular/core';
import {EnLayoutType} from "../../lib/enums/EnLayoutType";

@Component({
  selector: 'sk-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnDestroy, AfterContentChecked {

  @ViewChild("topPart") topPartRef: ElementRef;
  @ViewChild("bottomPart") bottomPartRef: ElementRef;

  // fixed意味着固定 因此在主视图中使用fixed
  @Input() type: EnLayoutType = EnLayoutType.fixed;

  isFixed = false;
  hasInit: boolean = false;

  // 顶部和底部的内边距
  paddingTop: string;
  paddingBottom: string;

  // 绑定this
  setStyleBind: () => void;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.setStyleBind = this.setStyle.bind(this);
  }

  ngAfterContentChecked(): void {
    let isFixed = this.type === EnLayoutType.fixed;
    this.isFixed = isFixed;

    if (isFixed) {
      window.addEventListener('resize', this.setStyleBind);
    }
    this.initView();
  }

  // 滑动了说明在滚动
  initView(): void {
    this.hasInit = true;
    this.setStyle();
  }

  setStyle(): void {
    if (this.isFixed) {
      let temp = this.getPaddingTop(), isChange = false;
      if (temp !== this.paddingTop) {
        this.paddingTop = temp;
        isChange = true;
      }

      temp = this.getPaddingBottom();
      if (temp !== this.paddingBottom) {
        this.paddingBottom = temp;
        isChange = true;
      }

      if (isChange) {
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  getPaddingTop(): string {
    const element = this.topPartRef;
    const firstChild = element.nativeElement.firstChild;
    return (!!element && firstChild) ? (firstChild.offsetHeight + 'px') : "0";
  }

  getPaddingBottom(): string {
    const element = this.bottomPartRef;
    const firstChild = element.nativeElement.firstChild;
    return (!!element && firstChild) ? (firstChild.offsetHeight + 'px') : "0";
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.setStyleBind);
  }
}
