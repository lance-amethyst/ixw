(function(){
var MaxMovePeriod = 5000; //ms
function getCurrentTick(){return (new Date()).getTime();}
function createBubbles(h, density){
	density = density || 0.06 * (h+10);
	var intv = 1000 / density;
	var totalBubbles = MaxMovePeriod * density /1000;
	// console.log("bubbles: ", h, density, intv, totalBubbles);
	return IX.repeat(totalBubbles, function(idx){
		var t0 = Math.floor(idx * intv) +1;
		return {
			id : "bubble" + idx,
			startTick : t0,
			t0 : t0,
			period : 0
		};
	});
}
// area : [[x1,y1], [x2, y2], ....[xn,yn]]
function BubbleWorker(id, svg, area, h, density){ // density : num of bubbles per second
	var numOfSides = area.length;
	var maxX = area[0][0], minX = maxX, 
		maxY = area[0][1], minY = maxY;
	IX.iterate(area, function(p){
		maxX = Math.max(p[0], maxX);
		minX = Math.min(p[0], minX);
		maxY = Math.max(p[1], maxY);
		minY = Math.min(p[1], minY);		
	});
	var disX = maxX - minX, 
		wave = Math.max(2, Math.min(disX, maxY-minY) / 20);
	disX -= 2* wave;
	minX += wave;

	function getRandomY(yArrs){
		var r = Math.random();
		var arr  = yArrs[Math.floor(yArrs.length * r)];
		return arr[0] + arr[1] * Math.random();
	}
	function getIntersect(p1, p2, x){
		var d1 = x-p1[0], d2 = x-p2[0];
		if(d1 * d2 >0 )return false;
		var y1 = p1[1], y2 = p2[1];
		if (d1===0 && d2 === 0) return y1 + ":" + y2;
		return (d2 * y1 - d1 * y2) / (d2 - d1);
	}
	function getRandomPoint(n){
		//console.log("wr2:",id, minX, maxX, wave);
		var x = minX + disX* Math.random();
		var sections = [];
		IX.iterate(area, function(p, idx){
			var y = getIntersect(p, area[(idx+1)%numOfSides], x);
			if (y!==false) sections.push(y);
		});
		sections = sections.sort(function(a, b){
			var _a = isNaN(a)?a.split(":"):[a, a],
				_b = isNaN(b)?b.split(":"):[b, b];
			return _a[0] + _a[1] - _b[0] - _b[1];
		});
		var arr = [], i=0;
		while(i<sections.length-1){
			if (isNaN(sections[i+1])) {
				i+=2;
				continue;
			}
			if (isNaN(sections[i]) || sections[i+1] - sections[i]< 2 * wave ){
				i+=1;
				continue;
			}
			arr.push([sections[i]+wave, sections[i+1]-sections[i]-2*wave]);
			i+=2;
		}
		if (arr.length===0) 
			return n<5?getRandomPoint(n+1):null;
		return [x, getRandomY(arr)];
	}

	var status = true;
	var domEl = svg[0][0];
	var bubbles = createBubbles(h, density);
	var totalBubbles = bubbles.length;
	svg.selectAll("circle").data(bubbles).enter().append("circle")
			.attr("class", function(d){return d.id;})
			.attr("r", 1)
			.attr("cx",0)
			.attr("cy",0)
			.attr("fill", "rgb(0,153,180)")
			.attr("fill-opacity", 0);

	// var counts= {show:0};
	function getBubbleEl(bubble){return svg.select("." + bubble.id);}
	function showBubble(bubble){
		var pt = getRandomPoint(0);
		if (!pt){
			bubble.startTick += MaxMovePeriod;
			return;
		}
		// counts.show ++;
		var period = Math.min(MaxMovePeriod*0.9, (h+50) * (5+15*Math.random()));
		getBubbleEl(bubble).attr("r", 2 - 6 * Math.random() / 7)
				.attr("cx",pt[0])
				.attr("cy",pt[1])
				.attr("fill-opacity", 1);
		bubble.pt = pt;
		bubble.period = period;
		bubble.speed = h / period;
	}
	function moveBubble(bubble, t0){
		getBubbleEl(bubble).attr("cy",bubble.pt[1]-bubble.speed * t0);
	}
	function hideBubble(bubble){
		bubble.period = 0;
		bubble.startTick += MaxMovePeriod;
		getBubbleEl(bubble).attr("fill-opacity", 0);
	}

	function moveItem(bubble, idx, intv){
		var t0 = intv - bubble.startTick;
		if (t0 > MaxMovePeriod){
			bubble.startTick = bubble.t0 + intv - intv % MaxMovePeriod;
			return hideBubble(bubble);
		}
		var period = bubble.period;
		if (period===0){
			if (t0>=0)
				showBubble(bubble);
			return;
		}
		if (t0 < period) moveBubble(bubble, t0);
		else hideBubble(bubble);
	}
	// function checkCounts(ts){
	// 	if (ts % 1000 > 16) return;
	// 	if (id.substring(2)%10==1) console.log("worker", id, counts);
	// 	counts.show = 0;
	// }
	var _tick0 = getCurrentTick();
	return {
		animate: function(ts){
			//checkCounts(ts);
			if (!status) return true;
			if (!$XD.ancestor(domEl, "body")) return false;
			var intv = ts-_tick0;
			for (var i=0; i<totalBubbles; i++)
				moveItem(bubbles[i], i, intv);
			return true;
		},
		start : function(){status = true;},
		stop : function(){status = false;}
	};
}

function BubbleFactory(){
	var workerHT = new IX.IListManager();
	var bubbleIdHT = new IX.I1ToNManager();
	var bubbleHT = new IX.IListManager();

	function animate() {
		if (workerHT.isEmpty()) return;
		requestAnimationFrame(animate);
		//setTimeout(animate, 1000);
		var ts = getCurrentTick();
		workerHT.iterate(function(worker, id){
			if (worker.animate(ts))return;
			// console.log("removeWorker:", id);
			workerHT.unregister(id);
		});
	}
	function createWorker(id, svg, area, h, density){
		var worker = new BubbleWorker(id, svg, area, h, density);
		// console.log("createWorker:", id);
		workerHT.register(id, worker);
		if (workerHT.getSize()===1)
			animate();
	}
	function enableWorker(id, isEnabled){
		var worker = workerHT.get(id);
		if (!worker) return;
		var action = isEnabled?"start":"stop";
		// console.log("worker ", id, action); 
		worker[action]();
	}
	return {
		register : createWorker,
		//unregister : removeWorker,
		enableWorker : enableWorker
	};
}

IX.ns('IXW.LibD3');
IXW.LibD3.bubbleFactory = new BubbleFactory();
})();