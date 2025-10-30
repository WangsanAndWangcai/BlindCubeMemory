import {Shape, ShapeGeometry, MeshBasicMaterial, Mesh, Color, Object3D, Group, Plane, PlaneGeometry, DoubleSide, TextureLoader, Vector3, CanvasTexture} from "three";
import {type CubeElement} from "./cubeData";

const textureLoader = new TextureLoader();


export const createSquare = (color: Color, element: CubeElement) => {
    console.log(1231231);
    console.log(JSON.parse(JSON.stringify(element)));
    const squareShape = new Shape();
    const x = 0, y = 0;
    // top
    squareShape.moveTo(x - 0.4, y + 0.5);
    squareShape.lineTo(x + 0.4, y + 0.5);
    squareShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.5, y + 0.5, x + 0.5, y + 0.4);

    // right
    squareShape.lineTo(x + 0.5, y - 0.4);
    squareShape.bezierCurveTo(x + 0.5, y - 0.5, x + 0.5, y - 0.5, x + 0.4, y - 0.5);

    // bottom
    squareShape.lineTo(x - 0.4, y - 0.5);
    squareShape.bezierCurveTo(x - 0.5, y - 0.5, x - 0.5, y - 0.5, x - 0.5, y - 0.4);

    // left
    squareShape.lineTo(x - 0.5, y + 0.4);
    squareShape.bezierCurveTo(x - 0.5, y + 0.5, x - 0.5, y + 0.5, x - 0.4, y + 0.5);

    const geometry = new ShapeGeometry(squareShape);
    const material = new MeshBasicMaterial({color});
    const mesh = new Mesh(geometry, material);
    mesh.scale.set(0.9, 0.9, 0.9);

    const square = new SquareMesh(element);
    square.add(mesh);

    const mat2 = new MeshBasicMaterial({
        color: "black",
        side: DoubleSide
    });

    const plane = new Mesh(geometry, mat2);
    plane.position.set(0, 0, -0.01); // 移动靠后一点，防止重叠造成闪烁
    square.add(plane);

    const posX = element.pos.x;
    const posY = element.pos.y;
    const posZ = element.pos.z;
    square.position.set(posX, posY, posZ);

    if (element.showCode) {
        // // 1. 创建 Canvas
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        
        // 2. 填充透明背景
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 3. 绘制文字
        ctx.fillStyle = 'black'; // 文字颜色
        ctx.font = '108px consolas'; // 字体大小和样式
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(element.code || '', canvas.width / 2, canvas.height / 2);
        
        // // 4. 创建纹理
        // const texture = new TextureLoader().load(canvas.toDataURL());
        
        // // 5. 创建平面并贴纹理
        // const geo2 = new PlaneGeometry(1, 1);
        // const mat3 = new MeshBasicMaterial({
        //     map: texture,
        //     transparent: true
        // });
        // const textPlane = new Mesh(geo2, mat3);
        // textPlane.position.set(0, 0, 0.01); // 略微靠前，防止 z-fighting
        // textPlane.scale.set(0.8, 0.8, 0.8);

        // square.add(textPlane);

        const canvasTexture = new CanvasTexture(canvas);
        const geo2 = new PlaneGeometry(1, 1);
        const mat3 = new MeshBasicMaterial({
            map: canvasTexture,
            transparent: true
        });
        const textPlane = new Mesh(geo2, mat3);
        textPlane.position.set(0, 0, 0.01);
        textPlane.scale.set(0.8, 0.8, 0.8);
        square.add(textPlane);

        (square as any).codeMesh = textPlane
        textPlane.visible = true;

    }


    square.lookAt(element.pos.clone().add(element.normal));
    return square;
};

export class SquareMesh extends Object3D {
    public element: CubeElement;
    public constructor(element: CubeElement) {
        super();
        this.element = element;
    }
}
