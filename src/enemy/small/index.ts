import { Enemy } from "..";

export class Small extends Enemy {
  constructor(velocity: { x: number; y: number }) {
    super(velocity, 10, 0xff0000);
  }
}
