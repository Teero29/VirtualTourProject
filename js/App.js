const container = document.body
const tooltip = document.querySelector('.tooltipVV')
let tooltipActive = false

let taille = document.getElementById('taille').offsetHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight-taille, 0.1, 1000 );
camera.aspect = window.innerWidth/(window.innerHeight-taille);
camera.updateProjectionMatrix()

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
        let map = new THREE.TextureLoader().load( 'img/VirtualTour/info.png' );
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



//   RENDU ET PARAMETRES CONTROLES //
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, (window.innerHeight-taille))
document.body.appendChild(renderer.domElement)

let s = new Scene('img/virtualTour/cour_Exterieure.jpg', camera)
let s2 = new Scene('img/virtualTour/hallentree.jpg', camera)
s.createScene(scene)
s.appear()
s.addPoints(
    {position: new THREE.Vector3(48.530288176522504,  0.38881285381676156, -11.366902025238447),
        name: 'Entrée',
        scene: s2
    })
s2.addPoints({
    position: new THREE.Vector3(-28.558965443557415,  0.7382878215597668, 40.88628571718127),
    name: 'Sortie',
    scene: s
})
s.addTooltip({position: new THREE.Vector3(48.530288176522504,  0.38881285381676156, -11.366902025238447),
        name: 'Entrée',
        scene: s2
    }
)/*
s2.addTooltip({position: new THREE.Vector3(-28.558965443557415,  0.7382878215597668, 40.88628571718127),
        name: 'Sortie',
        scene: s
    }
)*/


container.addEventListener('mousemove',onMouseMove)

const controls = new THREE.OrbitControls(camera,renderer.domElement); //permet à la caméra de trourner sur son orbite
controls.rotateSpeed = 0.2;
controls.enableZoom = false;
controls.enablePan = false;//impossible de bouger la caméra en x,y,z
controls.update(); //doit être appelé après transfo de la caméra
camera.position.set(0,0,-1);
function animate() {
    requestAnimationFrame( animate );
    controls.update()
    renderer.render( scene, camera );
}
animate()

//   RESIZE FENETRE QUAND ELLE CHANGE //
function onReSize() {
    taille = document.getElementById('taille').offsetHeight;
    renderer.setSize(window.innerWidth, (window.innerHeight-taille))
    camera.aspect = window.innerWidth/(window.innerHeight-taille);
    camera.updateProjectionMatrix()
}
window.addEventListener('resize',onReSize)

//  MANIERE DE TROUVER COORD DE LA SPRITE //
const rayCaster = new THREE.Raycaster()
function onClick (e) {
    // On convertit la position de la souris dans le repère de la caméra
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / (window.innerHeight+taille)) * 2 + 1
    )

    rayCaster.setFromCamera(mouse, camera)
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function(intersect){
        console.log('Sphère touchée au point : ', intersects[0].point)
        if(intersect.object.type=='Sprite'){
            intersect.object.onclick()
        }
    })


}

container.addEventListener('click',onClick)

function onMouseMove(e){
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / (window.innerHeight+taille)) * 2 + 1
    )

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
