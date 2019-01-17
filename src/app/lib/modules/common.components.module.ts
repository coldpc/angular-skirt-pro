import { NgModule } from '@angular/core';
import {BoxComponent} from "../../components/box/box.component";
import {ButtonComponent} from "../../components/button/button.component";
import {LayoutComponent} from "../../components/layout/layout.component";
import {ImageComponent} from "../../components/image/image.component";
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "../../components/header/header.component";
import {IconComponent} from "../../components/icon/icon.component";
import {DeviceAdaptiveComponent} from "../../components/device-adaptive/device-adaptive.component";
import {InputComponent} from "../../components/input/input.component";
import {DialogComponent} from "../../components/dialog/dialog.component";
import {TouchHoverDirective} from "../directives/touch-hover.directive";
import {ListComponent} from "../../components/list/list.component";
import {ModalComponent} from "../../components/modal/modal.component";

const components = [
  ListComponent,
  BoxComponent,
  ButtonComponent,
  LayoutComponent,
  ImageComponent,
  HeaderComponent,
  IconComponent,
  DeviceAdaptiveComponent,
  InputComponent,
  ModalComponent
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule],
  exports: [...components]
})
export class CommonComponentsModule { }
