import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Player extends Schema {
    @type("number")
    tick: number = 0;

    @type("number")
    x: number;

    @type("number")
    y: number;

    @type("number")
    bombs: number = 3;

    @type("number")
    radius: number = 2;

    @type("number")
    health: number = 3;

    @type("number")
    speed: number = 9;

    @type("number")
    direction: number;

    @type("boolean")
    isMove: boolean = false;

    constructor(direction: number, x: number, y: number) {
        super();

        this.direction = direction;
        this.x = x;
        this.y = y;
    }
}

export class Cell extends Schema {
    @type([ "number" ])
    entinies = new ArraySchema<number>();

    constructor(entities: number[]) {
        super();

        this.entinies = new ArraySchema<number>(...entities);
    }
}

export class GameState extends Schema {
    @type({ map: Player })
    plyaers = new MapSchema<Player>();

    @type([Cell])
    map = new ArraySchema<Cell>();

    constructor(map: Cell[]) {
        super();

        this.map = new ArraySchema<Cell>(...map);
    }
}
