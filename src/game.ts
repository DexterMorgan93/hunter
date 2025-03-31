import { Application, Container } from "pixi.js";

export class Game extends Container {
  app: Application;
  constructor(app: Application) {
    super();
    this.app = app;
  }

  handleUpdate() {}
}
