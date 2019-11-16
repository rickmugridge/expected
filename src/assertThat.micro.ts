import {assertThat} from "./assertThat";
import {match} from "./match";
import {MatchResult} from "./MatchResult";
import {fail} from "assert";

describe("assertThat():", () => {
    describe("is():", () => {
        it('matches', () => {
            const actual = 3.4;
            assertThat(actual).is(actual);
        });

        it('mismatches', () => {
            assertThat(3.4).failsWith(3.5,
                {[MatchResult.was]: 3.4, [MatchResult.expected]: 3.5});
        });
    });

    describe("itIs():", () => {
        it('matches', () => {
            const actual = {f: 3.4};
            assertThat(actual).itIs(actual);
        });

        it('mismatches', () => {
            assertThat(() => assertThat({f: 3.4}).itIs({f: 3.4})).throws();
        });
    });

    describe("isNot():", () => {
        it("matches", () => {
            assertThat(2).isNot(4);
        });

        it("mismatches", () => {
            assertThat(2).failsWith(match.not(2),
                {[MatchResult.was]: 2, [MatchResult.expected]: {not: 2}});
        });
    });

    describe("isAnyOf():", () => {
        it("Matches", () => {
            assertThat(new Date()).isAnyOf([match.isEquals(3), match.instanceOf(Date)]);
        });

        it("Mismatches", () => {
            assertThat("ab")
                .failsWith(match.anyOf([match.instanceOf(Date)]),
                    {[MatchResult.was]: "ab", [MatchResult.expected]: {anyOf: [{instanceOf: "Date"}]}});
        });
    });

    describe("isAnyOf():", () => {
        it("Matches", () => {
            assertThat(new Date()).isAnyOf([match.isEquals(3), match.instanceOf(Date)]);
        });

        it("Mismatches", () => {
            assertThat("ab")
                .failsWith(match.anyOf([match.instanceOf(Date)]),
                    {[MatchResult.was]: "ab", [MatchResult.expected]: {anyOf: [{instanceOf: "Date"}]}});
        });
    });

    describe("throws()", () => {
        it("Matches", () => {
            assertThat(() => {
                throw new Error("error");
            }).throws(match.instanceOf(Error));
        });

        it("Matches with no expectation", () => {
            assertThat(() => {
                throw new Error("error");
            }).throws();
        });

        it("Mismatches", () => {
            let passed = false;
            try {
                assertThat(() => 3).throws(match.instanceOf(Error));
                passed = true;
            } catch (e) {
                assertThat(e).is({message: "Problem in throws()"});
            }
            assertThat(passed).is(false);
        });

        it("Actual is not a function", () => {
            assertThat(() =>
                assertThat(4).throws("error")
            ).throws(match.instanceOf(Error));
        });
    });

    it("throwsError()", () => {
        assertThat(() => {
            throw new Error("error");
        }).throwsError("error");
        assertThat(() => {
            throw new Error("error");
        }).throwsError(match.string.startsWith("err"));
    });

    describe("catches():", () => {
        it("Matches", () => {
            const fn = () => Promise.reject(4);
            return assertThat(fn).catches(4);
        });

        it("Mismatches", () => {
            return assertThat(() => Promise.resolve(4))
                .catches(4)
                .catch(e => assertThat(e).is("Problem in catches()"));
        });

        it("Actual is not a function", () => {
            const assertionFn = () => assertThat(4).catches("error");
            return assertThat(assertionFn).throws(match.instanceOf(Error));
        });

        it("Return from actual function is not a Promise", () => {
            const assertionFn = () => assertThat(() => 4).catches("error");
            return assertThat(assertionFn).throws(match.instanceOf(Error));
        });

        it("Alternative", () => {
            return Promise
                .reject(4)
                .then(
                    () => fail("Unexpected"),
                    e => assertThat(e).is(4));
        });
    });

    it("catchesError()", () => {
        assertThat(() => Promise.reject(new Error("error")))
            .catchesError("error");
        assertThat(() => Promise.reject(new Error("error")))
            .catchesError(match.string.startsWith("err"));
    });
});