import { Container, Graphics } from "pixi.js";

export class Enemy extends Container {
  velocity = {
    x: 0,
    y: 0,
  };
  radius = 30;

  constructor(velocity: { x: number; y: number }) {
    super();

    this.velocity = velocity;
  }

  setup() {
    const view = new Graphics();
    view.arc(0, 0, this.radius, 0, Math.PI * 2);
    view.fill({ color: "red" });
    this.addChild(view);
  }

  handleUpdate() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}
