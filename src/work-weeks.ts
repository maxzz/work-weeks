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
   
    const MS_1DAY = 1000 * 60 * 60 * 24;
    const MS_4DAYS = MS_1DAY * 4;
    const MS_7DAYS = MS_1DAY * 7;

    let thisWeekMonday: number = getFirstMonday(forYear);
    let prevWeekD2Year: number;
    let currentMonth = -1;

    const rv = new Months(forYear);

    for (let week = 0; week < 52 + 2; week++) { // +2 for one week past year and one week for the next year
        let thisWeekDayMon = new Date(thisWeekMonday);
        let thisWeekDayFri = new Date(thisWeekMonday + MS_4DAYS); // i.e. Monday + the rest 4 working days

        let thisWeekFriMouth = thisWeekDayFri.getMonth(); // thisWeekDayFri is starting month

        if (thisWeekFriMouth !== currentMonth) {
            let thisWeekMonYear = thisWeekDayMon.getFullYear();
            let thisWeekFriYear = thisWeekDayFri.getFullYear();

            let theLastIsSameYear = week === 0 || (thisWeekFriYear === prevWeekD2Year && thisWeekMonYear === thisWeekFriYear);
            if (theLastIsSameYear) {
                rv.addMonth(thisWeekFriMouth, thisWeekDayFri);
            }
        }

        rv.addWeek(thisWeekDayMon, thisWeekDayFri);

        let isNextYear = thisWeekFriMouth < currentMonth && rv.raw.length > 50; // the next year begins
        if (isNextYear) {
            break;
        }
        currentMonth = thisWeekFriMouth;

        prevWeekD2Year = thisWeekDayFri.getFullYear();
        thisWeekMonday += MS_7DAYS;
    }

    return rv;

    function getFirstMonday(forYear: number): number {
        let currentDay = +new Date(forYear - 1, 11, 31 - 6); // get the last week of December in the previous year

        let firstMonday: number;
        for (let i = 0; i < 7; i++) {
            currentDay += MS_1DAY;
    
            let thisDay = new Date(currentDay);
            let isMonday = thisDay.getDay() === 1/*Monday*/;
            if (isMonday) {
                firstMonday = +new Date(thisDay);
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
