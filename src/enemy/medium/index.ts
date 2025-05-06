import { Enemy } from "..";

export class Medium extends Enemy {
  constructor(velocity: { x: number; y: number }) {
    super(velocity, 20, 0x00ff00);
  }
}
