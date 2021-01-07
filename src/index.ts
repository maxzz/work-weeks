class out {
    static buffer: string = '';

    static print(s: any) {
        this.buffer += s + '\n';
    }
}

type RawWeek = {
    start: Date; // as usual Monday
    end: Date;   // as usual Friday
}

type RawMonth = {
    month: Date;
    weeks: RawWeek[];
}

class Months {
    raw: RawMonth[] = [];

    addMonth(month: Date) {
        this.raw.push({
            month,
            weeks: []
        });
    }
    addWeek(start: Date, end: Date) {
        this.raw[this.raw.length - 1].weeks.push({ start, end });
    }
}

function getWeeks(forYear: number): string {
    const DATE_FORMAT = { year: '2-digit', day: '2-digit', month: '2-digit' };
    const SEPARATOR = `${'/'.repeat(78)}`;
    const ms1day = 1000 * 60 * 60 * 24;
    const ms4days = ms1day * 4; // i.e. Monday + the rest 4 working days
    const ms7days = ms1day * 7;

    let firstMonday: number = getFirstMonday();
    let prevWeekD2Year: number;
    let currentMonth = -1;

    const months = new Months();

    for (let week = 0; week < 52 + 2; week++) {
        let d1 = new Date(firstMonday);
        let d2 = new Date(firstMonday + ms4days);

        let m = d2.getMonth(); // d2 is starting month

        if (m !== currentMonth) {
            let y1 = d1.getFullYear();
            let y2 = d2.getFullYear();

            let theLastIsSameYear = week === 0 || (y2 === prevWeekD2Year && y1 === y2);
            if (theLastIsSameYear) {
                out.print(`\n${SEPARATOR}\n${zeros(m + 1, 2, '0')} ${getMonthName(d2)}\n${SEPARATOR}`);
                months.addMonth(d2);
            }
        }

        let ds1 = d1.toLocaleDateString('en-US', DATE_FORMAT);
        let ds2 = d2.toLocaleDateString('en-US', DATE_FORMAT);
        
        let s = `${ds1} - ${ds2}`.replace(/\//g, '.');
        out.print(s);
        months.addWeek(d1, d2);

        if (m < currentMonth) {
            break; // the next year begins
        }
        currentMonth = m;

        prevWeekD2Year = d2.getFullYear();
        firstMonday += ms7days;
    }

    return out.buffer;

    function getFirstMonday() {
        let d = +new Date(forYear - 1, 11, 31 - 6); // get prev week

        let firstMonday: number;
        for (let i = 0; i < 7; i++) {
            d += ms1day;
    
            let currD = new Date(d);
            if (currD.getDay() === 1/*Monday*/) {
                firstMonday = +new Date(currD);
                break;
            }
        }
        return firstMonday;
    }

    function getMonthName(d: Date): string {
        return d.toLocaleDateString('en-US', { month: 'long' });
    }

    function zeros(num: number, nTo: number, fillChar: string = ' ') {
        const n = ''+num;
        return fillChar.repeat(nTo - n.length <= 0 ? 0 : nTo - n.length) + n;
    }
}

function main() {
    let FOR_YEAR = '2021';

    let s = getWeeks(+FOR_YEAR);
    console.log(s);
}

main();
