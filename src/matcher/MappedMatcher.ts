import {DiffMatcher} from "./DiffMatcher";
import {MatchResult} from "../MatchResult";
import {matchMaker} from "./matchMaker";

export class MappedMatcher<T> implements DiffMatcher<T> {
    constructor(private map: (t: any) => T,
                private matcher: DiffMatcher<T> | any,
                private description: any) {
    }

    matches(actual: T): MatchResult {
        const matchResult = this.matcher.matches(this.map(actual));
        if (matchResult.passed()) {
            return MatchResult.good(1);
        }
        return MatchResult.wasExpected(actual, this.describe(), 1, 0);
    }

    describe(): any {
        return {mapped: {description: this.description, matcher: this.matcher.describe()}};
    }

    static make<T>(map: (t: any) => T, matcher: DiffMatcher<T> | any, description: any): any {
        return new MappedMatcher(map, matchMaker(matcher), description);
    }
}