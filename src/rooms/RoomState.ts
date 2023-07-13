import {
  Schema,
  Context,
  type,
  MapSchema,
  ArraySchema,
} from "@colyseus/schema";
import { Equipped } from "../types/bumpkin";

export interface InputData {
  x: number;
  y: number;
  tick: number;
  text: string;
  clothing: Equipped;
}

export class Clothing extends Schema {
  @type("string") body?: string;
  @type("string") shirt?: string;
  @type("string") pants?: string;
  @type("string") hat?: string;
  @type("string") suit?: string;
  @type("string") onesie?: string;
  @type("string") dress?: string;
  @type("string") hair?: string;
  @type("string") wings?: string;
  @type("number") updatedAt?: number;
}

export class Player extends Schema {
  @type("number") farmId?: number;
  @type("number") x?: number;
  @type("number") y?: number;
  @type("number") tick?: number;
  @type("string") username?: string;
  @type("boolean") trusted?: boolean;

  @type(Clothing)
  clothing = new Clothing();

  inputQueue: InputData[] = [];
}

export class Message extends Schema {
  @type("string") text?: string;
  @type("string") sessionId?: string;
  @type("number") sentAt?: number;
  @type("number") farmId?: number;
}

export class IngalsRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();

  @type({ array: Message })
  messages = new ArraySchema<Message>();
}
