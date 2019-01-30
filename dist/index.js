class out {
    static print(s) {
        console.log(s);
    }
}
function main() {
    let FOR_YEAR = '2019';
    const msPerDay = 1000 * 60 * 60 * 24;
    let d = +new Date(+FOR_YEAR - 1, 11, 31 - 6); // get prev week
    // get prev week Monday
    for (let i = 0; i < 7; i++) {
        d += msPerDay;
        let currD = new Date(d);
        if (currD.getDay() === 1) {
            out.print(currD);
        }
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