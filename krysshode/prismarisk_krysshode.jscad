function main() {
    var emne = cube({size: [45, 45, 20]});
    var linjalkanal = cube({size: [45, 10, 10]}).translate([0,0,5]);
    var slisse = cube({size: [35, 20, 10]}).translate([10,25,5]);
    var stangfeste = cylinder({h: 10, r:4, center: true}).rotateY(90).translate([5,35,10]);
    var tapphull = cylinder({h: 20, r:4, center: true}).rotateZ(90).translate([22.5,35,10]);
   return difference(emne, linjalkanal, slisse,stangfeste, tapphull);
}
