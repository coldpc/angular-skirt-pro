import { NgModule } from '@angular/core';
import {BoxComponent} from "../../components/box/box.component";
import {ButtonComponent} from "../../components/button/button.component";
import {LayoutComponent} from "../../components/layout/layout.component";
import {ImageComponent} from "../../components/image/image.component";
import {HeaderComponent} from "../../components/header/header.component";
import {IconComponent} from "../../components/icon/icon.component";
import {DeviceAdaptiveComponent} from "../../components/device-adaptive/device-adaptive.component";
import {InputComponent} from "../../components/input/input.component";
import {ListComponent} from "../../components/list/list.component";
import {ModalComponent} from "../../components/modal/modal.component";
import {SystemModule} from "./system.module";
import {MoneyComponent} from 'src/app/components/money/money.component';

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
  ModalComponent,
  MoneyComponent
];

@NgModule({
  declarations: [...components],
  imports: [SystemModule],
  exports: [...components, SystemModule]
})
export class CommonComponentsModule { }
