const container = document.body // Document.body permet d'accèder à tous les éléments de la page web

//   CREATION DE LA SCENE, CAMERA, RENDU  //
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

//   CREATION SCENE  //
const scene = new THREE.Scene();

//   CREATION CAMERA  //
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 200 );
camera.position.set(-1,0,0) ;//vu qu'on a inversé la texture il faut inverser la caméra pour regarder au début

//   Contrôle de la rotation de la caméra  //

const controls = new THREE.OrbitControls(camera,renderer.domElement); //permet à la caméra de trourner sur son orbite
controls.enableZoom = false;
controls.enablePan = false;//impossible de bouger la caméra en x,y,z
controls.update(); //doit être appelé après transfo de la caméra


//   CREATION DE LA SPHERE //

const geometry = new THREE.SphereGeometry( 50, 32, 32 );
const texture = new THREE.TextureLoader().load('img/virtualTour/hallentree.jpg')
texture.repeat.x = -1 //inverse la texture afin que l'image soit droite et non inversée
texture.wrapS = THREE.RepeatWrapping // à utiliser avec la ligne du haut
const material = new THREE.MeshBasicMaterial({
    map : texture,
    side : THREE.DoubleSide
})
const sphere = new THREE.Mesh( geometry, material );
scene.add( sphere );
renderer.render( scene, camera );

//   ROTATION SPHERE  //
function animate() {
    requestAnimationFrame( animate );
    controls.update()
    renderer.render( scene, camera );
}
animate()

//   RESIZE FENETRE QUAND ELLE CHANGE //
function onReSize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth/window.innerHeight
    camera.updateProjectionMatrix()

}
window.addEventListener('resize',onReSize)

//  AJOUT D'IMAGES INFO //
function addTooltip (position,name){
    let spriteMap = new THREE.TextureLoader().load('img/virtualTour/info.png')
    let spriteMaterial = new THREE.SpriteMaterial( { map:spriteMap } )
    let sprite = new THREE.Sprite(spriteMaterial) //sprite regarde toujours la caméra

    sprite.name = name
    sprite.position.copy(position.clone().normalize().multiplyScalar(20))
    scene.add(sprite)
}
addTooltip(new THREE.Vector3(49.75463396722639 ,-4.8919163713478016 ,-0.05117854755698681),'Entrée')

//  MANIERE DE TROUVER COORD DE LA SPRITE //
const rayCaster = new THREE.Raycaster()
function onClick (e) {
    // On convertit la position de la souris dans le repère de la caméra
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    )
    rayCaster.setFromCamera(mouse, camera)
    let intersects = rayCaster.intersectObject(sphere)
    if (intersects.length > 0) {
        console.log('Sphère touchée au point : ', intersects[0].point)
    }
}

container.addEventListener('click',onClick)

function onMouseMove(e){
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    )
}
container.addEventListener('mousemove',onMouseMove)