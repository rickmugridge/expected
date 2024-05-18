import {assertThat} from "../assertThat";
import {match} from "../match";
import {MatchResult} from "../MatchResult";
import {validateThat} from "../validateThat";

describe("obj.some:", () => {
    describe("assertThat():", () => {
        describe('matches', () => {
            it('matches all', () => {
                const actual = {f: 2, g: 3, h: 4};
                assertThat(actual).is(match.obj.has({f: 2, g: 3}));
            });

            it('literal object', () => {
                const actual = {f: 2, g: 3, h: 4};
                assertThat(actual).is(match.obj.has({f: 2, g: 3}));
            });

            it('empty object', () => {
                const actual = {f: 2, g: 3, h: 4};
                assertThat(actual).is(match.obj.has({}));
                assertThat({}).is(match.obj.has({}));
            });
        });

        describe('does not match actual that is:', () => {
            it('one filed is incorrect', () => {
                const actual = {f: 2, g: 3};
                const expected = match.obj.has({f: 3});
                assertThat(actual).failsWith(expected,
                    {f: {[MatchResult.was]: 2, [MatchResult.expected]: 3}});
            });

            it('not an object', () => {
                const actual = 3;
                const expected = match.obj.has({f: 3});
                assertThat(actual).failsWith(expected,
                    {[MatchResult.was]: 3, [MatchResult.expected]: {"obj.has": {f: 3}}});
            });

            it('undefined', () => {
                const actual = undefined;
                const expected = match.obj.has({f: 3});
                assertThat(actual).failsWith(expected,
                    {[MatchResult.expected]: {"obj.has": {f: 3}}});
            });
        });
    });

    describe("validateThat():", () => {
        const expected = match.obj.has({f: match.ofType.number(), g: match.ofType.boolean()});

        it("succeeds", () => {
            const validation = validateThat({f: 2, g: true, h: 45}).satisfies(expected);
            assertThat(validation.passed()).is(true);
        });

        it("fails wrong types", () => {
            const validation = validateThat({f: "2", g: 3, h: 45}).satisfies(expected);
            assertThat(validation.passed()).is(false);
            assertThat(validation.errors).is([
                `actual.f: "2", expected: "ofType.number"`,
                `actual.g: 3, expected: "ofType.boolean"`
            ]);
        });

        it("fails to match as expected fields has different value", () => {
            const validation = validateThat({f: "2", g: 4})
                .satisfies(match.obj.has({f: 3}));
            assertThat(validation.passed()).is(false);
            assertThat(validation.errors).is([
                'actual.f: "2", expected: 3'
            ]);
        });

        it("fails to match as expected field is missing", () => {
            const validation = validateThat({f: "2"})
                .satisfies(match.obj.has({g: 3}));
            assertThat(validation.passed()).is(false);
            assertThat(validation.errors).is([
                'actual.g: undefined, expected: 3'
            ]);
        });

        it("fails to match as expected field is missing and another field is missing", () => {
            const validation = validateThat({f: "2", g: 4})
                .satisfies(match.obj.has({g: 3, h: true}));
            assertThat(validation.passed()).is(false);
            assertThat(validation.errors).is([
                "actual.g: 4, expected: 3",
                "actual.h: undefined, expected: true"
            ]);
        });
    });
});
