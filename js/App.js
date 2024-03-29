const container = document.body
const tooltip = document.querySelector('.tooltip')
const imageInfo = document.querySelector('.info')
const imgSrc = document.getElementById('info-img')
let tooltipActive = false
let imageActive = false

let taille = document.getElementById('taille').offsetHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight-taille, 0.1, 1000 );
camera.aspect = window.innerWidth/(window.innerHeight-taille);
camera.updateProjectionMatrix()

class Scene{
    constructor(image, camera) {
        this.image = image
        this.pointsArrow = []
        this.pointsInfo = []
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
        this.pointsArrow.forEach(this.addArrow.bind(this))
        this.pointsInfo.forEach(this.addInfo.bind(this))
    }
    addPointsInfo(pointsInfo){
        this.pointsInfo.push(pointsInfo)
    }
    addInfo(pointsInfo){
        let map = new THREE.TextureLoader().load( 'img/info.jpg' );
        let spritematerial = new THREE.SpriteMaterial( { map: map } );
        let sprite = new THREE.Sprite( spritematerial );
        sprite.name = pointsInfo.name
        sprite.text = pointsInfo.text
        sprite.img = pointsInfo.img
        sprite.imageOk = pointsInfo.imageOk
        sprite.position.copy(pointsInfo.position.clone().normalize().multiplyScalar(30))
        sprite.scale.multiplyScalar(1.5);
        this.scene.add( sprite );
        this.sprites.push(sprite)
        sprite.onclick =() => {
            
        }
    }
    addPointsArrow (pointsArrow){
        this.pointsArrow.push(pointsArrow)

    }
    addArrow (pointsArrow) {
        let map = new THREE.TextureLoader().load( 'img/arrow.png' );
        let spritematerial = new THREE.SpriteMaterial( { map: map } );
        let sprite = new THREE.Sprite( spritematerial );
        sprite.name = pointsArrow.name
        sprite.position.copy(pointsArrow.position.clone().normalize().multiplyScalar(30))
        sprite.scale.multiplyScalar(1.5);
        this.scene.add( sprite );
        this.sprites.push(sprite)
        sprite.onclick =() => {
            this.destroy()
            pointsArrow.scene.createScene(scene)
            pointsArrow.scene.appear()
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

let s1 = new Scene('./img/cour_Exterieure.jpg', camera)
let s2 = new Scene('./img/hallEntree.jpg', camera)
let s3 = new Scene('./img/escalier.jpg', camera)
let s4 = new Scene('./img/local11.jpg', camera)
let s5 = new Scene('./img/local12.jpg', camera)
let s6 = new Scene('./img/Cour_Interieure.jpg', camera)

s1.addPointsArrow({position: new THREE.Vector3(48.530288176522504,  0.38881285381676156, -11.366902025238447),
        name: 'Entrée',
        scene: s2
    })
s2.addPointsArrow({
    position: new THREE.Vector3(-28.558965443557415,  0.7382878215597668, 40.88628571718127),
    name: 'Sortie',
    scene: s1
})
s2.addPointsArrow({
    position: new THREE.Vector3(46.40775420579729, 0.9837127374506419,  18.263764253104647),
    name: 'Escaliers',
    scene: s3
})
s3.addPointsArrow({
    position: new THREE.Vector3(8.523716815370259,  11.290079638582014,  47.81511272248516),
    name: 'Local 12',
    scene: s5
})
s3.addPointsArrow({
    position: new THREE.Vector3(-21.935812421550636,  0.5891747997154179, 44.6638081975684),
    name: 'Hall d\' Entrée',
    scene: s2
})
s3.addPointsArrow({
    position: new THREE.Vector3( -36.87643773128256, -2.4691544956531155,  -33.311586894797664),
    name: 'Cour Extérieure',
    scene: s6
})
s4.addPointsArrow({
    position: new THREE.Vector3( 46.95289952246147,  13.105271262847912,  10.461195178639208),
    name: 'Hall d\' Entrée',
    scene: s3
})
s4.addPointsArrow({
    position: new THREE.Vector3( 46.044665405652474,  14.333466742476176, -12.400533958033517),
    name: 'Local 12',
    scene: s5
})
s5.addPointsArrow({
    position: new THREE.Vector3( 47.43448385728403,  6.592680442327475, 13.358996395022475),
    name: 'Local 11',
    scene: s4
})
s5.addPointsArrow({
    position: new THREE.Vector3( 48.42541514796382,  6.447994653406772,  -10.165911524662192),
    name: 'Hall d\' Entrée',
    scene: s3
})
s6.addPointsArrow({
    position: new THREE.Vector3( -6.295368710372657,  -0.01430178620809927,  49.3792580929616),
    name: 'Escaliers',
    scene: s3
})
s1.addPointsInfo({
    position: new THREE.Vector3(-48.30113937876441,  -0.24861723642067776,  12.145916097017125),
    name:'Théophile Guibal et Adolphe Devillez <br>' +
        'Les fondateurs de l\'école Provinciale des Mines du Hainaut ' +
        '1837',

    img : './img/statue.jpg',
    imageOk : true
})

s1.addPointsInfo({
        position: new THREE.Vector3(12.852595783557476, 16.844291436181443,  44.99341771507831),
        name: 'Localisation du local 12'
})

s1.addPointsInfo({
    position: new THREE.Vector3(-15.739162956588117,  1.8095205782549821,  47.1313924360347),
    name: 'Local Info'
})

s5.addPointsInfo({
        position: new THREE.Vector3(49.5562118875878,  -3.0472573847180895, 2.9859007145358794),
        name: 'C\'est dans ce local que les BAC1 ont la majorité de leurs cours'
}
)
s6.addPointsInfo({
    position: new THREE.Vector3(-49.33694620386791,  4.689445726455829,  4.393032089219335),
    name: 'La bibliothèque de la Faculté <br>' + 'Un endroit calme où l\'on peut travailler ou emprunter un livre'

})

s1.createScene(scene)
s1.appear()

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
    if (intersects.length > 0) {
        console.log('Sphère touchée au point : ', intersects[0].point)
    }
    intersects.forEach(function(intersect){

        if(intersect.object.type=='Sprite'){
            intersect.object.onclick()
        }
    })
}

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
            tooltip.style.top = (((-1*p.y+1)*window.innerHeight/2)) + 'px'
            tooltip.style.left = ((p.x+1)*window.innerWidth/2)+'px'
            tooltip.classList.add('is-active')
            tooltip.innerHTML = intersect.object.name
            tooltipActive = true
            foundSprite = true
            console.log(intersect.object.imageOk)

            if(intersect.object.imageOk == true){
                imgSrc.src = intersect.object.img
                imageInfo.style.top = (((-1*p.y+1)*window.innerHeight/2)+40) + 'px'
                imageInfo.style.left = (((p.x+1)*window.innerWidth/2)-150)+'px'
                imageInfo.classList.add('is-active')
                imageActive = true
            }
        }

    })
    if ((foundSprite == false && tooltipActive)){
        tooltip.classList.remove('is-active')
        if(imageActive){
            imageInfo.classList.remove('is-active')
            imageInfo.style.top = 0 + 'px'
            imageInfo.style.left = 0 + 'px'
        }
    }


}
container.addEventListener('click',onClick)
window.addEventListener('resize',onReSize)
container.addEventListener('mousemove',onMouseMove)