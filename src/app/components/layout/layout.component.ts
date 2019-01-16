import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, AfterViewChecked, OnDestroy} from '@angular/core';
import {EnLayoutType} from "../../lib/enums/Layout";

@Component({
  selector: 'sk-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild("topPart") topPartRef: ElementRef;
  @ViewChild("bottomPart") bottomPartRef: ElementRef;

  // fixed意味着固定 因此在主视图中使用fixed
  @Input() type: EnLayoutType = EnLayoutType.fixed;

  isFixed = false;
  style = {};

  constructor() {

  }

  ngOnInit() {
    this.isFixed = this.type === EnLayoutType.fixed;
    window.addEventListener('resize', this.setStyle);
  }

  ngAfterViewChecked() {
    this.setStyle();
  }

  setStyle() {
    if (this.isFixed) {
      this.style = {
        paddingTop: this.getTopHeight(),
        paddingBottom: this.getBottomHeight()
      };
    }
  }

  getTopHeight() {
    const element = this.topPartRef;
    const firstChild = element.nativeElement.firstChild;
    return (!!element && firstChild) ? (firstChild.offsetHeight + 'px') : "auto";
  }

  getBottomHeight() {
    const element = this.bottomPartRef;
    const firstChild = element.nativeElement.firstChild;
    return (!!element && firstChild) ? (firstChild.offsetHeight + 'px') : "auto";
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.setStyle);
  }
}
