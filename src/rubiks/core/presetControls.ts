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

    public async rotateCube(code: string) {
        const face = code[0];
        let direction = 90;
        if (code.includes('2')) direction *= 2;
        if (code.includes('-1')) direction *= -1;

        const meshList = this.cube.getFaces(face as any);
        // 如果没有找到任何方块，直接返回
        if (!meshList || meshList.length === 0) return;

        // 旋转轴在 cube 本地坐标系下为该面任意一个方块的法向量
        const axisLocal = meshList[0].element.normal.clone().normalize();

        // 将本地轴转换为 world 轴（只需要旋转分量）
        const rot = new Matrix4().extractRotation(this.cube.matrixWorld);
        const axisWorld = axisLocal.clone().applyMatrix4(rot).normalize();

        // 角度（弧度）
        const radians = direction * Math.PI / 180;

        // 先在视觉上旋转每个 mesh（绕 world 轴）
        for (let i = 0; i < meshList.length; i++) {
            const mesh = meshList[i] as SquareMesh;
            rotateAroundWorldAxis(mesh, axisWorld, radians);
            mesh.updateMatrix();
        }

        // 同步更新数据模型：在 cube 本地坐标上更新每个元素的位置和法向量
        const rotateMatLocal = new Matrix4();
        rotateMatLocal.makeRotationAxis(axisLocal, radians);

        for (let i = 0; i < meshList.length; i++) {
            const mesh = meshList[i] as SquareMesh;

            // 更新模型数据
            mesh.element.normal.applyMatrix4(rotateMatLocal);
            mesh.element.pos.applyMatrix4(rotateMatLocal);

            // 将 mesh 的位置和朝向对齐到新的模型数据
            mesh.position.set(mesh.element.pos.x, mesh.element.pos.y, mesh.element.pos.z);
            // 使贴图朝向法线方向（mesh 在 cube 层级中，lookAt 以 world 坐标为准）
            mesh.lookAt(mesh.element.pos.clone().add(mesh.element.normal));
            mesh.updateMatrix();
        }


    }
}

export default PresetControls;
