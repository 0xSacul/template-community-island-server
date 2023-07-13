import { Room, Client } from "colyseus";
import {
  Clothing,
  InputData,
  Message,
  IngalsRoomState,
  Player,
} from "./RoomState";
import { IncomingMessage } from "http";
import { Bumpkin } from "../types/bumpkin";

const MAX_MESSAGES = 100;

export class IngalsRoom extends Room<IngalsRoomState> {
  fixedTimeStep = 1000 / 60;

  maxClients: number = 150;

  private pushMessage = (message: Message) => {
    this.state.messages.push(message);

    while (this.state.messages.length > MAX_MESSAGES) {
      this.state.messages.shift();
    }
  };

  onCreate(options: any) {
    this.setState(new IngalsRoomState());

    this.onMessage(0, (client, input) => {
      // handle player input
      const player = this.state.players.get(client.sessionId);

      // enqueue input to user input buffer.
      player?.inputQueue.push(input);
    });

    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick(this.fixedTimeStep);
      }
    });
  }

  fixedTick(timeStep: number) {
    const velocity = 1.68;

    this.state.players.forEach((player, key) => {
      let input: InputData | undefined;

      // dequeue player inputs
      while ((input = player.inputQueue.shift())) {
        if (input.x || input.y) {
          player.x = input.x;
          player.y = input.y;
        }

        if (input.clothing) {
          player.clothing = new Clothing({
            body: input.clothing.body,
            shirt: input.clothing.shirt,
            pants: input.clothing.pants,
            onesie: input.clothing.onesie,
            wings: input.clothing.wings,
            suit: input.clothing.suit,
            dress: input.clothing.dress,
            hat: input.clothing.hat,
            hair: input.clothing.hair,
            updatedAt: Date.now(),
          });
        }

        player.tick = input.tick;

        if (input.text) {
          const message = new Message();
          message.text = input.text;
          message.sessionId = key;
          message.farmId = player.farmId;
          message.sentAt = Date.now();
          this.pushMessage(message);
        }
      }
    });
  }

  async onAuth(
    client: Client<any>,
    options: { jwt: string; farmId: number; bumpkin: Bumpkin },
    request?: IncomingMessage | undefined
  ) {
    // TODO - implement your own Auth here to verify who they are
    return { bumpkin: options.bumpkin, farmId: options.farmId };
  }

  onJoin(
    client: Client,
    options: { x: number; y: number },
    auth: { bumpkin: Bumpkin; farmId: number }
  ) {
    const player = new Player();
    player.x = options.x;
    player.y = options.y;
    player.farmId = auth.farmId;

    const clothing = auth.bumpkin.equipped;
    player.clothing.body = clothing.body;
    player.clothing.shirt = clothing.shirt;
    player.clothing.pants = clothing.pants;
    player.clothing.onesie = clothing.onesie;
    player.clothing.suit = clothing.suit;
    player.clothing.dress = clothing.dress;
    player.clothing.hat = clothing.hat;
    player.clothing.hair = clothing.hair;
    player.clothing.wings = clothing.wings;

    this.state.players.set(client.sessionId, player);

    const message = new Message();
    message.text = `Player ${client.sessionId} of farm ${auth.farmId} joined. Welcome on my Island!`;
    message.sentAt = Date.now();
    this.pushMessage(message);
  }

  onLeave(client: Client, consented: boolean) {
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
