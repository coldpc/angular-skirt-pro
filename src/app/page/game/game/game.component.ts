import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {GameEngine} from "./GameEngine";
import {UtilsBase} from "../../../lib/utils/UtilsBase";

@Component({
  selector: 'sk-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("roadsRef") roadsRef: ElementRef;
  roadHeight: number = 0;

  isShowStart = true;

  isMove = false;

  isTurnLeft = true;
  isTurnRight = true;

  roadsPosition = {
    y1: 0,
    y2: 0,
    y3: 0
  };

  lastDistance = 0;
  carPosition = 1;

  client = UtilsBase.getClient();

  gameEngine: GameEngine = new GameEngine();

  onFrameFunc: any;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.roadHeight = this.roadsRef.nativeElement.children[0].offsetHeight;
  }

  startGame() {
    this.onFrameFunc = this.onFrame.bind(this);
    this.onFrameFunc();
  }

  onFrame() {
    this.countRoadMile(this.gameEngine.updateMile());

    this.gameEngine.addSpeed((this.isMove ? 5 : -5));

    if (this.isTurnRight) {
      this.gameEngine.setPosition(1);
    }

    if (this.isTurnLeft) {
      this.gameEngine.setPosition(-1);
    }

    requestAnimationFrame(this.onFrameFunc);
  }

  countRoadMile(totalDistance) {
    let changeDistance = totalDistance - this.lastDistance;
    this.lastDistance = totalDistance;

    let roadsPosition = this.roadsPosition;
    let roadHeight = this.roadHeight;
    let parentNode = this.roadsRef.nativeElement;

    if (totalDistance === 0) {
      roadsPosition.y1 = -roadHeight;
      roadsPosition.y2 = 0;
      roadsPosition.y3 = roadHeight;
    } else {
      changeDistance = changeDistance % this.roadHeight;
      roadsPosition.y1 += changeDistance;
      roadsPosition.y2 += changeDistance;
      roadsPosition.y3 += changeDistance;
    }

    let min = Math.min(roadsPosition.y1, roadsPosition.y2, roadsPosition.y3);
    let max = Math.max(roadsPosition.y1, roadsPosition.y2, roadsPosition.y3);

    if (max > this.client.height) {
      roadsPosition[findByPosition(max)] = min - this.roadHeight;
    }



    setPosition(0, roadsPosition.y1);
    setPosition(1, roadsPosition.y2);
    setPosition(2, roadsPosition.y3);

    function setPosition(index, top) {
      parentNode.children[index].style.top = top + 'px';
    }

    function findByPosition(po) {
      if (po === roadsPosition.y1) {
        return 'y1';
      }

      if (po === roadsPosition.y2) {
        return 'y2';
      }

      if (po === roadsPosition.y3) {
        return 'y3';
      }
    }
  }

  ngOnDestroy(): void {
  }

  onMove() {
    this.isMove = true;
  }

  onMoveEnd() {
    this.isMove = false;
  }

  onTurnLeftEnd() {
    this.isTurnLeft = false;
  }

  onTurnLeft() {
    this.carPosition -= 1;
    if (this.carPosition < 0) {
      this.carPosition = 0;
    }
  }

  onTurnRightEnd() {
    this.isTurnRight = false;
  }

  onTurnRight() {
    this.carPosition += 1;
    if (this.carPosition > 2) {
      this.carPosition = 2;
    }
  }

  stop(e) {
    e.preventDefault();
  }
}


