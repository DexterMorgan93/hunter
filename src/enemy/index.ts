import { Container, Graphics } from "pixi.js";

export class Enemy extends Container {
  velocity: { x: number; y: number };
  radius: number;
  color: number;

  constructor(
    velocity: { x: number; y: number },
    radius: number,
    color: number
  ) {
    super();
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
  }

  setup() {
    const view = new Graphics();
    view.arc(0, 0, this.radius, 0, Math.PI * 2);
    view.fill({ color: this.color });
    this.addChild(view);
  }

  handleUpdate() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  isOutOfViewport({
    left,
    top,
    right,
    bottom,
  }: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  }): boolean {
    const pLeft = this.x - this.radius;
    const pTop = this.y - this.radius;
    const pRight = this.x + this.radius;
    const pBottom = this.y + this.radius;

    return pRight < left || pLeft > right || pBottom < top || pTop > bottom;
  }
}
