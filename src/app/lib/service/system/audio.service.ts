import { Injectable, ComponentRef, EventEmitter, ElementRef} from "@angular/core";

@Injectable()
export class AudioService {
  private _audioRef: ElementRef;

  set audioRef(audioRef: ElementRef) {
    this._audioRef = audioRef;
  }
  get audioRef(): ElementRef {
    return this._audioRef;
  }

  constructor() {
  }

  isPaused(): boolean {
    return this.audioRef && this.audioRef.nativeElement && this.audioRef.nativeElement.paused;
  }

  pause(): void {
    let audio = this.audioRef.nativeElement;
    if (!audio.paused ) {
      audio.pause();
    }
  }

  play() {
    let audio = this.audioRef.nativeElement;
    if (audio.paused ) {
      audio.play();
    }
  }

  toggle() {
    let audio = this.audioRef.nativeElement;
    if (audio.paused ) {
      audio.play();
    } else {
      audio.pause();
    }
  }
}
