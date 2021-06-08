<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script lang="ts">
import Vue from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import font from 'three/examples/fonts/helvetiker_regular.typeface.json'
import CANNON from 'cannon'

export default Vue.extend({
  data() {
    return {
      text: '1'
    }
  },
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

    // 重力空間の作成
    const world = new CANNON.World()
    world.gravity.set(0, -10, 0)
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 8

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000)
    camera.position.set(amount, amount, +amount)
    camera.lookAt(0, 0, 0)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()

    // テキストジオメトリを作成
    // const loader = new THREE.FontLoader()
    // loader.load( "three/examples/fonts/helvetiker_regular.typeface.json", function ( font ) {
    const words = new THREE.Group()
    const f = new THREE.Font(font)
    // Array.from(this.text).forEach(letter => {
    const geometry = new THREE.TextGeometry(this.text, {
      font: f,
      size: 80,
      height: 5,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 8,
      bevelOffset: 0,
      bevelSegments: 5
    })
    const material = new THREE.MeshPhongMaterial({ color: 0x97df5e })
    const mesh = new THREE.Mesh(geometry, material)
    words.add(mesh)

    geometry.computeBoundingBox()
    geometry.computeBoundingSphere()

    const letterMat = new CANNON.Material('letter')
    const letterBody = new CANNON.Body({
      mass: 5,
      material: letterMat,
      position: new CANNON.Vec3(0, 50, 0)
    })
    const { center } = mesh.geometry.boundingSphere

    const size = mesh.geometry.boundingBox?.getSize(new THREE.Vector3())
    if (size) {
      const box = new CANNON.Box(
        new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
      )
      letterBody.addShape(box, new CANNON.Vec3(center.x, center.y, center.z))
    }

    world.addBody(letterBody)
    // })
    scene.add(words)

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
      new THREE.PlaneGeometry(1000, 1000, 1, 1),
      new THREE.MeshPhongMaterial({ color: 0xdddddd })
    )
    plane.receiveShadow = true
    scene.add(plane)

    // 反発係数の設定
    const mat = new CANNON.ContactMaterial(planeMat, letterMat, {
      contactEquationRelaxation: 3, // 接触式の緩和性
      contactEquationStiffness: 10000000, // 接触式の剛性
      friction: 0.8, // 摩擦係数
      frictionEquationRelaxation: 3, // 摩擦式の剛性
      frictionEquationStiffness: 10000000, // 摩擦式の緩和性
      restitution: 0.3 // 反発係数
    })
    world.addContactMaterial(mat)

    const light1 = new THREE.HemisphereLight(0xffffff, 0x000088)
    light1.position.set(-1, 1.5, 1)
    scene.add(light1)

    const light2 = new THREE.HemisphereLight(0xffffff, 0x880000, 0.5)
    light2.position.set(-1, -1.5, -1)
    scene.add(light2)

    // 初回実行
    tick()

    function tick() {
      world.step(1 / 60)

      words.position.copy(
        new THREE.Vector3(
          letterBody.position.x,
          letterBody.position.y,
          letterBody.position.z
        )
      )
      words.quaternion.copy(
        new THREE.Quaternion(
          letterBody.quaternion.x,
          letterBody.quaternion.y,
          letterBody.quaternion.z,
          letterBody.quaternion.w
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

      requestAnimationFrame(tick)

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
