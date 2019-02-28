import {Component, OnInit, AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import {DialogService} from "../../../lib/service/system/dialog.service";
import {ApiCoreService} from "../../../lib/service/http/ApiCoreService";
import {LoadingService} from "../../../lib/service/system/loading.service";
import {RouterService} from "../../../lib/service/router/RouterService";
import {LoadJs} from "../../../lib/utils/LoadJs";
import {UtilsBase} from "../../../lib/utils/UtilsBase";

const client = UtilsBase.getClient();

@Component({
  selector: 'sk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("canvasCon") canvasCon: ElementRef;
  @ViewChild("outerBallCon") outerBallCon: ElementRef;

  THREE: any;

  innerBall: {
    scene ?: any,
    camera ?: any,
    renderer ?: any,
    mesh ?: any
  } = {};

  outerBall: {
    scene ?: any,
    camera ?: any,
    renderer ?: any,
    mesh ?: any
  } = {};


  rotate: number = -1.5;

  constructor(private dialogServeice: DialogService) {

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    LoadJs("/assets/threejs/build/three.min.js").then(() => {
      this.THREE = window['THREE'];

      this.loadInit().then(() => {
        this.initCamera();
        this.initScene();
        this.addInnerMesh();
        this.addOuterMesh();
        this.addLight();
        this.render();
        this.animate();
        this.addEvent();

      });

    }).catch();
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
      _this.rotate += (touchData.xt - touchData.x0) / 1000;
      touchData.x0 = touchData.xt;
      touchData.y0 = touchData.yt;
      console.log(_this.rotate);
    }
  }

  async loadInit() {
    let folderPath = "/assets/threejs/js/lines/";
    await LoadJs(folderPath + "LineSegmentsGeometry.js");
    await LoadJs(folderPath + "LineGeometry.js");
    await LoadJs(folderPath + "WireframeGeometry2.js");
    await LoadJs(folderPath + "LineMaterial.js");
    await LoadJs(folderPath + "Wireframe.js");
  }

  animate() {

    this.rotate += 0.001;
    requestAnimationFrame( () => {
      this.animate();
    } );

    rotate(this.innerBall, this.rotate);
    rotate(this.outerBall, this.rotate);

    function rotate(ball, r) {
      let mesh = ball.mesh;
      mesh.rotation.y = r;
      ball.renderer.render( ball.scene, ball.camera );
    }
  }

  test() {
    let THREE = this.THREE;
    let camera, scene, renderer;
    let mesh;

    init();
    animate();

    function init() {

      camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
      camera.position.z = 400;

      scene = new THREE.Scene();

      let texture = new THREE.TextureLoader().load( '/assets/textures/crate.gif' );

      let geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
      let material = new THREE.MeshBasicMaterial( { map: texture } );

      mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
      renderer.setPixelRatio( window.devicePixelRatio );
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      //

      window.addEventListener( 'resize', onWindowResize, false );

    }

    function onWindowResize() {

      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize( window.innerWidth, window.innerHeight );

    }

    function animate() {

      requestAnimationFrame( animate );

      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;

      renderer.render( scene, camera );

    }
  }

  initCamera() {
    let THREE = this.THREE;
    this.innerBall.camera = addCamera();
    this.outerBall.camera = addCamera();

    function addCamera() {
      let camera = new THREE.PerspectiveCamera( 70, client.width / client.height, 1, 1000 );
      // let camera = new THREE.OrthographicCamera(-2, 2, 1.5, -1.5, 1, 10);
      camera.position.z = 480;
      camera.position.x = 0;
      return camera;
    }
  }

  initScene(): void {
    let THREE = this.THREE;

    // 创建相机和场景
    this.innerBall.scene = new THREE.Scene();
    this.outerBall.scene = new THREE.Scene();
  }

  /**
   * 添加立方体
   */
  addOuterMesh(): void {
    let THREE = this.THREE;
    let geometry = new THREE.SphereGeometry( 96, 20, 20 );
    let texture = new THREE.TextureLoader().load( '/assets/textures/star/inner.png' );
    texture.mapping = THREE.SphericalReflectionMapping;
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;

    let material = new THREE.MeshBasicMaterial( {
      map: texture,  // 贴图
      wireframe: false,
      depthTest: true,
      transparent: true // 透明
    } );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = 0;
    mesh.position.y = 0;

    this.outerBall.scene.add(mesh);
    this.outerBall.mesh = mesh;
  }

  addInnerMesh() {
    let THREE = this.THREE;
    let geometry2 = new THREE.SphereGeometry( 80, 100, 100);
    let texture2 = new THREE.TextureLoader().load( '/assets/textures/star/outer.png' );
    // F:\learnProjects\angular-skirt-pro\src\assets\textures\earth.jpg
    // let texture2 = new THREE.TextureLoader().load( '/assets/textures/earth.jpg' );
    let material2 = new THREE.MeshBasicMaterial( {
      map: texture2,  // 贴图
      wireframe: false, // 是否渲染边框
      transparent: true // 透明
    } );
    let mesh2 = new THREE.Mesh( geometry2, material2 );
    mesh2.position.x = 0;
    mesh2.position.y = 0;

    this.innerBall.scene.add(mesh2);
    this.innerBall.mesh = mesh2;
  }

  addLight() {
    // light--这里使用环境光
    // var light = new THREE.DirectionalLight(0xffffff); /*方向性光源*/
    // light.position.set(600, 1000, 800);
    let THREE = this.THREE;
    this.innerBall.scene.add(getLight());
    this.outerBall.scene.add(getLight());


    function getLight() {
      let light = new THREE.AmbientLight(0xee0000); // 模拟漫反射光源
      light.position.set(600, 0, 0); // 使用Ambient Light时可以忽略方向和角度，只考虑光源的位置
      return light;
    }
  }

  render() {
    let THREE = this.THREE;

    function addRender(con) {
      let renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true} );
      renderer.setPixelRatio( 1 );
      renderer.setSize( client.width, client.height );
      con.nativeElement.appendChild( renderer.domElement );
      return renderer;
    }

    this.innerBall.renderer = addRender(this.canvasCon);
    this.outerBall.renderer = addRender(this.outerBallCon);

    this.innerBall.renderer.render( this.innerBall.scene, this.innerBall.camera );
    this.outerBall.renderer.render( this.outerBall.scene, this.outerBall.camera );
  }
}
