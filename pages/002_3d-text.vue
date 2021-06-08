<template>
  <canvas ref="canvas" class="canvas"> </canvas>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import font from "three/examples/fonts/helvetiker_regular.typeface.json"

export default Vue.extend({
  mounted() {
    const width = 960
    const height = 540
    const amount = 500

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas as HTMLCanvasElement
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    // シーンを作成
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0xffffff)

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000)
    camera.position.set(amount, amount, +amount)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()


    // テキストジオメトリを作成
    // const loader = new THREE.FontLoader()
    // loader.load( "three/examples/fonts/helvetiker_regular.typeface.json", function ( font ) {
    const f = new THREE.Font(font)
      const geometry = new THREE.TextGeometry( 'Hello three.js!', {
        font: f,
        size: 80,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
      } );
      const material = new THREE.MeshPhongMaterial({ color: 0x97df5e });
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
    // } );

    const light1 = new THREE.HemisphereLight( 0xffffff, 0x000088 );
    light1.position.set( - 1, 1.5, 1 );
    scene.add( light1 );

    const light2 = new THREE.HemisphereLight( 0xffffff, 0x880000, 0.5 );
    light2.position.set( - 1, - 1.5, - 1 );
    scene.add( light2 );

    // 初回実行
    tick()

    function tick() {
      requestAnimationFrame(tick)

      // レンダリング
      render()
    }

    function render() {
      // if (box) {
      //   let i = 0
      //   const time = Date.now() / 2000
      //   for (let x = 0; x < amount; x++) {
      //     for (let y = 0; y < amount; y++) {
      //       for (let z = 0; z < amount; z++) {
      //         const noise = (simplex.noise4d(x / 3,y / 3,z / 3,time) + 1) /2
      //         dummy.position.set(x, y, z)
      //         // const scale = (Math.sin(time) + 1) / 2
      //         // dummy.scale.setScalar(scale)
      //         dummy.scale.setScalar(noise)
      //         dummy.updateMatrix()
      //         box.setMatrixAt(i++, dummy.matrix)
      //       }
      //     }
      //   }
      //   box.instanceMatrix.needsUpdate = true
      // }
      renderer.render(scene, camera)
    }
  }
})
</script>

<style lang="scss" scoped>
.canvas {
  margin: 0;
  padding: 0;
}
</style>
