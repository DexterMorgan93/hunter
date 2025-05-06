import { Application, Container, Rectangle } from "pixi.js";
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
  enemySpeed = 5;
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

    // Генерация случайного угла
    const angle = Math.random() * Math.PI * 2;

    // Вычисление скорости на основе угла
    const velocityX = Math.cos(angle) * this.enemySpeed;
    const velocityY = Math.sin(angle) * this.enemySpeed;

    const enemy1 = new Enemy({
      x: velocityX,
      y: velocityY,
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

    // handle enemies
    for (
      let enemyIndex = this.enemies.length - 1;
      enemyIndex >= 0;
      enemyIndex--
    ) {
      const enemy = this.enemies[enemyIndex];
      enemy.handleUpdate();
      this.addChild(enemy);

      // Удаляем врага, если он выходит за границы
      if (enemy.isOutOfViewport({ left, top, right, bottom })) {
        this.removeChild(enemy);
        this.enemies.splice(enemyIndex, 1);
        continue;
      }
    }

    // handle projectiles
    for (
      let projectileIndex = this.projectiles.length - 1;
      projectileIndex >= 0;
      projectileIndex--
    ) {
      const projectile = this.projectiles[projectileIndex];

      // Проверка столкновения пули с границами экрана
      if (
        projectile.x - projectile.radius < left ||
        projectile.x + projectile.radius > right
      ) {
        projectile.velocity.x *= -1;
      }

      if (
        projectile.y - projectile.radius < top ||
        projectile.y + projectile.radius > bottom
      ) {
        projectile.velocity.y *= -1;
      }

      // Проверка столкновения пуль с врагами
      for (
        let enemyIndex = this.enemies.length - 1;
        enemyIndex >= 0;
        enemyIndex--
      ) {
        const enemy = this.enemies[enemyIndex];
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

        if (dist - projectile.radius - enemy.radius < 0) {
          this.projectiles.splice(projectileIndex, 1);
          this.enemies.splice(enemyIndex, 1);

          this.removeChild(projectile);
          this.removeChild(enemy);
          break;
        }
      }
    }
  }
}
