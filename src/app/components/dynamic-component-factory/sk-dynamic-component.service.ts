import {ComponentFactoryResolver, Injectable, ViewContainerRef, Type, ComponentRef} from "@angular/core";

@Injectable()
export class SkDynamicComponentService {
    private _containerRef: ViewContainerRef;
    constructor( private componentFactoryResolver: ComponentFactoryResolver) {}

    setContainerRef(container: ViewContainerRef) {
        this._containerRef = container;
    }

    getContainerRef(): ViewContainerRef {
        return this._containerRef;
    }

  /**
   * 动态构建组件
   * @param component 组件
   */
  createComponent<T>(component: Type<T>): T {
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      let viewContainerRef = this.getContainerRef();

      // 是否需要clear
      // viewContainerRef.clear();
      const componentRef = viewContainerRef.createComponent(componentFactory);
      return componentRef.instance;
    }
}
