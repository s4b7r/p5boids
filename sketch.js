function setup() {
  // put setup code here
}

function draw() {
  fill(color('red'));
  triangle(15, 4, 5, 0, 5, 10);
  fill(color('green'));
  triangle(4, 15, 0, 5, 10, 5);

  var boid_x = 50;
  var boid_y = 50;
  var boid_orientation = 0.;

  const BOID_LEN_FRONT = 20;
  const BOID_LEN_BACK = BOID_LEN_FRONT / 2;
  const BOID_BACK_ANGLE = .4

  var boid_triangle_x1 = boid_x + BOID_LEN_FRONT * cos(boid_orientation);
  var boid_triangle_y1 = boid_y - BOID_LEN_FRONT * sin(boid_orientation);
  var boid_triangle_x2 = boid_x + BOID_LEN_BACK * cos(boid_orientation + Math.PI * (1 - BOID_BACK_ANGLE / 2));
  var boid_triangle_y2 = boid_y - BOID_LEN_BACK * sin(boid_orientation + Math.PI * (1 - BOID_BACK_ANGLE / 2));
  var boid_triangle_x3 = boid_x + BOID_LEN_BACK * cos(boid_orientation + Math.PI * (1 + BOID_BACK_ANGLE / 2));
  var boid_triangle_y3 = boid_y - BOID_LEN_BACK * sin(boid_orientation + Math.PI * (1 + BOID_BACK_ANGLE / 2));

  noFill();
  stroke(color('black'));
  triangle(boid_triangle_x1, boid_triangle_y1, boid_triangle_x2, boid_triangle_y2, boid_triangle_x3, boid_triangle_y3);
}