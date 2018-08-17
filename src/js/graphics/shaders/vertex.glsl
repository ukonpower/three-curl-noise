#include <common>
uniform sampler2D texturePosition;
uniform float density;
varying vec4 vColor;
uniform float radius;

void main() {
    vec4 posTemp = texture2D( texturePosition, uv );
    vec3 pos = posTemp.xyz;
    vColor = vec4( 1.0, 1.0, 1.0, 1.0 );

    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
    gl_PointSize = 1.0;

    gl_Position = projectionMatrix * mvPosition;
}