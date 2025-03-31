import { Application, Container, Rectangle } from "pixi.js";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Enemy } from "./enemy";

export class Game extends Container {
  app: Application;
  area: Container;
  projectiles: Projectile[] = [];
  enemies: Enemy[] = [];
  elapsedFrames = 0;

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

  spawnEnemies() {
    let x = 0;
    let y = 0;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - 30 : this.app.screen.width + 30;
      y = Math.random() * this.app.screen.height;
    } else {
      x = Math.random() * this.app.screen.width;
      y = Math.random() < 0.5 ? 0 - 30 : this.app.screen.height + 30;
    }
    const angle = Math.atan2(
      this.app.screen.height / 2 - y,
      this.app.screen.width / 2 - x
    );

    const enemy1 = new Enemy({
      x: Math.cos(angle),
      y: Math.sin(angle),
    });
    enemy1.setup();
    enemy1.position.set(x, y);
    this.enemies.push(enemy1);
  }

  handleUpdate() {
    this.elapsedFrames++;
    this.projectiles.forEach((item) => {
      item.handleUpdate();
      this.addChild(item);
    });

    if (this.elapsedFrames % 60 === 0) {
      this.spawnEnemies();
    }

    this.enemies.forEach((item) => {
      item.handleUpdate();
      this.addChild(item);
    });
  }
}
