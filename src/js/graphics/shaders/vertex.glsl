#include <common>
uniform sampler2D texturePosition;
uniform sampler2D textureVelocity;
uniform sampler2D textureTime;
uniform float cameraConstant;
uniform float density;
varying vec4 vColor;
varying vec2 vUv;
uniform float radius;

void main() {
    vec4 posTemp = texture2D( texturePosition, uv );
    vec3 pos = posTemp.xyz;
    
    vec4 velTmp = texture2D( textureVelocity, uv );
    vec3 vel = velTmp.xyz;

    vec4 timeTmp = texture2D( textureTime, uv );
    vec3 time = timeTmp.xyz;
    // vColor = vec4(time.x / 1000.0,time.x / 1000.0,time.x / 1000.0 ,1.0);
    float c = 1.0 - time.y / time.x;
    vColor = vec4(c ,c,c + (1.0 - c),1.0);

    // ポイントのサイズを決定
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 0.02 * cameraConstant / ( - mvPosition.z );

    // uv情報の引き渡し
    vUv = uv;

    // 変換して格納
    gl_Position = projectionMatrix * mvPosition;
}