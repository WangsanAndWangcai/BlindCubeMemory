import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    BoxGeometry,
    Mesh,
    DirectionalLight,
    MeshPhongMaterial,
    AxesHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

class ThreeTest {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private renderer: WebGLRenderer;
    private cube: Mesh;
    private controls: OrbitControls;

    constructor() {
        const canvas = document.querySelector('#three-container') as HTMLCanvasElement;
        this.renderer = new WebGLRenderer({ antialias: true, canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const fov = 75;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 50;
        this.camera = new PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.z = 2;

        this.scene = new Scene();
        const axesHelper = new AxesHelper(2); // 参数为坐标轴长度，可自行调整
        this.scene.add(axesHelper)

        // 几何体 + 材质
        const geometry = new BoxGeometry(1, 1, 1);
        const material = new MeshPhongMaterial({ color: 0x44aa88 });
        this.cube = new Mesh(geometry, material);
        this.scene.add(this.cube);

        // 灯光
        const light = new DirectionalLight(0xffffff, 3);
        light.position.set(-1, 2, 4);
        this.scene.add(light);

        // 🎯 添加 OrbitControls 控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 惯性阻尼感
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;    // 启用缩放
        this.controls.enablePan = true;     // 启用平移

        // lil-gui 控制器
        const gui = new GUI();
        gui.add(this.camera, 'fov', 1, 180).onChange(() => this.camera.updateProjectionMatrix());

        this.animate();
        // window.addEventListener('resize', () => this.onWindowResize());
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private animate() {
        requestAnimationFrame(() => this.animate());

        // 可选：立方体旋转
        // this.cube.rotation.x += 0.001;
        // this.cube.rotation.y += 0.01;

        // 更新控制器（必须）
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
    }
}

export default ThreeTest;
