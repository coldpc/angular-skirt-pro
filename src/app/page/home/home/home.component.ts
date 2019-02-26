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

  THREE: any;
  scene: any;
  camera: any;
  renderer: any;
  mesh: any;
  ball: any;
  rotate: 0;

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
        this.addCube();
        this.render();
        this.animate();
      });

    }).catch();
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
    let mesh = this.mesh;
    requestAnimationFrame( () => {
      this.animate();
    } );
    mesh.rotation.y += 0.005;
    this.renderer.render( this.scene, this.camera );
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
    let camera = this.camera = new THREE.PerspectiveCamera( 70, 1, 1, 1000 );
    camera.position.z = 200;
  }

  initScene(): void {
    let THREE = this.THREE;

    // 创建相机和场景
    this.scene = new THREE.Scene();
  }

  /**
   * 添加立方体
   */
  addCube(): void {
    let THREE = this.THREE;
    let geometry = new THREE.SphereGeometry( 1, 18, 13 );
    let material = new THREE.MeshBasicMaterial( {
      color: 0x76c1d4,
      wireframe: true,
      wireframeLinewidth: 10
    } );
    let mesh = this.mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = 0;
    mesh.position.y = 0;

    let geometry2 = new THREE.SphereGeometry( 100, 100, 100);
    let texture2 = new THREE.TextureLoader().load( '/assets/textures/map2.png' );
    // let texture2 = new THREE.TextureLoader().load( '/assets/textures/xinqiu.jpg' );
    let material2 = new THREE.MeshBasicMaterial( {
      map: texture2,  // 贴图
      color: 0xffffff,
      wireframe: false,
      transparent: true
    } );
    let mesh2 = this.ball = new THREE.Mesh( geometry2, material2 );
    mesh2.position.x = 0;
    mesh2.position.y = 0;

    mesh.add(mesh2);

    this.scene.add(mesh);
  }

  render() {
    let THREE = this.THREE;
    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true} );

    let renderer = this.renderer;
    renderer.setPixelRatio( 1 );
    renderer.setClearColor( 0x0d2444, 0 );
    renderer.setSize( client.width, client.width );

    this.canvasCon.nativeElement.appendChild( renderer.domElement );
  }
}
