import {ContextOfValidationError, DiffMatcher} from "./DiffMatcher";
import {Mismatched} from "./Mismatched";
import {MatchResult} from "../MatchResult";
import {isUndefined} from "util";
import {matchMaker} from "../matchMaker/matchMaker";

export class BindMatcher<T> extends DiffMatcher<T> {
    boundValueMatcher: DiffMatcher<T> | undefined = undefined

    private constructor(private matcher?: DiffMatcher<T>) {
        super();
    }

    static make<T>(matcher?: DiffMatcher<T> | any): any {
        return new BindMatcher(matcher ? matchMaker(matcher) : undefined)
    }

    mismatches(context: ContextOfValidationError, mismatched: Array<Mismatched>, actual: T): MatchResult {
        if (isUndefined(this.boundValueMatcher)) {
            if (this.matcher) {
                const result = this.matcher.mismatches(context, mismatched, actual)
                if (result.passed()) {
                    this.boundValueMatcher = matchMaker(actual);
                }
                return result
            } else {
                this.boundValueMatcher = matchMaker(actual);
                return MatchResult.good(1);
            }
        }
        return this.boundValueMatcher.mismatches(context, mismatched, actual)
        mismatched.push(Mismatched.make(context, actual, this.describe()));
        return MatchResult.wasExpected(actual, this.describe(), 1, 0);
    }

    describe(): any {
        if (this.boundValueMatcher) {
            return {boundTo: this.boundValueMatcher.describe()};
        }
        if (this.matcher) {
            return {boundTo: this.matcher.describe()};
        }
        return {boundTo: undefined};
    }
}