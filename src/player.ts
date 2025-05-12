import { Container, Graphics } from "pixi.js";

export class Player extends Container {
  constructor() {
    super();
  }

  setup() {
    const view = new Graphics();
    view.arc(0, 0, 30, 0, Math.PI * 2);
    view.fill({ color: "white" });
    this.addChild(view);
  }
}
