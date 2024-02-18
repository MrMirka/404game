import * as PIXI from 'pixi.js';

export const lineShader = PIXI.Shader.from(`

    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat3 projectionMatrix;

    varying vec2 vTextureCoord;

    void main(void) {
        gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
    }
    `,

    `precision mediump float;

    varying vec2 vTextureCoord;
    float lineWidth = 0.5;       
    float lineSpacing = 0.3;     
    vec4 color1 = vec4(0.45, 0.64, 0.28, 1.0);           
    vec4 color2 = vec4(0.36, 0.5, 0.22, 1.0);

    void main(void) {
        vec2 uv = vTextureCoord;
        float lineFreq = 1.0 / lineSpacing;

        if (mod(uv.y * lineFreq, 1.0) > lineWidth) {
            gl_FragColor = color2 * 1.3; 
        } else {
            gl_FragColor = color1 * 1.3;
        }
    }

`);