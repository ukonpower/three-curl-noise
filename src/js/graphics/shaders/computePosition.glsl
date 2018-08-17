#define delta ( 1.0 / 60.0 )
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;
    vec4 tmpVel = texture2D( textureVelocity, uv );
    
    vec3 vel = tmpVel.xyz;

    pos += vel * delta;

    float x = pos.x * pos.x;
    float y = pos.y * pos.y;
    float z = pos.z * pos.z;

    if(x > 100.0){
        pos.x = -pos.x;
    }
    if(y > 100.0){
        pos.y = -pos.y;
    }
    if(z > 100.0){
        pos.z = -pos.z;
    }
    gl_FragColor = vec4( pos, 1.0 );
}