let THREECAMERA = null;


// callback: launched if a face is detected or lost.
function detect_callback(faceIndex, isDetected) {
  if (isDetected) {
    console.log('INFO in detect_callback(): DETECTED');
  } else {
    console.log('INFO in detect_callback(): LOST');
  }
}


// build the 3D. called once when Jeeliz Face Filter is OK
function init_threeScene(spec) {
  const threeStuffs = JeelizThreeHelper.init(spec, detect_callback);

  // Create the BufferGeometryLoader for our hat
  const loader = new THREE.BufferGeometryLoader()

  // Load our cool hat
  loader.load(
    'models/luffys_hat.json',
    function (geometry, materials) {
      // we create our Hat material
      const mat = new THREE.MeshBasicMaterial({
        // load the texture using a TextureLoader
        map: new THREE.TextureLoader().load(“models/Texture.jpg”)
      });
      // and finally create our mesh
      const hatMesh = new THREE.Mesh(geometry, mat)

      // USE THESE METHODS TO MODIFY
      // THE SCALE, ROTATION and POSITION
      hatMesh.scale.multiplyScalar(1.2);
      hatMesh.rotation.set(0, -40, 0);
      hatMesh.position.set(0.0, 0.6, 0.0);

      hatMesh.frustumCulled = false;
      hatMesh.side = THREE.DoubleSide;

      threeStuffs.faceObject.add(hatMesh);
    }
  )

  // CREATE LIGHT
  const ambientLight = new THREE.AmbientLight(0XFFFFFF, 0.8);
  threeStuffs.scene.add(ambientLight);

  //CREATE THE CAMERA
  THREECAMERA = JeelizThreeHelper.create_camera();
}


// entry point:
function main(){
  JeelizResizer.size_canvas({
    canvasId: 'jeeFaceFilterCanvas',
    callback: function(isError, bestVideoSettings){
      init_faceFilter(bestVideoSettings);
    }
  })
}


function init_faceFilter(videoSettings){
  JEELIZFACEFILTER.init({
    followZRot: true,
    canvasId: 'jeeFaceFilterCanvas',
    NNCPath: '../../../neuralNets/', // root of NN_DEFAULT.json file
    maxFacesDetected: 1,
    callbackReady: function(errCode, spec){
      if (errCode){
        console.log('AN ERROR HAPPENS. ERR =', errCode);
        return;
      }

      console.log('INFO: JEELIZFACEFILTER IS READY');
      init_threeScene(spec);
    },

    // called at each render iteration (drawing loop):
    callbackTrack: function(detectState){
      JeelizThreeHelper.render(detectState, THREECAMERA);
    }
  }); //end JEELIZFACEFILTER.init call
}


window.addEventListener('load', main);