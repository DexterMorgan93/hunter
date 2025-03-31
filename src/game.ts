import { Application, Container, Rectangle } from "pixi.js";
import { Player } from "./player";
import { Projectile } from "./projectile";

export class Game extends Container {
  app: Application;
  area: Container;
  projectiles: Projectile[] = [];

  constructor(app: Application) {
    super();
    this.app = app;

    const player = new Player();
    player.position.set(app.screen.width / 2, app.screen.height / 2);
    player.setup();
    this.addChild(player);

    this.area = new Container();
    this.area.width = app.screen.width;
    this.area.height = app.screen.height;
    this.area.eventMode = "dynamic";
    this.area.hitArea = new Rectangle(
      0,
      0,
      app.screen.width,
      app.screen.height
    );
    this.area.addEventListener("click", (e) => {
      const angle = Math.atan2(
        e.clientY - app.screen.height / 2,
        e.clientX - app.screen.width / 2
      );

      const projectile = new Projectile({
        x: Math.cos(angle),
        y: Math.sin(angle),
      });
      projectile.setup();
      projectile.position.set(app.screen.width / 2, app.screen.height / 2);
      this.projectiles.push(projectile);
    });
    this.addChild(this.area);
  }

  handleUpdate() {
    this.projectiles.forEach((item) => {
      item.handleUpdate();
      this.addChild(item);
    });
  }
}
