import {assertThat} from "../assertThat";
import {match} from "../match";
import {wasExpected} from "./Mismatched";
import {validateThat} from "../validateThat";
import {internalAssertThat} from "../utility/internalAssertThat"

describe("array.contains:", () => {
    describe("Matches:", () => {
        it('number', () => {
            internalAssertThat([1, 2, 3]).is(match.array.contains(2));
        });

        it('string', () => {
            internalAssertThat(["a", "b"]).is(match.array.contains("b"));
        });

    });

    describe("Mismatches:", () => {
        const expected = match.array.contains(match.ofType.number());

        it('does not match', () => {
            internalAssertThat(["a", "b"])
                .failsWith(match.array.contains("c"))
                .wasExpected(["a", "b"], {"array.contains": "c"},
                    ['actual: ["a", "b"], expected: {"array.contains": "c"}'])
        });

        it('partially matched', () => {
            const actual = [{a: 1, c: "e"}, "b"];
            internalAssertThat(actual)
                .failsWith(match.array.contains({a: 1, c: "f"}))
                .wasDiff(
                    {a: 1, c: wasExpected("e", "f")},
                    ['actual.c: "e", expected: "f"'])
        });

        it('does not match with empty array', () => {
            internalAssertThat([])
                .failsWith(match.array.contains("c"))
                .wasExpected([], {"array.contains": "c"},
                    ['actual: [], expected: {"array.contains": "c"}'])
        });

        it("fails in an element of the array", () => {
            internalAssertThat(["1", "2", "3"])
                .failsWith(expected)
                .wasExpected(["1", "2", "3"], {"array.contains": "ofType.number"},
                    [`actual: ["1", "2", "3"], expected: {"array.contains": "ofType.number"}`])
        });

        it("fails as not an array", () => {
            const validation = validateThat(4).satisfies(expected);
            assertThat(validation.passed()).is(false);
            assertThat(validation.errors).is([
                `actual: 4, expected: "array expected"`
            ])
        });
    });
});
