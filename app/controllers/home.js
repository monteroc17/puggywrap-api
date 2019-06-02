const fs = require('fs');
const ApiFunction = require('../models/function');

exports.getGetStarted = (req, res, next) => {
    res.render('getting_started/getting_started', {
        pageTitle: 'Puggy Wrap API - Getting Started',
        path: '/getting_started',
        isAuthenticated: true
    });
};

exports.getFunctionFile = async(req, res, next) => { //returns the function as a JS file
    const functionID = req.params.functionID;
    const func = await ApiFunction.findByPk(functionID);
    if (!func) {
        throw new Error('Function does not exist!');
    }
    let stream = fs.createWriteStream(`${global.__basedir}/app/util/dynamic-js/${func.name}.js`, { flags: 'a' });
    stream.write(func.function_code);
    //include dependencies
    stream.end();
    const file = `${global.__basedir}/app/util/dynamic-js/${func.name}.js`;
    res.download(file);
};
exports.getFunctionCode = async(req, res, next) => { //returns the function code
    const functionID = req.params.functionID;
    const func = await ApiFunction.findByPk(functionID);
    if (!func) {
        throw new Error('Function does not exist!');
    }
    const FILE_PATH = `${global.__basedir}/app/util/dynamic-js/${func.name}.js`;
    let stream = fs.createWriteStream(FILE_PATH, { flags: 'a' });
    stream.write(func.function_code);
    //include dependencies
    stream.end();
    fs.readFile(FILE_PATH, { encoding: 'utf-8' }, (err, data) => {
        console.log('reading...');
        if (!err) {
            res.type('.js');
            res.send(data);
            fs.unlink(FILE_PATH, err => {
                if (err) throw new Error(err);
                console.log('file deleted!');
            });
        }
    });
};