//LEGNDS of BABYON
//AUTHOR and ART... well everything by: Andrew V Butt Sr. Pryme8@gmail.com
//All rights reserved. 12-19-2016


lob = function(){
	this.presets = {};
	this.materials = {Rock_A:[]};
	this._engine = null;
	this._scene = null;
	this._camera = null;
	this._canvas = null;
	
	this._init();

	return this;
};

lob.prototype._init = function(){
	this._startEngine();
};

lob.prototype._startEngine = function(){
	
	var canvas = document.createElement('canvas');
	document.getElementById('game-wrap').appendChild(canvas);	
	this._canvas = canvas;
	
	var engine = new BABYLON.Engine(canvas, true);
    this._engine = engine;

    var scene = new BABYLON.Scene(engine);
	this._scene = scene
	
    scene.clearColor = new BABYLON.Color3(0, 0, 0);
	
	BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
	this._loader = new BABYLON.AssetsManager(scene);
	
	var bHex_load = this._loader.addMeshTask("base_hex", "", "assets/models/", "hex.obj");
	this.materials['Rock_A'].push(new BABYLON.StandardMaterial("Rock_A", scene));
	this.materials['Rock_A'][0].diffuseTexture = new BABYLON.Texture("assets/textures/Rock_A.png", scene);
	this.materials['Rock_A'][0].bumpTexture = new BABYLON.Texture("assets/textures/Rock_A-Normal.png", scene);
	this.materials['Rock_A'][0].invertNormalMapY = true;
	this.materials['Rock_A'][0].specularColor = new BABYLON.Color3(0.25, 0.25, 0.3);
	this.materials['Rock_A'][0].specularPower = 32;
	this.materials['Rock_A'].push(new BABYLON.StandardMaterial("Rock_A2", scene));
	this.materials['Rock_A'][1].diffuseTexture = new BABYLON.Texture("assets/textures/Rock_A2.png", scene);
	this.materials['Rock_A'][1].bumpTexture = new BABYLON.Texture("assets/textures/Rock_A2-Normal.png", scene);
	this.materials['Rock_A'][1].invertNormalMapY = true;
	this.materials['Rock_A'][1].specularColor = new BABYLON.Color3(0.25, 0.25, 0.3);
	this.materials['Rock_A'][1].specularPower = 32;
	
	var self = this;
	bHex_load.onSuccess = function(t){
		self.presets['hex'] = t.loadedMeshes[0];
		self.presets['hex'].setEnabled(0);
		self._buildPresetHexs();
		
		var test = new lob.LEVEL(self);
		console.log(test ,test.hexs[20][0][20]);
	};

	

    var camera = new BABYLON.FreeCamera("main_cam", new BABYLON.Vector3(0, 2000, 0), scene);
	camera.speed = 50;
	camera.maxZ = 50000;
    camera.setTarget(BABYLON.Vector3.Zero());         
    camera.attachControl(canvas, false);
		 
		var lights = [new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0.5), scene),
					   new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, -0.2, -0.35), scene)]
      	
			        
         lights[0].intensity = .85;
		 lights[1].intensity = .35;
		 this.lights = lights;

		this._loader.load();

      engine.runRenderLoop(function () {
         scene.render();
      });

      window.addEventListener("resize", function () {
         engine.resize();
      });
	
	
	
};

lob.prototype._buildPresetHexs = function(){
	this.presets['Rock_A'] = [];	
	for (var i = 0; i<this.materials['Rock_A'].length; i++){			
		var nP = this.presets['hex'].clone('Rock_A'+i);
		nP.material = this.materials['Rock_A'][i];
		nP.setEnabled(0);
		this.presets['Rock_A'].push(nP);
	}
	
	console.log(this.presets['Rock_A']);
};



lob.LEVEL = function(parent){
	this.parent = parent;
	this.hexs = new lob.d3Array();
	this._createBase();
	this._buildBase();
	
	return this;
};

lob.LEVEL.prototype._createBase = function(){
	for(var x =0; x<64; x++){
		for(var z =0; z<64; z++){
			this.hexs[x][0][z] = new lob.HEX('Rock_A', this.parent);
		}
	}
};

lob.LEVEL.prototype._buildBase = function(){
	console.log('building base!');
	for(var x =0; x<64; x++){
		for(var z =0; z<64; z++){
			var hex = this.hexs[x][0][z];	
			if(!hex){continue;}		
			var type = hex._type;			
			hex = hex._instance;					
				hex.position.x = x*310;
				hex.position.z = z*360;	
				//hex.setEnabled(1);	
				if(x % 2 == 0){/*EVEN*/}else{ hex.position.z += 180}
				//if(z % 2 == 0){/*EVEN*/}else{ newHex.position.z += 20}
		}
	}
};

lob.HEX = function(type, engine){
	this._type = type;
	this._engine = engine;
	var r = Math.floor(Math.random()*(engine.presets[type].length));
	console.log(r);
	this._instance = engine.presets['Rock_A'][r].createInstance(type);
	//console.log(this._instance);

	return this;
};



lob.d3Array = function(){
	var xMax = 64;
	var yMax = 32;
	var zMax = 64;
	var a = new Array();

for (x=0;x<xMax;x++) {
 a[x]=new Array();
 for (y=0;y<yMax;y++) {
  a[x][y]=new Array();
   for (z=0;z<zMax;z++) {
 	 a[x][y][z]=0;
 		}
 	}
}
	return a;
}

