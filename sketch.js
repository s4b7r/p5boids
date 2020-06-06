const COORD_ARROWS_OFFSET_X = 5;
const COORD_ARROWS_OFFSET_Y = 5;
const COORD_ARROW_HEAD_WIDTH = 10;
const COORD_ARROWS_CENTER_X = COORD_ARROW_HEAD_WIDTH / 2 + COORD_ARROWS_OFFSET_X;
const COORD_ARROWS_CENTER_Y = COORD_ARROW_HEAD_WIDTH / 2 + COORD_ARROWS_OFFSET_Y;
const COORD_ARROWS_LINE_LENGTH = 20;
const COORD_ARROW_HEAD_LEN = 10;

function draw_coord_arrow(orientation, head_color) {
  var coord_arrow_orientation = orientation;
  var coord_arrow_head_base_x = COORD_ARROWS_CENTER_X + COORD_ARROWS_LINE_LENGTH * cos(coord_arrow_orientation);
  var coord_arrow_head_base_y = COORD_ARROWS_CENTER_Y + COORD_ARROWS_LINE_LENGTH * sin(coord_arrow_orientation);
  stroke(color('black'));
  line(COORD_ARROWS_CENTER_X, COORD_ARROWS_CENTER_Y, coord_arrow_head_base_x, coord_arrow_head_base_y);

  var coord_arrow_head_x1 = coord_arrow_head_base_x + COORD_ARROW_HEAD_LEN * cos(coord_arrow_orientation );
  var coord_arrow_head_y1 = coord_arrow_head_base_y + COORD_ARROW_HEAD_LEN * sin(coord_arrow_orientation );
  var coord_arrow_head_x2 = coord_arrow_head_base_x + COORD_ARROW_HEAD_WIDTH / 2 * cos(coord_arrow_orientation + PI * .5);
  var coord_arrow_head_y2 = coord_arrow_head_base_y + COORD_ARROW_HEAD_WIDTH / 2 * sin(coord_arrow_orientation + PI * .5);
  var coord_arrow_head_x3 = coord_arrow_head_base_x + COORD_ARROW_HEAD_WIDTH / 2 * cos(coord_arrow_orientation + PI * 1.5);
  var coord_arrow_head_y3 = coord_arrow_head_base_y + COORD_ARROW_HEAD_WIDTH / 2 * sin(coord_arrow_orientation + PI * 1.5);
  fill(head_color);
  triangle(coord_arrow_head_x1, coord_arrow_head_y1, coord_arrow_head_x2, coord_arrow_head_y2, coord_arrow_head_x3, coord_arrow_head_y3);
}

const BOID_LEN_FRONT = 10;
const BOID_LEN_BACK = BOID_LEN_FRONT / 2;
const BOID_BACK_ANGLE = .4
const BOID_ORIENTATION_INERTIA = 0

class Boid {
  constructor(pos_x, pos_y) {
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.orientation = 0.;
    
    this.speed = 1;
    this.d_orientation = .1;
  }

  draw() {
    var boid_triangle_x1 = this.pos_x + BOID_LEN_FRONT * cos(this.orientation);
    var boid_triangle_y1 = this.pos_y + BOID_LEN_FRONT * sin(this.orientation);
    var boid_triangle_x2 = this.pos_x + BOID_LEN_BACK * cos(this.orientation + PI * (1 - BOID_BACK_ANGLE / 2));
    var boid_triangle_y2 = this.pos_y + BOID_LEN_BACK * sin(this.orientation + PI * (1 - BOID_BACK_ANGLE / 2));
    var boid_triangle_x3 = this.pos_x + BOID_LEN_BACK * cos(this.orientation + PI * (1 + BOID_BACK_ANGLE / 2));
    var boid_triangle_y3 = this.pos_y + BOID_LEN_BACK * sin(this.orientation + PI * (1 + BOID_BACK_ANGLE / 2));

    noFill();
    stroke(color('white'));
    triangle(boid_triangle_x1, boid_triangle_y1, boid_triangle_x2, boid_triangle_y2, boid_triangle_x3, boid_triangle_y3);
  }

  step() {
    this.steer_toward({x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2});
    this.pos_x += this.speed * cos(this.orientation);
    this.pos_y += this.speed * sin(this.orientation);
  }

  steer_toward(target) {
    var target_vector_x = target.x - this.pos_x;
    var target_vector_y = target.y - this.pos_y;
    var target_orientation = atan2(target_vector_y, target_vector_x);
    var orientation_difference = target_orientation - this.orientation;
    this.orientation += orientation_difference * (1 - BOID_ORIENTATION_INERTIA);
  }
}

var boids = [];
const NUM_BOIDS = 10;
const FIELD_HEIGHT = 500;
const FIELD_WIDTH = 500;

function setup() {
  createCanvas(FIELD_WIDTH, FIELD_HEIGHT);

  for (boid_id = 0; boid_id < NUM_BOIDS; boid_id++) {
    boids.push(new Boid(random(FIELD_WIDTH - BOID_LEN_FRONT - BOID_LEN_BACK), random(FIELD_HEIGHT - BOID_LEN_FRONT - BOID_LEN_BACK)));
  }
}

function draw() {
  clear();
  background('gray');

  draw_coord_arrow(0., color('red'));
  draw_coord_arrow(HALF_PI, color('green'));

  boids.forEach(function(boid, boid_id, boids_) {
    boid.step();
    boid.draw();
  })
}