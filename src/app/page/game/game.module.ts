import { NgModule } from '@angular/core';
import { GameComponent } from './game/game.component';
import {GameRoutingModule} from "./game-routing.module";
import {CommonComponentsModule} from "../../lib/modules/common.components.module";
import {RouterService} from "../../lib/service/router/RouterService";
import {DatePickerModule} from "../../lib/modules/date.picker.module";

@NgModule({
  declarations: [GameComponent],
  imports: [
    GameRoutingModule,
    CommonComponentsModule,
    DatePickerModule
  ],
  providers: [RouterService]
})
export class GameModule { }
