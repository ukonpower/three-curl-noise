import BaceScene from './BaceScene.js';
import * as THREE from 'three'
import frag from '../shaders/fragment.glsl';
import vert from '../shaders/vertex.glsl';
import comShaderPosition from '../shaders/computePosition.glsl';
import comShaderVelocity from '../shaders/computeVelocity.glsl';
import GPUComputationRenderer from '../utils/libs/GPUComputationRenderer'

window.THREE = THREE;

export default class MainScene extends BaceScene {

    constructor(renderer) {
        super();

        this.frag = true;
        this.renderer = renderer;
        this.time = 0;

        this.particleGeometry;
        this.particleMaterial;
        this.particleUniforms;

        this.computeTextureWidth = 500;
        this.numParticle = this.computeTextureWidth * this.computeTextureWidth;
        
        this.computeRenderer;
        this.positions;
        this.velocitys;

        this.positionUniforms;

        this.init();
    }

    init() {
        this.camera.position.set(0, 10, 10)
        this.camera.lookAt(0,0,0);  
        this.initComputeRenderer();
        this.initParticles();
    }

    initComputeRenderer(){
        this.computeRenderer = new GPUComputationRenderer(this.computeTextureWidth,this.computeTextureWidth,this.renderer);
        
        var initPositionTex = this.computeRenderer.createTexture();
        var initVelocityTex = this.computeRenderer.createTexture();

        //初期化用のテクスチャ
        this.initPosition(initPositionTex);
        this.initVelocity(initVelocityTex);

        //computeRendererにシェーダーを追加。インプットテクスチャを取得。
        this.positions = this.computeRenderer.addVariable("texturePosition",comShaderPosition,initPositionTex);
        this.velocitys = this.computeRenderer.addVariable("textureVelocity",comShaderVelocity,initVelocityTex);

        this.computeRenderer.setVariableDependencies( this.positions, [ this.positions, this.velocitys ] );
        this.positionUniforms = this.positions.material.uniforms;
        this.positionUniforms.mouse = { mouse: {type:"v2"}, value : new THREE.Vector2(0,0) }

        this.computeRenderer.setVariableDependencies( this.velocitys, [ this.positions, this.velocitys ] );  
        this.velocityUniforms = this.velocitys.material.uniforms;
        this.velocityUniforms.mouse = { mouse: {type:"v2"}, value : new THREE.Vector2(0,0) }

        this.computeRenderer.init();
    }
    
    initPosition(tex){
        var texArray = tex.image.data;
        
        for(var i = 0; i < texArray.length; i +=4){
            texArray[i + 0] = Math.random() * 20 - 10;
            texArray[i + 1] = Math.random() * 20 - 10;
            texArray[i + 2] = Math.random() * 20 - 10;
            texArray[i + 3] = 0.0;
        }
        
    }

    initVelocity(tex){
        var texArray = tex.image.data;
        for(var i = 0; i < texArray.length; i +=4){
            texArray[i + 0] = 0;
            texArray[i + 1] = 0;
            texArray[i + 2] = 0;
            texArray[i + 3] = 0;
        }
    }

    initParticles(){
        this.particleGeometry = new THREE.BufferGeometry();

        //ジオメトリ初期化用の配列
        var pArray = new Float32Array(this.numParticle * 3);
        for(var i = 0; i < pArray.length; i++){
            pArray[i] = 0;
        }
        

        //テクスチャ参照用のuvを取得
        var uv = new Float32Array(this.numParticle * 2);
        var p = 0;
        for(var i = 0;i < this.computeTextureWidth; i ++){
            for(var j = 0;j < this.computeTextureWidth; j ++){
                uv[p++] = i / ( this.computeTextureWidth - 1);
                uv[p++] = j / ( this.computeTextureWidth - 1);
            }
        }
        this.particleGeometry.addAttribute('position', new THREE.BufferAttribute( pArray, 3 ) );
        this.particleGeometry.addAttribute('uv', new THREE.BufferAttribute( uv, 2 ) );

        //コンピュートシェーダーから受け取ったテクスチャを受け取るuniformを設定
        this.particleUniforms = {
            texturePosition : {value: null},
            textureVelocity : {value: null},
            cameraConstant: { value: this.getCameraConstant( this.camera ) }
        }

        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: this.particleUniforms,
            vertexShader: vert,
            fragmentShader: frag
        });
        this.particleMaterial.extensions.drawBuffers = true;

        var particle = new THREE.Points(this.particleGeometry,this.particleMaterial);
        particle.matrixAutoUpdate = false;
        particle.updateMatrix();

        this.scene.add(particle);
    }
    
    getCameraConstant( camera ) {
        return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom );
    }

    Update(){
        this.computeRenderer.compute();
        this.particleUniforms.texturePosition.value = this.computeRenderer.getCurrentRenderTarget(this.positions).texture;
        this.particleUniforms.textureVelocity.value = this.computeRenderer.getCurrentRenderTarget(this.velocitys).texture;
    }

    onTouchStart(cursor){
        this.isTouch = true;
        var halfWidth = innerWidth / 2;
        var halfHeight = innerHeight / 2;
        var pos = new THREE.Vector2((cursor.x - halfWidth) / halfWidth,(cursor.y - halfHeight) / halfHeight);

        this.velocityUniforms.mouse = { value: pos };
        this.positionUniforms.mouse = { value: pos };
    }

    onTouchMove(cursor){
        if(!this.isTouch) return;
        var halfWidth = innerWidth / 2;
        var halfHeight = innerHeight / 2;
        var pos = new THREE.Vector2((cursor.x - halfWidth) / halfWidth,(cursor.y - halfHeight) / halfHeight);
        
        this.velocityUniforms.mouse = { value: pos };
        this.positionUniforms.mouse = { value: pos };
    }

    onTouchEnd(cursor){
        this.isTouch = false;
        var pos = new THREE.Vector2(0,0);
        
        this.velocityUniforms.mouse = { value: pos };
        this.positionUniforms.mouse = { value: pos };
    }

}