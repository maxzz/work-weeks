class out {
    static print(s) {
        console.log(s);
    }
}
function main() {
    let FOR_YEAR = '2019';
    const ms1day = 1000 * 60 * 60 * 24;
    const ms4days = ms1day * 4; // i.e. Monday + the rest 4 working days
    const ms7days = ms1day * 7;
    let d = +new Date(+FOR_YEAR - 1, 11, 31 - 6); // get prev week
    // get first Monday
    let firstMonday;
    for (let i = 0; i < 7; i++) {
        d += ms1day;
        let currD = new Date(d);
        if (currD.getDay() === 1 /*Monday*/) {
            firstMonday = +new Date(currD);
            break;
        }
    }
    let options = {
        year: '2-digit',
        day: '2-digit',
        month: '2-digit'
    };
    let currentMonth = -1;
    let prevWeekD2Year;
    for (let i = 0; i < 52 + 2; i++) {
        let d1 = new Date(firstMonday);
        let d2 = new Date(firstMonday + ms4days);
        let m = d2.getMonth(); // d2 is starting month
        if (m !== currentMonth) {
            let y1 = d1.getFullYear();
            let y2 = d2.getFullYear();
            let theLastIsSameYear = i === 0 || (y2 === prevWeekD2Year && y1 === y2);
            if (theLastIsSameYear) {
                out.print(`:${i + 1}`);
            }
        }
        let ds1 = d1.toLocaleDateString('en-US', options);
        let ds2 = d2.toLocaleDateString('en-US', options);
        let s = `${ds1} - ${ds2} ${m + 1}`.replace(/\//g, '.');
        out.print(s);
        if (m < currentMonth) {
            break; // the next year begins
        }
        currentMonth = m;
        prevWeekD2Year = d2.getFullYear();
        firstMonday += ms7days;
    }
    // for (let i = 0; i < 365 + 6 + 6; i++) {
    //     d += msPerDay;
    //     let currD = new Date(d);
    //     currD = currD.toLocaleDateString('en-US', {
    //         year: '2-digit',
    //         day: '2-digit',
    //         month: '2-digit'
    //     })
    //     out.print(currD);
    // }
}
main();
//# sourceMappingURL=index.js.map