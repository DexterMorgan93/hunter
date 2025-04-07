import * as Pixi from "pixi.js";
import { initDevtools } from "@pixi/devtools";
import { Game } from "./game";

const app = new Pixi.Application();

async function setup() {
  await app.init({
    width: 1024,
    height: 768,
  });
  document.body.appendChild(app.canvas);
}

(async () => {
  await setup();

  const game = new Game(app);
  app.stage.addChild(game);
  app.ticker.add((delta) => {
    game.handleUpdate(delta.deltaMS);
  });
})();

initDevtools({
  app,
});
