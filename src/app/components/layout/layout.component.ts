import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, AfterContentChecked} from '@angular/core';
import {EnLayoutType} from "../../lib/enums/EnLayoutType";

@Component({
  selector: 'sk-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit, AfterContentChecked {

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
  }

  ngAfterViewInit() {
    this.setStyle();
  }

  ngAfterContentChecked() {
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
    return !!element ? (element.nativeElement.firstChild.offsetHeight + 'px') : "auto";
  }

  getBottomHeight() {
    const element = this.bottomPartRef;
    return !!element ? (element.nativeElement.firstChild.offsetHeight + 'px') : "auto";
  }
}
