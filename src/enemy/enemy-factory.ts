import { Small } from "./small";
import { Medium } from "./medium";
import { Big } from "./big";
import { Game } from "../game";

export class EnemyFactory {
  worldContainer;

  constructor(worldContainer: Game) {
    this.worldContainer = worldContainer;
  }

  createSmall(velocity: { x: number; y: number }) {
    const small = new Small(velocity);
    small.setup();
    this.worldContainer.addChild(small);

    return small;
  }

  createMedium(velocity: { x: number; y: number }) {
    const medium = new Medium(velocity);
    medium.setup();
    this.worldContainer.addChild(medium);

    return medium;
  }

  createBig(velocity: { x: number; y: number }) {
    const big = new Big(velocity);
    big.setup();
    this.worldContainer.addChild(big);

    return big;
  }
}
