import {
  Application,
  Container,
  FederatedPointerEvent,
  Rectangle,
} from "pixi.js";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { Enemy } from "./enemy";

const click = {
  tap: {
    clicked: false,
    x: 0,
    y: 0,
  },
};

export class Game extends Container {
  app: Application;
  area: Container;
  projectiles: Projectile[] = [];
  enemies: Enemy[] = [];
  elapsedFrames = 0;
  shootCooldown = 0;
  fireRate = 100;

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
    this.handlePointerDown();
    this.handlePointerMove();
    this.handlePointerUp();
    this.addChild(this.area);
  }

  handlePointerDown() {
    this.area.addEventListener("pointerdown", (e) => {
      click.tap.clicked = true;
      console.log("e.clientX", e.pointerId);
      click.tap.x = e.clientX;
      click.tap.y = e.clientY;
    });
  }
  handlePointerMove() {
    this.area.addEventListener("pointermove", (e) => {
      if (click.tap.clicked) {
        click.tap.x = e.clientX;
        click.tap.y = e.clientY;
      }
    });
  }
  handlePointerUp() {
    this.area.addEventListener("pointerup", () => {
      click.tap.clicked = false;
    });
  }

  updateProjectles(x: number, y: number) {
    const angle = Math.atan2(
      y - this.app.screen.height / 2,
      x - this.app.screen.width / 2
    );

    const projectile = new Projectile({
      x: Math.cos(angle) * 6,
      y: Math.sin(angle) * 6,
    });
    projectile.setup();
    projectile.position.set(
      this.app.screen.width / 2,
      this.app.screen.height / 2
    );
    this.projectiles.push(projectile);
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

  handleUpdate(deltaMS: number) {
    this.elapsedFrames++;
    const { x, y } = this;
    const left = x;
    const top = y;
    const right = x + this.app.screen.width;
    const bottom = y + this.app.screen.height;
    this.projectiles.forEach((item) => {
      item.handleUpdate();
      this.addChild(item);
    });

    if (click.tap.clicked) {
      this.shootCooldown -= deltaMS;
      if (this.shootCooldown <= 0) {
        this.shootCooldown = this.fireRate;
        this.updateProjectles(click.tap.x, click.tap.y);
      }
    }

    if (this.elapsedFrames % 60 === 0) {
      this.spawnEnemies();
    }

    this.enemies.forEach((item, enemyIndex) => {
      item.handleUpdate();
      this.addChild(item);

      if (item.isOutOfViewport({ left, top, right, bottom })) {
        this.removeChild(item);
        this.enemies.splice(enemyIndex, 1);
      }

      this.projectiles.forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - item.x, projectile.y - item.y);
        if (dist - projectile.radius - item.radius < 0) {
          this.projectiles.splice(projectileIndex, 1);
          this.enemies.splice(enemyIndex, 1);

          this.removeChild(projectile);
          this.removeChild(item);
        }

        if (projectile.isOutOfViewport({ left, top, right, bottom })) {
          this.removeChild(projectile);
          this.projectiles.splice(projectileIndex, 1);
        }
      });
    });
  }
}
