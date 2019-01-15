import {Injectable, ViewContainerRef} from "@angular/core";

@Injectable()
export class SkDynamicComponentService {
    private _containerRef: ViewContainerRef;
    constructor() {}

    setContainerRef(container: ViewContainerRef) {
        this._containerRef = container;
    }

    getContainerRef(): ViewContainerRef {
        return this._containerRef;
    }
}
