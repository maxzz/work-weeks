type RawWeek = {
    start: Date; // as usual Monday
    end: Date;   // as usual Friday
}

type RawMonth = {
    numb: number; // [1..12]
    month: Date;
    weeks: RawWeek[];
}

class Months {
    raw: RawMonth[] = [];
    yaer: number; // like 2021

    constructor(year: number) {
        this.yaer = year;
    }

    addMonth(numb: number, month: Date) {
        this.raw.push({
            numb,
            month,
            weeks: []
        });
    }
    addWeek(start: Date, end: Date) {
        this.raw[this.raw.length - 1].weeks.push({ start, end });
    }
}

export function getWeeks(forYear: number): Months {
   
    const ms1day = 1000 * 60 * 60 * 24;
    const ms4days = ms1day * 4; // i.e. Monday + the rest 4 working days
    const ms7days = ms1day * 7;

    let firstMonday: number = getFirstMonday(forYear);
    let prevWeekD2Year: number;
    let currentMonth = -1;

    const months = new Months(forYear);

    for (let week = 0; week < 52 + 2; week++) {
        let d1 = new Date(firstMonday);
        let d2 = new Date(firstMonday + ms4days);

        let m = d2.getMonth(); // d2 is starting month

        if (m !== currentMonth) {
            let y1 = d1.getFullYear();
            let y2 = d2.getFullYear();

            let theLastIsSameYear = week === 0 || (y2 === prevWeekD2Year && y1 === y2);
            if (theLastIsSameYear) {
                months.addMonth(m, d2);
            }
        }

        months.addWeek(d1, d2);

        if (m < currentMonth) {
            break; // the next year begins
        }
        currentMonth = m;

        prevWeekD2Year = d2.getFullYear();
        firstMonday += ms7days;
    }

    return months;

    function getFirstMonday(forYear: number) {
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
}

export function formatMonths(months: Months): string {
    class out {
        static buffer: string = `Happy New Year ${months.yaer}\n`;
    
        static print(s: any) {
            this.buffer += s + '\n';
        }
    }
    
    const DATE_FORMAT = { year: '2-digit', day: '2-digit', month: '2-digit' } as Intl.DateTimeFormatOptions;
    const SEPARATOR = `${'/'.repeat(78)}`;

    function getMonthName(d: Date): string {
        return d.toLocaleDateString('en-US', { month: 'long' });
    }

    function zeros(num: number, nTo: number, fillChar: string = ' ') {
        const n = ''+num;
        return fillChar.repeat(nTo - n.length <= 0 ? 0 : nTo - n.length) + n;
    }

    months.raw.forEach(month => {
        out.print(`\n${SEPARATOR}\n${zeros(month.numb + 1, 2, '0')} ${getMonthName(month.month)}\n${SEPARATOR}`);

        month.weeks.forEach(week => {
            let ds1 = week.start.toLocaleDateString('en-US', DATE_FORMAT);
            let ds2 = week.end.toLocaleDateString('en-US', DATE_FORMAT);
            
            let s = `${ds1} - ${ds2}`.replace(/\//g, '.');
            out.print(s);
        });
    });
    
    return out.buffer;
}
