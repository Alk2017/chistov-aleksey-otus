const fs = require('fs')
const path = require('path')



function getFilesList(dirPath, depth) {
    const pathsList = [];
    fs.readdirSync(dirPath).forEach(file => {
        const filepath = path.join(dirPath, file);
        const stat = fs.statSync(filepath);
        let pathAsList = filepath.split('/')
        if (pathAsList.length-1 <= depth) {
            if (stat.isDirectory()) {
                pathsList.push(pathAsList);
                pathsList.push(...getFilesList(filepath, depth));
            } else {
                pathsList.push(pathAsList);
            }
        }
    });
    return pathsList;
}

function printTree(ls) {
    if (ls.length === 0) {
        return;
    }
    res = []
    res.push(ls[0][0]);
    prefix = [];
    prefix.push('|');
    ls.forEach(l => {
        let depth = l.slice(1).length
        if (depth > 1) {
            [...Array(depth-1)].forEach((_) => prefix.push(' |'))
        }
        prefix.push('---');
        res.push(prefix.join('').concat(l.slice(-1)));
        prefix.pop();
        if (depth > 1) {
            [...Array(depth-1)].forEach((_) => prefix.pop())
        }


    })
    res.forEach(l => {
        console.log(l);
    })
}

const args = process.argv.slice(2);

if (args.length > 2 && args[1] === '-d') {
    printTree(getFilesList(args[0], args[2]));
}
else if (args.length === 1) {
    printTree(getFilesList(args[0], 10));
}
else {
    console.log('Directory not pass');
}