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
    this.worldContainer.addChild(small);
    small.setup();

    return small;
  }

  createMedium(velocity: { x: number; y: number }) {
    const medium = new Medium(velocity);
    this.worldContainer.addChild(medium);
    medium.setup();

    return medium;
  }

  createBig(velocity: { x: number; y: number }) {
    const big = new Big(velocity);
    this.worldContainer.addChild(big);
    big.setup();

    return big;
  }
}
