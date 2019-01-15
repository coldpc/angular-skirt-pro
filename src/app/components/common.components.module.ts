import { NgModule } from '@angular/core';
import {BoxComponent} from "./box/box.component";
import {ButtonComponent} from "./button/button.component";
import {LayoutComponent} from "./layout/layout.component";
import {ImageComponent} from "./image/image.component";
import {CommonModule} from '@angular/common';
import {HeaderComponent} from "./header/header.component";
import {MaskComponent} from "./mask/mask.component";

const components = [
  BoxComponent,
  ButtonComponent,
  LayoutComponent,
  ImageComponent,
  HeaderComponent,
  MaskComponent
];

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components
})
export class CommonComponentsModule { }
