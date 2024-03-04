export const getArgs = () => {
    const res = {};
    const [exe, file, ...args] = process.argv;
    args.forEach((elem, index) => {
        if (elem.charAt(0) === '-') {
            if (index === args.length-1) {
                res[elem.slice(1,)] = true;
            } else if (args[index+1].charAt(0) !== '-') {
                res[elem.slice(1,)] = args[index+1];
            } else {
                res[elem.slice(1,)] = true;
            }
        }
    });
    return res;
}