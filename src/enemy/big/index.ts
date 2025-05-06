import { Enemy } from "..";

export class Big extends Enemy {
  constructor(velocity: { x: number; y: number }) {
    super(velocity, 50, 0x0000ff, 30);
  }
}
