import { formatMonths, getWeeks } from './weeks-generator';

function main() {
    function showHelp() {
        console.log('work-weeks prints out work weeks for year.\nProvide a valid 4 digit number for year to print out.');
    }
    
        let year = Number(process.argv.slice(2)[0] || new Date().getFullYear());
    if (isNaN(year)) {
        showHelp();
        return -1;
    }

    let months = getWeeks(year);
    let s = formatMonths(months);
    console.log(s);
}

main();
