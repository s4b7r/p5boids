const EPSILON = 1e-5;

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

function rad_into_nPi2Pi(rad) {
  var value = rad % TWO_PI;
  if (value > PI) {
    value -= TWO_PI;
  } else if (value < -PI) {
    value += TWO_PI;
  }
  console.assert(value <= PI, value);
  console.assert(value >= -PI, value);
  return value;
}

const BOID_LEN_FRONT = 10;
const BOID_LEN_BACK = BOID_LEN_FRONT / 2;
const BOID_BACK_ANGLE = .4
const BOID_ORIENTATION_INERTIA = .96;
const BOID_VIEWDIST_CENTER = 150;

class Boid {
  constructor(pos_x, pos_y) {
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.orientation = 0.;
    
    this.speed = 1;

    this.viewdist_center = BOID_VIEWDIST_CENTER;

    this._draw_debug = false;
  }

  set draw_debug(flag) {
    this._draw_debug = flag;
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
    if (this._draw_debug) {
      stroke('yellow');
    }
    triangle(boid_triangle_x1, boid_triangle_y1, boid_triangle_x2, boid_triangle_y2, boid_triangle_x3, boid_triangle_y3);
  }

  step() {
    var target_direction_for_center_of_mass = this.get_direction_for_center_of_mass(boids);
    var target_direction = {x: 0, y: 0};
    target_direction.x += target_direction_for_center_of_mass.x;
    target_direction.y += target_direction_for_center_of_mass.y;
    if (this._draw_debug) {
      stroke('yellow');
      line(this.pos_x, this.pos_y, this.pos_x + target_direction.x * 10, this.pos_y + target_direction.y * 10)
    }
    this.steer_toward_direction(target_direction_for_center_of_mass);
    this.pos_x += this.speed * cos(this.orientation);
    this.pos_y += this.speed * sin(this.orientation);
  }

  steer_toward_orientation(target_orientation) {
    var orientation_difference = target_orientation - rad_into_nPi2Pi(this.orientation);
    orientation_difference = rad_into_nPi2Pi(orientation_difference);
    this.orientation += orientation_difference * (1 - BOID_ORIENTATION_INERTIA);
  }

  steer_toward_direction(direction) {
    var target_orientation = atan2(direction.y, direction.x);
    this.steer_toward_orientation(target_orientation);
  }

  get_direction_for_center_of_mass(boids) {
    return this.get_target_direction_for_position(this.get_boids_center_of_mass(boids));
  }

  steer_toward_center_of_mass(boids) {
    var target = this.get_boids_center_of_mass(boids);
    this.steer_toward(target);
  }

  get_target_direction_for_position(target_pos) {
    var target_vector_x = target_pos.x - this.pos_x;
    var target_vector_y = target_pos.y - this.pos_y;
    var vector_length = sqrt(pow(target_vector_x, 2) + pow(target_vector_y, 2)) + EPSILON;
    return {
      x: target_vector_x / vector_length,
      y: target_vector_y / vector_length
    };
  }

  steer_toward(target_pos) {
    var target_direction = this.get_target_direction_for_position(target_pos);
    this.steer_toward_direction(target_direction);
  }

  get_boids_center_of_mass(boids) {
    var boids_x = 0;
    var boids_y = 0;
    var count = 0;
    boids.forEach(function(boid, boid_id, boids_) {
      if (get_vector_length(this.get_vector_to_position(boid.position)) <= this.viewdist_center) {
        boids_x += boid.pos_x;
        boids_y += boid.pos_y;
        count += 1;
      }
    }, this)
    if (count >= 1) {
      boids_x /= count;
      boids_y /= count;
    }
    return {
      x: boids_x,
      y: boids_y
    };
  }

  get_vector_to_position(pos) {
    return {
      x: pos.x - this.pos_x,
      y: pos.y - this.pos_y
    };
  }

  get position() {
    return {
      x: this.pos_x,
      y: this.pos_y
    };
  }
}

function get_vector_length(vec) {
  return sqrt(pow(vec.x, 2) + pow(vec.y, 2));
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
  boids[0].draw_debug = true;
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