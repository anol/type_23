function getParameterDefinitions() {
    return [ {
	name : 'quality',
	caption : 'Kvalitet',
	type : 'choice',
	values : [ "draft", "normal", "high" ],
	captions : [ "Kladd", "Normal", "Fin" ],
	initial : 0
    }, {
	name : 'style',
	caption : 'Stil',
	type : 'choice',
	values : [ 0, 1 ],
	captions : [ "Cylinder", "Prismatisk", ],
	initial : 0
    }, {
	name : 'slip_offset',
	caption : 'slip_offset:',
	type : 'float',
	initial : 2
    }, {
	name : 'floor_height',
	caption : 'floor_height:',
	type : 'float',
	initial : 0
    }, {
	name : 'number_of_spokes',
	caption : 'number_of_spokes:',
	type : 'float',
	initial : 12
    }, {
	name : 'spoke_vertical_offset',
	caption : 'spoke_vertical_offset:',
	type : 'float',
	initial : 13
    }, {
	name : 'spoke_vertical_scale',
	caption : 'spoke_vertical_scale:',
	type : 'float',
	initial : 1.5
    }, {
	name : 'spoke_inner_length',
	caption : 'spoke_inner_length:',
	type : 'float',
	initial : 15
    }, {
	name : 'spoke_outer_length',
	caption : 'spoke_outer_length:',
	type : 'float',
	initial : 75
    }, {
	name : 'spoke_inner_height',
	caption : 'spoke_inner_height:',
	type : 'float',
	initial : 19
    }, {
	name : 'spoke_outer_height',
	caption : 'spoke_outer_height:',
	type : 'float',
	initial : 13
    }, {
	name : 'spoke_inner_width',
	caption : 'spoke_inner_width:',
	type : 'float',
	initial : 5
    }, {
	name : 'upper_width',
	caption : 'upper_width:',
	type : 'float',
	initial : 3
    }, {
	name : 'spoke_outer_width',
	caption : 'spoke_outer_width:',
	type : 'float',
	initial : 4
    }, {
	name : 'outer_upper_width',
	caption : 'outer_upper_width:',
	type : 'float',
	initial : 2
    }, {
	name : 'nav_height',
	caption : 'nav_height:',
	type : 'float',
	initial : 22
    }, {
	name : 'nav_radius',
	caption : 'nav_radius:',
	type : 'float',
	initial : 24
    }, {
	name : 'rim_height',
	caption : 'rim_height:',
	type : 'float',
	initial : 17
    }, {
	name : 'inner_rim_radius',
	caption : 'inner_rim_radius:',
	type : 'float',
	initial : 70
    }, {
	name : 'outer_rim_radius',
	caption : 'outer_rim_radius:',
	type : 'float',
	initial : 90
    }, {
	name : 'counterweight_angle',
	caption : 'counterweight_angle:',
	type : 'float',
	initial : 175
    }, {
	name : 'counterweight_radius',
	caption : 'counterweight_radius:',
	type : 'float',
	initial : 120
    }, {
	name : 'counterweight_offset',
	caption : 'counterweight_offset:',
	type : 'float',
	initial : -76
    }, {
	name : 'consentric_radius',
	caption : 'consentric_radius:',
	type : 'float',
	initial : 17
    }, {
	name : 'concentric_offset',
	caption : 'concentric_offset:',
	type : 'float',
	initial : 35
    }, {
	name : 'expands',
	caption : 'expands:',
	type : 'float',
	initial : 0.2
    }, {
	name : 'contract',
	caption : 'contract:',
	type : 'float',
	initial : 1
    }, {
	name : 'facets',
	caption : 'facets:',
	type : 'float',
	initial : 3
    }, ];
}

function main(params) {
    OpenJsCad.log("Start");
    var solid = hjul(params);
    var features = solid.getFeatures([ "volume", "area" ]);
    var volume = features[0];
    var area = features[1];
    OpenJsCad.log("volume: " + volume + "; area: " + area);
    return solid;
}

function hjul(params) {
    var solid = union(navet(params), ekene(params), dekket(params),
	    veiven(params), vekten(params));
    if (params.quality == "normal") {
	OpenJsCad.log("contract hjulet");
	return solid.contract(params.contract, params.facets);
    } else if (params.quality == "high") {
	OpenJsCad.log("contract hjulet");
	return solid.contract(params.contract, params.facets);
    } else {
	return solid;
    }
}

function veiven(params) {
    var senter = CSG.cylinder({
	start : [ params.concentric_offset, 0, params.nav_height - 2 ],
	end : [ params.concentric_offset, 0, params.nav_height ],
	radiusStart : 1,
	radiusEnd : 1.2,
	resolution : 24
    });
    var veiven = CSG.cylinder({
	start : [ params.concentric_offset, 0, 0 ],
	end : [ params.concentric_offset, 0, params.nav_height ],
	radiusStart : params.consentric_radius + params.slip_offset,
	radiusEnd : params.consentric_radius - params.slip_offset,
	resolution : 24
    });
    var solid = veiven.subtract(senter);
    if (params.quality == "high") {
	OpenJsCad.log("expand veiven");
	return solid.expand(params.expands, params.facets);
    } else {
	return solid;
    }
}

function vekten(params) {
    var counterweight = CSG.cylinder({
	start : [ 0, 0, 0 ],
	end : [ 0, 0, params.nav_height ],
	radiusStart : params.inner_rim_radius + params.slip_offset,
	radiusEnd : params.inner_rim_radius,
	resolution : 48
    });
    var cut_out = CSG.cylinder({
	start : [ params.counterweight_offset, 0, 0 ],
	end : [ params.counterweight_offset, 0, params.nav_height ],
	radiusStart : params.counterweight_radius - params.slip_offset,
	radiusEnd : params.counterweight_radius,
	resolution : 48
    });
    var solid = counterweight.subtract(cut_out).rotateZ(
	    params.counterweight_angle);
    if (params.quality == "high") {
	OpenJsCad.log("expand vekten");
	return solid.expand(params.expands, params.facets);
    } else {
	return solid;
    }
}

function navet(params) {
    var senter = CSG.cylinder({
	start : [ 0, 0, params.nav_height - 2 ],
	end : [ 0, 0, params.nav_height ],
	radiusStart : 1,
	radiusEnd : 1.2,
	resolution : 24
    });
    var nav = CSG.cylinder({
	start : [ 0, 0, 0 ],
	end : [ 0, 0, params.nav_height ],
	radiusStart : params.nav_radius + params.slip_offset,
	radiusEnd : params.nav_radius - params.slip_offset,
	resolution : 24
    });
    var solid = nav.subtract(senter);
    if (params.quality == "high") {
	OpenJsCad.log("expand navet");
	return solid.expand(params.expands, params.facets);
    } else {
	return solid;
    }
}

function dekket(params) {
    var inner = CSG.cylinder({
	start : [ 0, 0, 0 ],
	end : [ 0, 0, params.rim_height ],
	radiusStart : params.inner_rim_radius - params.slip_offset,
	radiusEnd : params.inner_rim_radius,
	resolution : 48
    });
    var outer = CSG.cylinder({
	start : [ 0, 0, 0 ],
	end : [ 0, 0, params.rim_height ],
	radiusStart : params.outer_rim_radius + params.slip_offset,
	radiusEnd : params.outer_rim_radius,
	resolution : 48
    });
    var solid = outer.subtract(inner);
    if (params.quality == "high") {
	OpenJsCad.log("expand dekket");
	return solid.expand(params.expands, params.facets);
    } else {
	return solid;
    }
}

function ekene(params) {
    var number_of_spokes = params.number_of_spokes;
    var degrees = 360 / number_of_spokes;
    var offset = 15;
    var eker = [];
    for (i = 0; i < number_of_spokes; i++) {
	if (params.style == "0") {
	    eker.push(cylinder_eke(params).rotateZ(offset + i * degrees));
	} else {
	    eker.push(prismatisk_eke(params).rotateZ(offset + i * degrees));
	}
    }
    return eker;
}

function cylinder_eke(params) {
    var cylinder = CSG.cylinder({
	start : [ params.spoke_inner_length, 0, 0 ],
	end : [ params.spoke_outer_length, 0, 0 ],
	radiusStart : params.spoke_inner_width,
	radiusEnd : params.spoke_outer_width,
	resolution : 32
    });
    var vertical_scale = params.spoke_vertical_scale;
    var vertical_offset = params.spoke_vertical_offset;
    var elipse = cylinder.scale([ 1, 1, vertical_scale ]).translate([0, 0, vertical_offset ]);
    var plane = CSG.Plane.fromPoints([ 5, 5, 0 ], [ -5, 5, 0 ], [ 0, -5, 0 ]);
    return elipse.cutByPlane(plane.flipped());
}

function prismatisk_eke(params) {
    var lower = params.floor_height - params.expands;
    var inner = params.spoke_inner_length - params.expands;
    var inner_upper = params.spoke_inner_height - params.expands;
    var spoke_inner_width = params.spoke_inner_width - params.expands;
    var inner_upper_width = params.upper_width - params.expands;
    var outer = params.spoke_outer_length - params.expands;
    var outer_upper = params.spoke_outer_height - params.expands;
    var spoke_outer_width = params.spoke_outer_width - params.expands;
    var outer_upper_width = params.outer_upper_width - params.expands;

    var vertecies = [];
    vertecies.push(new CSG.Vertex(new CSG.Vector3D(spoke_inner_width, inner, lower))); // 0
    vertecies.push(new CSG.Vertex(new CSG.Vector3D(inner_upper_width, inner,
	    inner_upper))); // 1
    vertecies.push(new CSG.Vertex(new CSG.Vector3D(spoke_outer_width, outer, lower))); // 2
    vertecies.push(new CSG.Vertex(new CSG.Vector3D(outer_upper_width, outer,
	    outer_upper))); // 3
    vertecies
	    .push(new CSG.Vertex(new CSG.Vector3D(-spoke_inner_width, inner, lower))); // 4
    vertecies.push(new CSG.Vertex(new CSG.Vector3D(-inner_upper_width, inner,
	    inner_upper))); // 5
    vertecies
	    .push(new CSG.Vertex(new CSG.Vector3D(-spoke_outer_width, outer, lower))); // 6
    vertecies.push(new CSG.Vertex(new CSG.Vector3D(-outer_upper_width, outer,
	    outer_upper))); // 7

    var polygons = [];
    polygons
	    .push(new CSG.Polygon([ vertecies[0], vertecies[4], vertecies[6] ])); // A
    polygons
	    .push(new CSG.Polygon([ vertecies[0], vertecies[1], vertecies[5] ])); // B
    polygons
	    .push(new CSG.Polygon([ vertecies[2], vertecies[3], vertecies[1] ])); // C
    polygons
	    .push(new CSG.Polygon([ vertecies[6], vertecies[7], vertecies[3] ])); // D
    polygons
	    .push(new CSG.Polygon([ vertecies[4], vertecies[5], vertecies[7] ])); // E
    polygons
	    .push(new CSG.Polygon([ vertecies[7], vertecies[5], vertecies[1] ])); // F
    polygons
	    .push(new CSG.Polygon([ vertecies[0], vertecies[6], vertecies[2] ])); // A
    polygons
	    .push(new CSG.Polygon([ vertecies[0], vertecies[5], vertecies[4] ])); // B
    polygons
	    .push(new CSG.Polygon([ vertecies[2], vertecies[1], vertecies[0] ])); // C
    polygons
	    .push(new CSG.Polygon([ vertecies[6], vertecies[3], vertecies[2] ])); // D
    polygons
	    .push(new CSG.Polygon([ vertecies[4], vertecies[7], vertecies[6] ])); // E
    polygons
	    .push(new CSG.Polygon([ vertecies[7], vertecies[1], vertecies[3] ])); // F

    var solid = CSG.fromPolygons(polygons);
    return solid.expand(params.expands, params.facets);
}
