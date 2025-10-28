/**
 * @file       presetControls.ts
 * @brief      这个ts存的是模拟人的一些操作，例如F,F',F2等，主要想实现的就是通过这个ts实现魔方的转动控制
 * @author     Jiankang.Wang
 * @created    2025-10-28
 * @modified   2025-10-28
 * @version    0.0.1
 * 
 */

import {Camera, Matrix4, PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer} from "three";
import {Cube} from "./cube";
import {rotateAroundWorldAxis} from "../util/transform";
import {SquareMesh} from "./square";
import {setFinish} from "./statusbar";
import { cubeRotateCode } from "./cubeCode";


class PresetControls {
    protected renderer: WebGLRenderer;
    protected scene: Scene;
    protected cube: Cube;
    protected camera: PerspectiveCamera;

    constructor(camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, cube: Cube) {
        this.cube = cube;
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    }

        

    cubicBezierEase(t: number) {
        const p0 = 0, p1 = 0.42, p2 = 0.58, p3 = 1;
        const u = 1 - t;
        return u ** 3 * p0 + 3 * u ** 2 * t * p1 + 3 * u * t ** 2 * p2 + t ** 3 * p3;
    }

    public async rotateCube(code: string, duration = 300) {
        const face = code[0];
        let angle = Math.PI / 2; // 90 度
        if (code.includes('2')) angle *= 2;
        if (code.includes('\'')) angle *= -1;

        const meshList = this.cube.getFaces(face as any);

        // 确定旋转轴（世界坐标）
        const axis = new Vector3();
        switch (face) {
            case 'U': axis.set(0, -1, 0); break;
            case 'D': axis.set(0, 1, 0); break;
            case 'L': axis.set(1, 0, 0); break;
            case 'R': axis.set(-1, 0, 0); break;
            case 'F': axis.set(0, 0, -1); break;
            case 'B': axis.set(0, 0, 1); break;
        }
        axis.normalize();

        return new Promise<void>((resolve) => {
            let lastProgress = 0;
            const startTime = performance.now();

            const animate = (now: number) => {
                const elapsed = now - startTime;
                const linearProgress = Math.min(elapsed / duration, 1); // 0~1
                const easedProgress = this.cubicBezierEase(linearProgress);
                const deltaProgress = easedProgress - lastProgress;
                lastProgress = easedProgress;

                // 增量旋转
                const deltaAngle = angle * deltaProgress;
                const mat = new Matrix4().makeRotationAxis(axis, deltaAngle);

                for (const m of meshList) {
                    m.applyMatrix4(mat);
                    m.updateMatrix();
                }

                this.renderer.render(this.scene, this.camera);

                if (linearProgress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    // 确保最终角度精确停靠
                    // const finalMat = new Matrix4().makeRotationAxis(axis, angle);
                    // for (const m of meshList) {
                    //     m.matrix.identity();
                    //     m.applyMatrix4(finalMat);
                    //     m.updateMatrix();
                    // }
                    meshList.forEach(v=>{
                        const changeDir = code.includes('\'');
                        const times = code.includes('2')?2:1;
                        let face = code[0];
                        if (changeDir) {
                            const changeMap = {
                                'U': 'D',
                                'L': 'R',
                                'R': 'L',
                                'D': 'U',
                                'B': 'F',
                                'F': 'B',
                            }
                            face = changeMap[face];
                        }
                        for (let idx=0; idx<times; idx++) {
                            let newCode = '';
                            for (const c of v.element.locationCode) {
                                newCode += cubeRotateCode[face][c] || c;
                            }
                            v.element.locationCode = newCode
                        }
                    })
                    this.renderer.render(this.scene, this.camera);
                    resolve();
                }
            };

            requestAnimationFrame(animate);
        });
    }

}

export default PresetControls;
