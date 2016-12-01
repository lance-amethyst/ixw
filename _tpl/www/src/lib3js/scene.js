(function(){	
var scenes = [];
$Xw.bind({"resize" : function(){
	scenes = IX.loop(scenes, [], function(acc, scene){
		if(scene.tryResize())
			acc.push(scene);
		return acc;
	});
}});

function BaseScene(container){
	var sceneWidth = container.offsetWidth, 
		sceneHeight = Math.max(container.offsetHeight,1);

	var scene = new THREE.Scene();

	var renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(new THREE.Color(0xEEEEEE));
	renderer.setSize(sceneWidth, sceneHeight);
	container.appendChild(renderer.domElement);

	var cameraPos = [0, 100, 300], cameraFocused = [0,0,0];
	var camera = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight, 0.1, 1000);
	function resetCamera(pos, focused, force){
		IX.iterate(pos && pos.length==3 ? "xyz".split("") : [], function(wh, idx){
			if (force || pos[idx]!=cameraPos[idx]){
				camera.position[wh] = pos[idx];
				cameraPos[idx] = pos[idx];
			}
		});
		if (focused && focused.length==3 && (force 
				|| focused[0] != cameraFocused[0]
				|| focused[1] != cameraFocused[1]
				|| focused[2] != cameraFocused[2])) {
			cameraFocused = focused;
			camera.lookAt(new THREE.Vector3(focused[0], focused[1], focused[2]));
		}
	}
	resetCamera(cameraPos, cameraFocused, true);
	return {
		tryResize : function(){
			if (!$XD.ancestor(container, "body"))
				return false;
			sceneWidth = container.offsetWidth, 
			sceneHeight = Math.max(container.offsetHeight,1);

			camera.aspect = sceneWidth / sceneHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(sceneWidth, sceneHeight);
			return true;
		},

		tryRender: function(){renderer.render(scene, camera);},
		moveCamera : function(pos, focused){
			resetCamera(pos, focused, false);
		},

		add : function(obj){scene.add(obj);}
	}
}
IX.ns("IXW.Lib3");
IXW.Lib3.create3DScene = function(container){
	var s = new BaseScene(container);
	scenes.push(s);
	return s;
};

})();