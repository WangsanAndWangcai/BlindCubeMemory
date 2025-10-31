import {AxesHelper, PerspectiveCamera, Scene, WebGLRenderer} from "three";
import createCamera from "./components/camera";
import createScene from "./components/scene";
import createRenderer from "./components/renderer";
import {Cube} from "./core/cube";
import Control, {MouseControl, TouchControl} from "./core/control";
import PresetControls from "./core/presetControls";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { generateScramble } from "./core/shuffle";

const setSize = (container: Element, camera: PerspectiveCamera, renderer: WebGLRenderer) => {
    // Set the camera's aspect ratio
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    // update the size of the renderer AND the canvas
    renderer.setSize(container.clientWidth, container.clientHeight);

    // set the pixel ratio (for mobile devices)
    renderer.setPixelRatio(window.devicePixelRatio);
};

class Rubiks {
    private camera: PerspectiveCamera;
    private scene: Scene;
    private cube: Cube | undefined;
    private renderer: WebGLRenderer;
    private _controls: Control[] = [];
    private presetControls: PresetControls;
    private controls: OrbitControls;
    private showCode: boolean;
    public constructor(container: Element) {
        this.camera = createCamera();
        this.scene = createScene("#eeffcc");
        this.renderer = createRenderer();
        container.appendChild(this.renderer.domElement);

        // 🎯 添加 OrbitControls 控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true; // 惯性阻尼感
        this.controls.dampingFactor = 0.3;
        this.controls.enableZoom = true;    // 启用缩放
        this.controls.enablePan = true;     // 启用平移
        // auto resize
        window.addEventListener("resize", () => {
            setSize(container, this.camera, this.renderer);
            this.render();
        });
        setSize(container, this.camera, this.renderer);
        this.setOrder(3);
        // this.presetControls.rotateCube('F')
        this.render();
        this.showCode = true;
        // this.startAnimation();
    }

    public setOrder(order: number) {
        this.scene.remove(...this.scene.children);
        if (this._controls.length > 0) {
            this._controls.forEach((control) => control.dispose());
        }

        const cube = new Cube(order);
        this.scene.add(cube);
        // const axesHelper = new AxesHelper(10); // 参数为坐标轴长度，可自行调整
        // this.scene.add(axesHelper)
        this.cube = cube;
        this.render();

        const winW = this.renderer.domElement.clientWidth;
        const winH = this.renderer.domElement.clientHeight;
        const coarseSize = cube.getCoarseCubeSize(this.camera, {w: winW, h: winH});

        const ratio = Math.max(2.2 / (winW / coarseSize), 2.2 / (winH / coarseSize));
        this.camera.position.z *= ratio/2;
        this.camera.position.x = 5;
        this.camera.position.y = 5;

        // 拖动会影响魔方，这里是魔方元素在旋转，不是世界坐标系在旋转
        // this._controls.push(
        //     new MouseControl(this.camera, this.scene, this.renderer, cube),
        //     new TouchControl(this.camera, this.scene, this.renderer, cube)
        // );
        this.presetControls = new PresetControls(this.camera, this.scene, this.renderer, cube);

        this.animate();
    }


    /**
     * 打乱
     */
    public async disorder(scramble: string[]) {
        if (!this.cube) return;
        this.cube.setCodeShow = false;
        for (const move of scramble) {
            await this.presetControls.rotateCube(move);  // 每步带动画旋转
            await new Promise(r => setTimeout(r, 100));  // 每步间隔一点时间
        }
        return scramble;
    }

    public getScramble() {
        return generateScramble();
    }

    public toggleCodeShow() {
        this.showCode = !this.showCode
        this.cube.setCodeShow = this.showCode;
    }


    /**
     * 还原
     */
    public restore() {
        if (this.cube) {
            this.cube.restore();
            this.render();
        } else {
            console.error("RESTORE_ERROR: this.cube is undefined.");
        }
    }

    private render() {
        this.renderer.render(this.scene, this.camera);
    }

    private startAnimation() {
        const animation = (time: number) => {
            time /= 1000; // convert to seconds
            if (this.cube) {
                if (time < 2) {
                    this.cube.position.z = (-1 + time / 2) * 100;
                } else {
                    this.cube.position.z = 0;
                }
                const dis = time;
                this.cube.position.y = Math.sin(dis) * 0.3;
            }
            this.controls.update();
            this.render();
            requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
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

export default Rubiks;
