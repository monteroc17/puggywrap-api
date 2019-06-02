const fs = require('fs');
const ApiFunction = require('../models/function');
const Dependencies = require('../models/dependency');

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
    const FILE_PATH = `${global.__basedir}/app/util/dynamic-js/${func.name}.js`;
    let stream = fs.createWriteStream(FILE_PATH, { flags: 'a' });
    stream.write(func.function_code);
    //include dependencies
    stream.end();
    res.download(FILE_PATH);
    fs.unlink(FILE_PATH, err => {
        if (err) throw new Error(err);
        console.log('file deleted!');
    });
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
    getDependencies(functionID)
        .then(data => {
            data.forEach(element => {
                stream.write(element.function_code);
            });
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
        })
        .catch(err => console.log(err));
};


const getDependencies = async(id) => {
    let promesas = [];
    const dependencies = await Dependencies.findAll({ where: { parent_id: id } });
    dependencies.forEach((d) => {
        promesas.push(ApiFunction.findByPk(d.dependency_id));
        // codes.push(dependency.function_code)
        //stream.write(dependency.function_code);
    });
    return new Promise((resolve, reject) => {
        let codes = [];
        Promise.all(promesas)
            .then(responses => {
                responses.forEach(r => { codes.push(r) });
                resolve(codes);
            })
            .catch(err => console.log(err));
    });
}