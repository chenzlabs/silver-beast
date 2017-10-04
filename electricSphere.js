// Include this first.
// <script src="https://rawgit.com/chenzlabs/aframe-import-shaderfrog/master/aframe-import-shaderfrog.js"></script>    

// This is the JSON for the shader we want to use.
// Really, we should load this from somewhere.
// See http://shaderfrog.com/app/view/{id}
var importedShaderJSON = String.raw`
{
  "id": 1701,
  "name": "Electric Sphere (Transparent)",
  "fragment": "precision highp float;\n\n#define PI 3.141592653589793238462643383279\n\nuniform float time;\nuniform float speed;\nuniform float resolution;\nuniform vec3 color;\nuniform sampler2D image;\nuniform float brightness;\n\nvarying vec2 vUv;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\n\nvec3 lig = normalize(vec3(0.9,0.35,-0.2));\n\nvoid main() {\n    \n    vec2 uvMax = ( 2.0 * asin( sin( 2.0 * PI * vUv ) ) ) / PI;\n    vec2 position = vUv * resolution;\n    \n\tvec3 nor = vec3( 0.0, 1.0, 0.0 );\n\tfloat dif = max(dot(nor,lig),0.0);\n\t\n\tvec3 pos = vec3( position.x, 0.0, position.y );\n\t\n\tfloat timeScale = time * speed;\n\t\n\t// lights\n\tvec3 brdf = vec3(0.0);\n\tfloat cc  = 0.55*texture2D( image, 1.8*0.02*pos.xz + 0.007*timeScale*vec2( 1.0, 0.0) ).x;\n\tcc += 0.25*texture2D( image, 1.8*0.04*pos.xz + 0.011*timeScale*vec2( 0.0, 1.0) ).x;\n\tcc += 0.10*texture2D( image, 1.8*0.08*pos.xz + 0.014*timeScale*vec2(-1.0,-1.0) ).x;\n\tcc = 0.6*(1.0-smoothstep( 0.0, 0.025, abs(cc-0.4))) + \n\t\t0.4*(1.0-smoothstep( 0.0, 0.150, abs(cc-0.4)));\n\n\tvec3 col = color * cc;\n    \n    gl_FragColor = vec4( color * cc * brightness, cc * brightness );\n}\n",
  "vertex": "precision highp float;\r\nprecision highp int;\r\n\r\nuniform mat4 modelMatrix;\r\nuniform mat4 modelViewMatrix;\r\nuniform mat4 projectionMatrix;\r\nuniform mat4 viewMatrix;\r\nuniform mat3 normalMatrix;\r\n\r\nattribute vec3 position;\r\nattribute vec3 normal;\r\nattribute vec2 uv;\r\nattribute vec2 uv2;\r\n\r\nvarying vec2 vUv;\r\nvarying vec3 vPosition;\r\nvarying vec3 vNormal;\r\n\r\nvoid main() {\r\n  vUv = uv;\r\n  vPosition = position;\r\n  vNormal = normal;\r\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\r\n}",
  "uniforms": {
    "time": {
      "name": "time",
      "displayName": null,
      "type": "f",
      "glslType": "float",
      "useGridHelper": false,
      "useRange": false,
      "range": null,
      "isRandom": false,
      "randomRange": null,
      "useToggle": false,
      "toggle": null,
      "description": ""
    },
    "speed": {
      "name": "speed",
      "displayName": null,
      "type": "f",
      "glslType": "float",
      "useGridHelper": false,
      "useRange": true,
      "range": {
        "min": "0",
        "max": "2"
      },
      "isRandom": false,
      "randomRange": null,
      "useToggle": false,
      "toggle": null,
      "description": ""
    },
    "resolution": {
      "name": "resolution",
      "displayName": null,
      "type": "f",
      "glslType": "float",
      "useGridHelper": false,
      "useRange": true,
      "range": {
        "min": "0",
        "max": "10"
      },
      "isRandom": false,
      "randomRange": null,
      "useToggle": false,
      "toggle": null,
      "description": ""
    },
    "color": {
      "name": "color",
      "displayName": null,
      "type": "c",
      "glslType": "vec3",
      "useGridHelper": false,
      "useRange": false,
      "range": null,
      "isRandom": false,
      "randomRange": null,
      "useToggle": false,
      "toggle": null,
      "description": ""
    },
    "image": {
      "name": "image",
      "displayName": null,
      "type": "t",
      "glslType": "sampler2D",
      "useGridHelper": false,
      "useRange": false,
      "range": null,
      "isRandom": false,
      "randomRange": null,
      "useToggle": false,
      "toggle": null,
      "description": ""
    },
    "brightness": {
      "name": "brightness",
      "displayName": null,
      "type": "f",
      "glslType": "float",
      "useGridHelper": false,
      "useRange": true,
      "range": {
        "min": "0",
        "max": "5"
      },
      "isRandom": false,
      "randomRange": null,
      "useToggle": false,
      "toggle": null,
      "description": ""
    }
  },
  "url": "http://shaderfrog.com/app/view/1701",
  "user": {
    "username": "andrewray",
    "url": "http://shaderfrog.com/app/profile/andrewray"
  }
}
`;

// Import the shader.
// Note that this one has default values in the JSON.
AFRAME.utils.importShaderFrog(
  "electricSphere", // shader name
  importedShaderJSON,     // shader JSON string
  {
    speed: 1,
    resolution: 1, //8, // 2.33580302,
    image: '#contrast-noise',
    brightness: 25 // 5
  }
);
