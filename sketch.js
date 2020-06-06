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

const BOID_LEN_FRONT = 20;
const BOID_LEN_BACK = BOID_LEN_FRONT / 2;
const BOID_BACK_ANGLE = .4

class Boid {
  constructor() {
    this.pos_x = 50;
    this.pos_y = 50;
    this.orientation = 0.;

    this.vel_x = 1;
    this.vel_y = 0;
  }

  draw() {
    var boid_triangle_x1 = this.pos_x + BOID_LEN_FRONT * cos(this.orientation);
    var boid_triangle_y1 = this.pos_y - BOID_LEN_FRONT * sin(this.orientation);
    var boid_triangle_x2 = this.pos_x + BOID_LEN_BACK * cos(this.orientation + PI * (1 - BOID_BACK_ANGLE / 2));
    var boid_triangle_y2 = this.pos_y - BOID_LEN_BACK * sin(this.orientation + PI * (1 - BOID_BACK_ANGLE / 2));
    var boid_triangle_x3 = this.pos_x + BOID_LEN_BACK * cos(this.orientation + PI * (1 + BOID_BACK_ANGLE / 2));
    var boid_triangle_y3 = this.pos_y - BOID_LEN_BACK * sin(this.orientation + PI * (1 + BOID_BACK_ANGLE / 2));

    noFill();
    stroke(color('black'));
    triangle(boid_triangle_x1, boid_triangle_y1, boid_triangle_x2, boid_triangle_y2, boid_triangle_x3, boid_triangle_y3);
  }

  step() {
    this.pos_x += this.vel_x;
    this.pos_y += this.vel_y;
  }
}

var boid;

function setup() {
  boid = new Boid();
}

function draw() {
  clear();
  
  draw_coord_arrow(0., color('red'));
  draw_coord_arrow(HALF_PI, color('green'));

  boid.step();
  boid.draw();
}