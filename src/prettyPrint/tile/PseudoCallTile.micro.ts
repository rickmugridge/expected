import {assertThat} from "../../assertThat";
import {Appender} from "../Appender";
import {SimpleTile} from "./SimpleTile";
import {PseudoCallTile} from "./PseudoCallTile";

describe("PseudoCallTile", () => {
    it("Undefined arguments", () => {
        const arrayTile = new PseudoCallTile("target.meth", undefined);
        assertThat(arrayTile).is({callName: "target.meth", stringLength: 3, complexity: 1});
        assertThat(Appender.composeLength(arrayTile)).is(11);
    });

    it("No arguments", () => {
        const arrayTile = new PseudoCallTile("target.meth", []);
        assertThat(arrayTile).is({callName: "target.meth", args: [], stringLength: 11, complexity: 3});
        assertThat(Appender.composeLength(arrayTile)).is(13);
    });

    it("One argument", () => {
        const tile = new SimpleTile("hello");
        const arrayTile = new PseudoCallTile("fn", [tile]);
        assertThat(arrayTile).is({callName: "fn", args: [tile], stringLength: 9, complexity: 4});
        assertThat(Appender.composeLength(arrayTile)).is(9);
    });

    it("Three arguments", () => {
        const tile1 = new SimpleTile("hello");
        const tile2 = new SimpleTile("there");
        const tile3 = new SimpleTile("hi");
        const arrayTile = new PseudoCallTile("dateTime.plusDays", [tile1, tile2, tile3]);
        assertThat(arrayTile).is({
            callName: "dateTime.plusDays",
            args: [tile1, tile2, tile3],
            stringLength: 35,
            complexity: 6
        });
        assertThat(Appender.composeLength(arrayTile)).is(35);
    });
});
