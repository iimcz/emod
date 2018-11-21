import {Component, ElementRef, InjectionToken, Input, OnDestroy, OnInit, ValueProvider, ViewChild} from '@angular/core';

declare const THREE: any;

import {DigitalItem} from '../../interface/digital-item';
import {NakiService} from '../../naki.service';
import {Utils} from '../../naki.utils';
@Component({
  selector: 'app-motion-view',
  templateUrl: './motion-view.component.html',
  styleUrls: ['./motion-view.component.css']
})
export class MotionViewComponent implements OnInit, OnDestroy {
  @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement> | undefined;
  @Input() dis: DigitalItem[] = [];
  private size_: number[] | undefined;
  private renderer: any; // THREE.WebGLRenderer;
  private clock: any = new THREE.Clock(); // THREE.Clock
  private scene: any = new THREE.Scene(); // THREE.Scene
  private grid: any = new THREE.GridHelper(200, 10); // THREE.GridHelper
  private camera: any; // THREE.PerspectiveCamera
  private controls: any; // THREE.OrbitControls
  private anim_id: any;
  private loader: any = new THREE.BVHLoader(); // THREE.BVHLoader
  private skeletonHelper: any; // THREE.SkeletonHelper
  private boneContainer: any = new THREE.Group(); // THREE.Group
  private mixer: any; // THREE.AnimationMixer
  private animation_clip: any;
  private animation_action: any;
  private start_position: any; // THREE.Vector3
  constructor(public nakiService: NakiService) {
  }

  get size() {
    return this.size_;
  }

  @Input() set size(size0: number[] | undefined) {
    this.size_ = size0;
    console.log('size', size0);
    this.update_size();
  }

  ngOnInit() {
    console.log(THREE);
    // console.log(T2);
    // console.log(T3);
    console.log(this.loader);
    if (this.canvasElement === undefined) {
      console.error('No canvas element');
      return;
    }
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasElement.nativeElement,
      alpha: true,
      antialias: true
    });
    this.scene.add(this.grid);
    this.renderer.setClearColor(0xeeeeee);

    this.camera = new THREE.PerspectiveCamera(60, this.canvasElement.nativeElement.width / this.canvasElement.nativeElement.height, 1, 1000);
    this.camera.position.set(0, 200, 400);
    this.controls = new THREE.OrbitControls(this.camera, this.canvasElement.nativeElement);
    this.controls.minDistance = 30;
    this.controls.maxDistance = 700;
    this.update_size();
    this.animate();
    console.log(this.camera);
    const uri = Utils.get_data_uri(this.dis[0]);
    if (uri) {
      this.loader.load(this.nakiService.get_resource_url(uri), (result: any) => {
        console.log(result);
        this.start_position = result.skeleton.bones[0].position;
        // result.skeleton.bones[0].position.x = 0;
        // result.skeleton.bones[0].position.y = 0;
        // result.skeleton.bones[0].position.z = 0;
        this.skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
        this.skeletonHelper.skeleton = result.skeleton;
        this.boneContainer.add(result.skeleton.bones[0]);
        this.boneContainer.translateX(-this.start_position.x);
        this.boneContainer.translateY(-this.start_position.y);
        this.boneContainer.translateZ(-this.start_position.z);
        this.scene.add(this.skeletonHelper);
        this.scene.add(this.boneContainer);
        this.mixer = new THREE.AnimationMixer(this.skeletonHelper);
        this.animation_clip = result.clip;
        this.animation_action = this.mixer.clipAction(this.animation_clip).setEffectiveWeight(1.0).play();
        this.animation_action.paused = false;
        console.log(this.boneContainer);
      });
    }
  }

  public ngOnDestroy(): void {
    if (this.renderer) {
      this.renderer.forceContextLoss();
    }
  }

  public animate(): void {
    this.anim_id = requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
    }
    this.renderer.render(this.scene, this.camera);
  }

  public onResize(event: any): void {
    console.log(event);
  }

  private update_size(): void {
    if (this.canvasElement === undefined || this.size === undefined || this.size.length < 2) {
      return;
    }
    this.canvasElement.nativeElement.width = this.size[0];
    this.canvasElement.nativeElement.height = this.size[1];
    if (this.renderer) {
      this.renderer.setSize(this.canvasElement.nativeElement.width, this.canvasElement.nativeElement.height);
      this.camera.aspect = this.canvasElement.nativeElement.width / this.canvasElement.nativeElement.height;
      this.camera.updateProjectionMatrix();
    }
  }
}


