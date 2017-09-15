// drivhjul_4.jscad

function main() {
    var solid = getHjul();
    return solid;
}

function getHjul() {
    var veivhull = getDisk(30, 5).translate([35,0,0]);
    var akselhull = getDisk(30, 10);
    var veivnav = getDisk(23, 17).translate([35,0,0]);
    var hjulnav = getDisk(23, 24.5);
    var hjul = getDisk(17, 74);
    var innsiden = getDisk(20, 64);
    var rullebane = getDisk2(20, 75);
    rullebane = rullebane.subtract(innsiden);
    var mellom = getMellom();
    var flens = getFlens(6, 81);
    flens = flens.subtract(hjul);
    hjul = hjul.subtract(mellom);
    hjul = hjul.union(hjulnav);
    hjul = hjul.union(veivnav);
    hjul = hjul.union(rullebane);
    hjul = hjul.union(flens);
    hjul = hjul.subtract(akselhull);
    hjul = hjul.subtract(veivhull);
    return hjul;
}

function getFlens( h,  r) {
    var solid = CSG.cylinder({
	start : [ 0, 0, 0 ],
	end : [ 0, 0, h ],
	radiusStart : r,
	radiusEnd : r,
	resolution : 64
    });
    return solid;
}

function getDisk( h,  r) {
    return CSG.cylinder({
	start : [ 0, 0, 0 ],
	end : [ 0, 0, h ],
	radiusStart : r,
	radiusEnd : r,
	resolution : 64
    });
}

function getDisk2( h,  r) {
    return CSG.cylinder({
	start : [ 0, 0, 0 ],
	end : [ 0, 0, h ],
	radiusStart : r+1,
	radiusEnd : r-1,
	resolution : 128
    });
}

function getMellom() {
    var mellomrom = getMellomrom();
	var degrees = 30;
	var offset = 15;
	var eker = [];
	for (i = 0; i < 9; i++) {
		eker.push(mellomrom.rotateZ(offset + i * degrees))
	}
	eker.push(getMellomrom1().rotateZ(offset + 9 * degrees));
	eker.push(getMellomrom2().rotateZ(offset + 10 * degrees));
	eker.push(getMellomrom3().rotateZ(offset + 11 * degrees));
	return union(eker);
}

function getMellomrom() {
    var x = 40;
    var y = 30;
	var h  = hull(
	        circle(5).translate([16,16,0]),
			circle(6).translate([x,y,0]),
			circle(6).translate([y,x,0]));
	var solid = linear_extrude({ height: 22 }, h);
	return solid;
}

function getMellomrom1() {
    var x = 40;
    var y = 30;
	var h  = hull(
	    circle(2.5).translate([19,15,0]),
	    circle(5).translate([29,40,0]),
		circle(6).translate([x,y,0]),
		circle(6).translate([y,x,0]));
	var solid = linear_extrude({ height: 22 }, h);
	return solid;
}

function getMellomrom2() {
    var x = 40;
    var y = 30;
	var h  = hull(
	    circle(3).translate([41,29,0]),
	    circle(3).translate([29,41,0]),
		circle(6).translate([x,y,0]),
		circle(6).translate([y,x,0]));
	var solid = linear_extrude({ height: 22 }, h);
	return solid;
}

function getMellomrom3() {
    var x = 40;
    var y = 30;
	var h  = hull(
	    circle(5).translate([40,29,0]),
	    circle(2.5).translate([15,19,0]),
		circle(6).translate([x,y,0]),
		circle(6).translate([y,x,0]));
	var solid = linear_extrude({ height: 22 }, h);
	return solid;
}


