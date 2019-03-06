import {Component, OnInit, AfterViewInit, ElementRef, ViewChild, OnDestroy} from '@angular/core';
import {DialogService} from "../../../lib/service/system/dialog.service";
import {LoadJs} from "../../../lib/utils/LoadJs";
import {UtilsBase} from "../../../lib/utils/UtilsBase";
import {RouterService} from 'src/app/lib/service/router/RouterService';

const client = UtilsBase.getClient();

@Component({
  selector: 'sk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("canvasCon") canvasCon: ElementRef;
  @ViewChild("video") videoRef: ElementRef;
  @ViewChild("outerBallCon") outerBallCon: ElementRef;

  THREE: any;

  threeInstance: {
    camera?: any,
    scene?: any,
    mesh?: any,
    ball?: any,
    composer?: any,
    renderer?: any
  } = {};

  // 模型
  percentComplete = 0;


  rotate: number = 0;

  front = [-15, 15];
  back = [170, 190];
  back2 = [-190, -170];

  isShowFront = false;
  isShowBack = false;

  hasDestroy = false;
  hasLoadOuter = false;

  constructor(private dialogService: DialogService,
              private routerService: RouterService) {

  }

  ngOnInit() {
    window['_this'] = this;
  }

  ngAfterViewInit(): void {

    this.loadInit().then(() => {
      this.THREE = window['THREE'];

      this.initCamera();
      this.initScene();
      this.addInnerMesh();
      this.addLight();
      this.addRenderer();
      this.addEvent();
      this.loadModel();
      this.animate();
    });
  }

  addEvent() {
    let _this = this;
    let touchData = {x0: 0, y0: 0, xt: 0, yt: 0};
    this.canvasCon.nativeElement.addEventListener('touchstart', startFunc);

    this.canvasCon.nativeElement.addEventListener('touchmove', moveFunc);

    function startFunc(e) {
      let touches = e.targetTouches;
      touchData.y0 = touchData.yt = touches[0].clientY;
      touchData.x0 = touchData.xt = touches[0].clientX;
    }

    function moveFunc(e) {
      let touches = e.targetTouches;
      touchData.yt = touches[0].clientY;
      touchData.xt = touches[0].clientX;

      if (_this.hasLoadOuter) {
        _this.rotate += (touchData.xt - touchData.x0) / 500;
      }

      touchData.x0 = touchData.xt;
      touchData.y0 = touchData.yt;
    }
  }

  async loadInit() {
    let folderPath = "/assets/threejs/";
    await LoadJs(folderPath + "build/three.min.js");
    // await LoadJs(folderPath + "js/loaders/MTLLoader.js");
    await LoadJs(folderPath + "js/loaders/OBJLoader.js");
    // await LoadJs(folderPath + "js/EffectComposer.js");
    // await LoadJs(folderPath + "js/CopyShader.js");
    // await LoadJs(folderPath + "js/ShaderPass.js");
    // await LoadJs(folderPath + "js/RenderPass.js");
    // await LoadJs(folderPath + "js/OutlinePass.js");
    // await LoadJs(folderPath + "js/FXAAShader.js");
  }

  animate() {

    if (this.hasDestroy) {
      return;
    }

    if (this.hasLoadOuter) {
      let threeInstance = this.threeInstance, r = this.rotate;
      threeInstance.mesh.rotation.y = r;
      threeInstance.renderer.render(threeInstance.scene, threeInstance.camera);

      this.checkShowMenu(r);
    }

    requestAnimationFrame(() => {
      this.animate();
    });
  }

  checkShowMenu(r) {

    let dr = (Math.round(r * 180 / Math.PI)) % 360;

    this.isShowFront = check(dr, this.front);
    this.isShowBack = check(dr, this.back) || check(dr, this.back2);

    function check(value, array) {
      return value > array[0] && value < array[1];
    }
  }

  initCamera() {
    let THREE = this.THREE;
    let camera = new THREE.PerspectiveCamera(70, client.width / client.width, 1, 1000);
    camera.position.z = 840;
    camera.position.x = 0;
    this.threeInstance.camera = camera;
  }

  initScene(): void {
    this.threeInstance.scene = new this.THREE.Scene();
  }

  addInnerMesh() {
    let THREE = this.THREE;

    // 创建球体 半径 精度份数 纬度份数
    let geometry = new THREE.SphereGeometry(130, 100, 100);

    let texture = new THREE.TextureLoader().load('/assets/textures/star/inner512.png');

    let material = new THREE.MeshBasicMaterial({
      map: texture,  // 贴图
      transparent: true // 透明
    });

    // 创建三维网格
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 500;

    // 网格添加进入场景
    this.threeInstance.scene.add(mesh);
    this.threeInstance.mesh = mesh;
  }

  addLight() {
    // light--这里使用环境光
    let THREE = this.THREE, scene = this.threeInstance.scene;

    // 环境光
    let ambient = new THREE.AmbientLight(0xa2efff);
    scene.add(ambient);

    /*点光源*/
    let directionalLight = new THREE.PointLight(0xffffff);
    directionalLight.position.set(0, 0, 1000).normalize();
    scene.add(directionalLight);
  }

  addRenderer() {
    let THREE = this.THREE;

    let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setPixelRatio(1);
    // renderer.setClearColor( 0x000000 );
    renderer.setSize(client.width, client.width);
    this.canvasCon.nativeElement.appendChild(renderer.domElement);

    this.threeInstance.renderer = renderer;
  }

  // 记载进度
  onProgress(xhr) {
    if (xhr.lengthComputable) {
      this.percentComplete = xhr.loaded / xhr.total * 100;
    }
  }

  loadModel() {
    let THREE = this.THREE;

    // let mtlLoader = new THREE.MTLLoader();
    // mtlLoader.setPath('/assets/textures/3d/');
    // mtlLoader.load('ball1.mtl', (materials) => {

    // materials.preload();
    /*****************************************************************
     * 1、collada是一种基于XML的3D模型交互方案，简单来说，就是一种3D模型可以通过collada转换成另一种3D模型，
     * 从而，各种3D模型都可以通过collada转换成web支持的3D模型。
     * 2、。dae是一个钟3D模型的格式
     * 3、加载时注意浏览器同源策略的限制
     *****************************************************************/
    let objLoader = new THREE.OBJLoader();
    // objLoader.setMaterials(materials);
    let modelObj;

    objLoader.setPath('/assets/textures/3d/');
    objLoader.load('ball-bak.obj', (mesh) => {
      // // 找到模型中需要的对象。将相机看向这个对象是为了让这个对象显示在屏幕中心
      mesh.traverse(function (child) {
        if (child instanceof THREE.SkinnedMesh) {
          modelObj = child;
        }

        if (child instanceof THREE.Mesh) {
          // 将贴图赋于材质
          // 重点，没有该句会导致PNG无法正确显示透明效果
          child.material.transparent = true;
        }
      });



      mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.86;
      mesh.position.z = 0;
      mesh.children.splice(3, 1);

      // 加入模型中
      this.threeInstance.mesh.add(mesh);
      this.hasLoadOuter = true;
    });
    // });
  }

  addVideo() {
    let THREE = this.THREE;
    let scene = new THREE.Scene();

    let renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(client.width, client.height);
    renderer.setClearColor( 0x000000 );
    this.canvasCon.nativeElement.appendChild(renderer.domElement);

    let camera = new THREE.PerspectiveCamera(70, client.width / client.height, 1, 1000);
    camera.position.z = 100;

    // let video = this.videoRef.nativeElement;
    // let texture = new THREE.VideoTexture(video);
    // texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    // texture.minFilter = THREE.LinearFilter;

    // let geometry = new THREE.SphereGeometry(122, 100, 100);
    let geometry = new THREE.PlaneGeometry(client.width, client.height);

    let texture = new THREE.TextureLoader().load('/assets/textures/timg.gif');

    let material = new THREE.MeshBasicMaterial({
      map: texture,  // 贴图
      // color: 0x00aa00,
      transparent: true // 透明
    });

    // 创建三维网格
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = -100;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.21;
    scene.add(mesh);

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }

    render();
  }

  addEffect(mesh) {
    let THREE = this.THREE;
    // 加载纹理
    let loader = new THREE.TextureLoader();
    loader.load('/assets/img/main/light.png', (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      let renderer = this.threeInstance.renderer;
      let scene = this.threeInstance.scene;
      let camera = this.threeInstance.camera;
      let composer = new THREE.EffectComposer( renderer );

      let renderPass = new THREE.RenderPass( scene, camera );
      composer.addPass( renderPass );

      let outlinePass = new THREE.OutlinePass( new THREE.Vector2( window.innerWidth, window.innerWidth ), scene, camera );
      outlinePass.patternTexture = texture;
      outlinePass.selectedObjects = [mesh];
      composer.addPass( outlinePass );

      let effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
      effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth, 1 / window.innerHeight );
      effectFXAA.renderToScreen = true;
      composer.addPass( effectFXAA );

      this.threeInstance.composer = composer;
    });
  }

  gotoPage(type) {
    switch (type) {
      case 'buy':
        this.routerService.gotoCarPrice();
        break;

      case 'reserve':
        this.routerService.gotoReserve();
        break;

      case 'view':
        this.routerService.gotoExhibition();
        break;
    }
  }

  ngOnDestroy(): void {
    this.hasDestroy = true;
    this.threeInstance = null;
  }
}


