<template>
  <canvas ref="canvas" class="canvas"> </canvas>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CANNON from 'cannon'

export default Vue.extend({
  mounted() {
    const width = 960
    const height = 540
    const amount = 80

    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: this.$refs.canvas as HTMLCanvasElement
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)

    // 重力空間を生成
    const world = new CANNON.World()
    world.gravity.set(0, -10, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 8
    // world.solver.tolerance = 0.1

    // シーンを作成
    const scene = new THREE.Scene()
    // scene.background = new THREE.Color(0xffffff)

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000)
    camera.position.set(amount, amount, +amount)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // 球の作成
    const boxMat = new CANNON.Material('box')
    const boxBody = new CANNON.Body({
      mass: 5,
      material: boxMat,
      position: new CANNON.Vec3(0, 50, 0),
      shape: new CANNON.Box(new CANNON.Vec3(5, 5, 5))
    })
    boxBody.angularVelocity.set(1, 1, 1) // 角速度
    boxBody.angularDamping = 0.1
    world.addBody(boxBody)

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    )
    box.castShadow = true
    scene.add(box)
    document.addEventListener("click", () => {
      boxBody.velocity.set(0, 10, 0)
    })

    // 床の作成
    const planeMat = new CANNON.Material('plane')
    const planeBody = new CANNON.Body({
      mass: 0,
      material: planeMat,
      position: new CANNON.Vec3(0, 0, 0),
      shape: new CANNON.Plane()
    })
    planeBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    )
    world.addBody(planeBody)

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0xdddddd })
    )
    plane.receiveShadow = true
    scene.add(plane)

    // 反発係数の設定
    const mat = new CANNON.ContactMaterial(planeMat, boxMat, {
      contactEquationRelaxation: 3, // 接触式の緩和性
      contactEquationStiffness: 10000000, // 接触式の剛性
      friction: 0.8, // 摩擦係数
      frictionEquationRelaxation: 3, // 摩擦式の剛性
      frictionEquationStiffness: 10000000, // 摩擦式の緩和性
      restitution: 0.8 // 反発係数
    })
    world.addContactMaterial(mat)

    const light1 = new THREE.HemisphereLight(0xffffff, 0x00008f)
    light1.position.set(-1, 1.5, 1)
    scene.add(light1)

    const light2 = new THREE.HemisphereLight(0xffffff, 0x880000, 0.5)
    light2.position.set(-1, -1.5, -1)
    scene.add(light2)

    // 初回実行
    tick()

    function tick() {
      requestAnimationFrame(tick)

      world.step(1 / 60)
      box.position.copy(
        new THREE.Vector3(
          boxBody.position.x,
          boxBody.position.y,
          boxBody.position.z
        )
      )
      box.quaternion.copy(
        new THREE.Quaternion(
          boxBody.quaternion.x,
          boxBody.quaternion.y,
          boxBody.quaternion.z,
          boxBody.quaternion.w
        )
      )
      plane.position.copy(
        new THREE.Vector3(
          planeBody.position.x,
          planeBody.position.y,
          planeBody.position.z
        )
      )
      plane.quaternion.copy(
        new THREE.Quaternion(
          planeBody.quaternion.x,
          planeBody.quaternion.y,
          planeBody.quaternion.z,
          planeBody.quaternion.w
        )
      )

      // レンダリング
      render()
    }

    function render() {
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
