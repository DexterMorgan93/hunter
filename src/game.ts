import { Application, Container, Rectangle } from "pixi.js";
import { Player } from "./player";
import { Projectile } from "./projectile";
import { EnemyFactory } from "./enemy/enemy-factory";
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
  player: Player;
  area: Container;
  projectiles: Projectile[] = [];
  enemyFactory: EnemyFactory;
  enemyContainer: Container;
  enemySpeed = 1;
  elapsedFrames = 0;
  shootCooldown = 0;
  fireRate = 100;
  fireSpeed = 10;

  constructor(app: Application) {
    super();
    this.app = app;

    this.player = new Player();
    this.player.position.set(200, 737);
    this.player.setup();
    this.addChild(this.player);

    this.enemyContainer = new Container();
    this.addChild(this.enemyContainer);
    this.enemyFactory = new EnemyFactory(this);

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
      y - this.player.position.y,
      x - this.player.position.x
    );

    const projectile = new Projectile({
      x: Math.cos(angle) * this.fireSpeed,
      y: Math.sin(angle) * this.fireSpeed,
    });
    projectile.setup();
    projectile.position.set(this.player.position.x, this.player.position.y);
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

    const enemyTypes = [
      this.enemyFactory.createSmall.bind(this.enemyFactory),
      this.enemyFactory.createMedium.bind(this.enemyFactory),
      this.enemyFactory.createBig.bind(this.enemyFactory),
    ];

    // Вычисление скорости на основе угла
    const velocityX = Math.cos(angle) * this.enemySpeed;
    const velocityY = Math.sin(angle) * this.enemySpeed;

    // Случайный выбор типа врага
    const randomEnemyType =
      enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    // Создание случайного врага
    const enemy = randomEnemyType({
      x: velocityX,
      y: velocityY,
    });
    this.enemyContainer.addChild(enemy);
    enemy.position.set(x, y);
  }

  handleUpdate(deltaMS: number) {
    this.elapsedFrames++;
    if (this.elapsedFrames % 60 === 0) {
      this.spawnEnemies();
    }
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

    this.enemyContainer.children.forEach((child) => {
      const enemy = child as Enemy;
      enemy.handleUpdate();

      if (enemy.isOutOfViewport({ left, top, right, bottom })) {
        this.enemyContainer.removeChild(enemy);
      }
    });

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
      this.enemyContainer.children.forEach((child) => {
        const enemy = child as Enemy;
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

        if (dist - projectile.radius - enemy.radius < 0) {
          enemy.takeDamage(1);
          this.projectiles.splice(projectileIndex, 1);
          if (this.children.includes(projectile)) {
            this.removeChild(projectile);
          }

          if (enemy.getHealth === 0) {
            this.enemyContainer.removeChild(enemy);
          }
        }
      });
    }
  }
}
