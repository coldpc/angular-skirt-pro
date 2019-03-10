import { Injectable, ComponentRef, EventEmitter, ElementRef} from "@angular/core";

@Injectable()
export class AudioService {
  private _audioRef: ElementRef;

  public hasInit = false;

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

  setInit() {
    this.hasInit = true;

    setTimeout(() => {
      this.play();
    }, 1000);
  }

  play() {
    let audio = this.audioRef.nativeElement;
    if (audio.paused ) {
      
      try {
        audio.play();  
      } catch (e) {
        console.log(e);
      }
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
