
function mellomrom() {
	var h  = hull( circle(3).translate([12,12,0]),
			circle(6).translate([39,56,0]),
			circle(6).translate([56,39,0]),
			circle(10.2).translate([39,39,0]));

	var solid = linear_extrude({ height: 22 }, h);
	return solid.scale([0.8, 0.8, 1.1]);
}

function mellom_12() {
	var number_of = 12;
	var degrees = 30;
	var offset = 15;
	var eker = [];
	for (i = 0; i < number_of; i++) {
		eker.push(mellomrom().rotateZ(offset + i * degrees))

	}
	return union(eker);
}

function forsenkning() {
	var solid = torus({ ri: 25, ro: 40 });
	return solid.scale([1.0, 1.0, 0.2]).translate([0, 0, 22]);
}

function emne() {
	var solid = CSG.cylinder({
		start : [ 0, 0, 0 ],
		end : [ 0, 0, 22 ],
		radiusStart : 81,
		radiusEnd : 80,
		resolution : 48
	});
	return solid;
}

function dekket() {
	var inner = CSG.cylinder({
		start : [ 0, 0, 0 ],
		end : [ 0, 0, 17 ],
		radiusStart : 69,
		radiusEnd : 70,
		resolution : 48
	});
	var outer = CSG.cylinder({
		start : [ 0, 0, 0 ],
		end : [ 0, 0, 17 ],
		radiusStart : 85,
		radiusEnd : 84,
		resolution : 48
	});
	var solid = outer.subtract(inner);
	return solid;
}

function kakestykke() {
	var solid = emne().subtract(mellom_12()).subtract(forsenkning());
	var plane1 = CSG.Plane.fromPoints([-1, 5, 5], [-1, 0, 5], [-1, 5, 0]).rotateZ(15).flipped();    
	var plane2 = CSG.Plane.fromPoints([1, 5, 5], [1, 0, 5], [1, 5, 0]).rotateZ(-15);    
	var solid1 = solid.cutByPlane(plane1).cutByPlane(plane2);
	return solid1.rotateX(-6).expand(1,8);
}

function helkake() {
	var et_stykke = kakestykke();
	var stykkene = [];
	for (i = 0; i < 12; i++) {
		stykkene.push(et_stykke.rotateZ(i * 30))
	}
	return union(stykkene);
}

function veiven() {
	var h  = hull( circle(12).translate([14,14,0]),	circle(4).translate([0,0,0]));
	var solid = linear_extrude({ height: 22 }, h).rotateZ(-45);

//	var veiven = CSG.cylinder({
//	start : [ 40, 0, 0 ],
//	end : [ 40, 0, 22 ],
//	radiusStart : 15 + 1,
//	radiusEnd : 15,
//	resolution : 24
//	});
//	var solid = veiven;

	return solid;
}

function vekten() {
	var counterweight = CSG.cylinder({
		start : [ 0, 0, 0 ],
		end : [ 0, 0, 22 ],
		radiusStart : 75,
		radiusEnd : 65,
		resolution : 48
	});
	var cut_out = CSG.cylinder({
		start : [ -76, 0, 0 ],
		end : [ -76, 0, 22 ],
		radiusStart : 120 - 2,
		radiusEnd : 120,
		resolution : 48
	});
	var solid = counterweight.subtract(cut_out).rotateZ(175);
	return solid;
}

function senter() {
	return union( CSG.cylinder({
		start : [ 40, 0, 22 - 4 ],
		end : [ 40, 0, 22 ],
		radiusStart : 1,
		radiusEnd : 1.2,
		resolution : 24
	}),
	CSG.cylinder({
		start : [ 0, 0, 20 - 2 ],
		end : [ 0, 0, 21 ],
		radiusStart : 1,
		radiusEnd : 1.2,
		resolution : 24
	}));
}

function main() {
	var plane1 = CSG.Plane.fromPoints([5, 5, 0], [5, 0, 0], [0, 5, 0]);    
	var plane2 = CSG.Plane.fromPoints([5, 5, 20], [5, 0, 20], [0, 5, 20]).flipped();    
	var solid = union(helkake(), dekket(), veiven(), vekten()).subtract(senter());
	return solid.cutByPlane(plane1).cutByPlane(plane2);
}
