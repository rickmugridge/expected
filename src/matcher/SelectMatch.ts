import {matchMaker} from "../matchMaker/matchMaker";
import {MatchResult} from "../MatchResult";
import {ContextOfValidationError, DiffMatcher} from "./DiffMatcher";
import {Mismatched} from "./Mismatched";
import {exceptionMessage} from "../prettyPrint/PrettyPrinter";

export class SelectMatcher<T> extends DiffMatcher<T> {
    private constructor(private selector: (t: T) => T) {
        super()
    }

    mismatches(context: ContextOfValidationError, mismatched: Array<Mismatched>, actual: T): MatchResult {
        let selected: T
        try {
            selected = this.selector(actual)
        } catch (e) {
            const actualAndException = {actual, exception: exceptionMessage(e)};
            mismatched.push(Mismatched.makeExpectedMessage(context, actualAndException, this.describe()));
            return MatchResult.wasExpected(actualAndException, this.describe(), 1, 0);
        }
        const matcher = matchMaker(selected)
        return matcher.mismatches(context, mismatched, actual)
    }

    describe(): any {
        return "selectMatch selector to return a suitable value/matcher"
    }

    static make<T>(selector: (t: T) => T): any {
        return new SelectMatcher(selector);
    }
}