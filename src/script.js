import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color(0xffffff)

// Model
const loader = new GLTFLoader()
loader.setDRACOLoader(DRACOLoader)
loader.load(
	'models/embeddedCenterChair.glb',
	(gltf) => {
		scene.add(gltf.scene)
	},
	(xhr) => {
		console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
	},
	(error) => {
		console.log(error)
	},
)

/**
 * Sizes
 */
let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
let container = document.getElementById('voxel')
let containerWidth
let containerHeight

// if (windowWidth < 992) {
// 	containerWidth = windowWidth
// } else {
// 	containerWidth = windowWidth / 2
// }
// containerHeight = containerWidth // Square Container

containerWidth = windowWidth
containerHeight = windowHeight

container.style.width = containerWidth + 'px'
container.style.height = containerHeight + 'px'

let sizes = {
	width: containerWidth,
	height: containerHeight,
}
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	80,
	sizes.width / sizes.height,
	1,
	500,
)
camera.position.x = 8
camera.position.y = 5.8
camera.position.z = 10
scene.add(camera)

// Lights

// Ambient
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.75)
camera.add(ambientLight)

// HemisphereLight
const hemiLight = new THREE.HemisphereLight()
scene.add(hemiLight)

// DirectLight

const directLight = new THREE.DirectionalLight(0xcccccc, 4)
directLight.position.set(0.5, 0, 0.866) // ~60º
camera.add(directLight)

const spotLight = new THREE.SpotLight('red', 2)
spotLight.position.set(0.5, 5, 0.866) // ~60º
spotLight.castShadow = false
camera.add(spotLight)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = -1.2
controls.screenSpacePanning = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
	antialias: true,
	alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.physicallyCorrectLights = true
renderer.outputEncoding = THREE.sRGBEncoding
// renderer.setClearColor(0xcccccc)

window.addEventListener('resize', () => {
	// Update sizes

	windowWidth = window.innerWidth
	windowHeight = window.innerHeight

	// if (windowWidth < 992) {
	// 	containerWidth = windowWidth
	// } else {
	// 	containerWidth = windowWidth / 2
	// }

	//containerHeight = containerWidth // Square container

	containerWidth = windowWidth
	containerHeight = windowHeight

	container.style.width = containerWidth + 'px'
	container.style.height = containerHeight + 'px'

	sizes = {
		width: containerWidth,
		height: containerHeight,
	}

	// Update camera
	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	// Update renderer
	renderer.setSize(sizes.width, sizes.height)
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

	renderer.render(scene, camera)
})

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () => {
	const elapsedTime = clock.getElapsedTime()

	// Update objects
	// sphere.rotation.y = 0.5 * elapsedTime

	// Update Orbital Controls
	controls.update()

	// Render
	renderer.render(scene, camera)

	// Call tick again on the next frame
	window.requestAnimationFrame(tick)
}

tick()
