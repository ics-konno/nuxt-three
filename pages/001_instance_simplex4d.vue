<template>
  <canvas ref="canvas" class="canvas"> </canvas>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default Vue.extend({
  mounted() {
    const width = 960
    const height = 540
    const amount = 10
    const count = Math.pow(amount, 3)

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
    console.log(controls)

    const dummy = new THREE.Object3D()

    // 箱を作成
    const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({color: 0x6699FF})
    const box = new THREE.InstancedMesh(geometry, material, count)
    box.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    scene.add(box)
    const simplex = new SimplexNoise()

    // 平行光源
    // const light = new THREE.DirectionalLight(0xffffff)
    // light.intensity = 2 // 光の強さを倍に
    // light.position.set(10, 10, 10)
    // light.lookAt(0,0,0)
    // // シーンに追加
    // scene.add(light)

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
      if (box) {
        let i = 0
        const time = Date.now() / 2000
        for (let x = 0; x < amount; x++) {
          for (let y = 0; y < amount; y++) {
            for (let z = 0; z < amount; z++) {
              const noise = (simplex.noise4d(x / 3,y / 3,z / 3,time) + 1) /2
              dummy.position.set(x, y, z)
              // const scale = (Math.sin(time) + 1) / 2
              // dummy.scale.setScalar(scale)
              dummy.scale.setScalar(noise)
              dummy.updateMatrix()
              box.setMatrixAt(i++, dummy.matrix)
            }
          }
        }
        box.instanceMatrix.needsUpdate = true
      }
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
