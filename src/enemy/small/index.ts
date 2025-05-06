import { Enemy } from "..";

export class Small extends Enemy {
  constructor(velocity: { x: number; y: number }) {
    super(velocity, 30, 0xff0000);
  }
}
