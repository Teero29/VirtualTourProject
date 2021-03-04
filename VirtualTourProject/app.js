//https://www.youtube.com/watch?v=LbLOXsDVyaM
//https://threejs.org/

const container = document.body
const tooltip = document.querySelector('.tooltip')
let tooltipActive = false

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


class Scene{
    constructor(image, camera) {
        this.image = image
        this.points = []
        this.sprites =[]
        this.scene = null
        this.camera = camera
    }

    createScene(scene){
        this.scene = scene
        scene.background = new THREE.Color('white')
        const geometry = new THREE.SphereGeometry( 50, 32, 32 );
        const texture = new THREE.TextureLoader().load(this.image);
        texture.wrapS = THREE.RepeatWrapping
        texture.repeat.x = -1
        const material = new THREE.MeshBasicMaterial( {
            map : texture,
            side : THREE.DoubleSide
        } );
        material.transparent = true
        this.sphere = new THREE.Mesh( geometry, material );
        this.scene.add( this.sphere );
        this.points.forEach(this.addTooltip.bind(this))
    }
    addPoints (point){
        this.points.push(point)

    }
    addTooltip (point) {
        let map = new THREE.TextureLoader().load( 'arrow.png' );
        let spritematerial = new THREE.SpriteMaterial( { map: map } );
        let sprite = new THREE.Sprite( spritematerial );
        sprite.name = point.name
        sprite.position.copy(point.position.clone().normalize().multiplyScalar(30))
        sprite.scale.multiplyScalar(1.5);
        this.scene.add( sprite );
        this.sprites.push(sprite)
        sprite.onclick =() => {
            this.destroy()
            point.scene.createScene(scene)
            point.scene.appear()
        }
    }

    destroy() {
        gsap.to(this.camera,0.5, {
            zoom:3,
            onUpdate: () => {
            this.camera.updateProjectionMatrix()
        }
    })
        gsap.to(this.sphere.material,1, {
            opacity:0,
            onComplete: () => {
                this.scene.remove(this.sphere)
            }
        })
        this.sprites.forEach((sprite)=>{
            gsap.to(sprite.scale,1, {
                x:0,
                y:0,
                z:0,
                onComplete: () => {
                    this.scene.remove(sprite)
                }
            })
        })
    }

    appear(){
        this.sphere.material.opacity =0
        gsap.to(this.camera,0.5, {
            zoom:1,
            onUpdate: () => {
            this.camera.updateProjectionMatrix()
        }
        }).delay(0.5)
        gsap.to(this.sphere.material,1, {
            opacity:1
        })
        this.sprites.forEach((sprite)=>{
            sprite.scale.set(0,0,0)
            gsap.to(sprite.scale,1, {
                x:2,
                y:2,
                z:2
            })
        })
    }
}

let s = new Scene('RueHoudain.png', camera)
let s2 = new Scene('stievenar.png', camera)

s.addPoints(
    {position: new THREE.Vector3(2.599458697341633, -1.8867038932318376,  49.65128792477907),
        name: 'Entrée',
        scene: s2
})
s2.addPoints({
    position: new THREE.Vector3(1, -1,  40),
    name: 'Sortie',
    scene: s
})

s.createScene(scene)
s.appear()

//Rendus et controles
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

const controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.rotateSpeed = 0.2;
controls.enableZoom=false;
// controls.autoRotate = true;
camera.position.set(0,0,-1);
controls.update();


function animate() {

    requestAnimationFrame( animate );

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render( scene, camera );

}
animate();

function onResize () {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()
}
const rayCaster = new THREE.Raycaster()

function onClick(e){
    let mouse = new THREE.Vector2(
    ( e.clientX / window.innerWidth ) * 2 - 1,
     - ( e.clientY / window.innerHeight ) * 2 + 1)
    rayCaster.setFromCamera(mouse, camera)
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function(intersect){
        if(intersect.object.type=='Sprite'){
           intersect.object.onclick()
        }
    })
    /**
    let intersect = rayCaster.intersectObject(sphere)
    if (intersect.length>0){
        console.log(intersect[0].point)
        addTooltip(intersect[0].point)
    }**/
}

function onMouseMove(e){
    let mouse = new THREE.Vector2(
        ( e.clientX / window.innerWidth ) * 2 - 1,
        - ( e.clientY / window.innerHeight ) * 2 + 1)
    rayCaster.setFromCamera(mouse, camera)
    let foundSprite = false
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function(intersect){
        if(intersect.object.type=='Sprite'){
            let p = intersect.object.position.clone().project(camera)
            tooltip.style.top = ((-1*p.y+1)*window.innerHeight/2) + 'px'
            tooltip.style.left = ((p.x+1)*window.innerWidth/2)+'px'
            tooltip.classList.add('is-active')
            tooltip.innerHTML = intersect.object.name
            tooltipActive = true
            foundSprite = true
        }
    })
    if ((foundSprite == false && tooltipActive)){
        tooltip.classList.remove('is-active')
    }
}

window.addEventListener('resize', onResize)
container.addEventListener('click', onClick)
container.addEventListener('mousemove', onMouseMove)