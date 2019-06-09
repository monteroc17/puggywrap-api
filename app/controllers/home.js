const fs = require('fs');
const ApiFunction = require('../models/function');
const Dependencies = require('../models/dependency');
const Version = require('../models/version');

exports.getHomePage = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('home/home', {
        pageTitle: 'PuggyWrap API - Home',
        path: '/home',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getGetStarted = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render('getting_started/getting_started', {
        pageTitle: 'PuggyWrap API - Getting Started',
        path: '/getting_started',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.getFunctionFile = async(req, res, next) => { //returns the function as a JS file
    const functionID = req.params.functionID;
    const func = await ApiFunction.findOne({
        where: {
            id: functionID
        },
        include: [{
            model: Version,
            order: [
                ['version', 'desc']
            ],
            limit: 1,
            attributes: ['version', 'function_code']
        }]
    });
    if (!func) {
        throw new Error('Function does not exist!');
    }
    const FILE_PATH = `${global.__basedir}/app/util/dynamic-js/${func.name}.js`;
    let stream = fs.createWriteStream(FILE_PATH, { flags: 'a' });
    recursive([], [functionID])
        .then(data => {
            console.log('DATA: ', func.versions[0].function_code);
            data.forEach(element => {
                console.log(`DEPENDENCY(${element.name}): `, element.versions[0].function_code);
                stream.write(element.versions[0].function_code);
            });
            // console.log(func.versions[0].function_code);
            stream.write(func.versions[0].function_code);
            stream.end();
            res.download(FILE_PATH);
            fs.unlink(FILE_PATH, err => {
                if (err) throw new Error(err);
                console.log('file deleted!');
            });
        })
        .catch(err => console.log(err));
};
exports.getFunctionCode = async(req, res, next) => { //returns the function code
    const functionID = req.params.functionID;
    const func = await ApiFunction.findOne({
        where: {
            id: functionID
        },
        include: [{
            model: Version,
            order: [
                ['version', 'desc']
            ],
            limit: 1,
            attributes: ['version', 'function_code']
        }]
    });
    if (!func) {
        throw new Error(`Function does not exist! id: ${functionID}`);
    }
    const FILE_PATH = `${global.__basedir}/app/util/dynamic-js/${func.name}.js`;
    let stream = fs.createWriteStream(FILE_PATH, { flags: 'a' });
    //include dependencies
    // const result = await recursive([], [functionID]);
    // console.log('RES: ', result);
    // getDependencies(functionID)
    recursive([], [functionID])
        .then(data => {
            console.log('DATA: ', func.versions[0].function_code);
            stream.write(func.versions[0].function_code);
            data.forEach(element => {
                console.log(`DEPENDENCY(${element.name}): `, element.versions[0].function_code);
                stream.write(element.versions[0].function_code);
            });
            // console.log(func.versions[0].function_code);
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

exports.getBasicImport = (req, res, next) => {
    const FILE_PATH = `${global.__basedir}/app/util/dynamic-js/basic_import.js`;
    fs.readFile(FILE_PATH, { encoding: 'utf-8' }, (err, data) => {
        console.log('reading...');
        if (!err) {
            res.type('.js');
            res.send(data);
        }
    });
}

const recursive = async(result = new Array, IDs = new Array) => {
    if (!IDs || IDs.length === 0) {
        return result;
    }
    const id = IDs.pop();
    new_deps = await getDependencies(id);
    // console.log('RESULT SO FAR', result.map(e => e = e.id), 'IDS: ' + id, 'NEW DEPENDENCIES: ' + new_deps);
    if (typeof new_deps == 'array') {
        console.log('ES ARRAY', new_deps);
    }
    return recursive(result.concat(new_deps), IDs.concat(new_deps.map(e => e = e.id)));
}

const getDependencies = (id) => {
    return new Promise(async(resolve, reject) => {
        // console.log('LOOKING FOR DEPENCIES OF', id);
        let promesas = [];
        const dependencies = await Dependencies.findAll({ where: { dependency_id: id } });
        // console.log('FOUND THIS DEPENDENCIES: ', dependencies.map(e => e = e.parent_id));
        dependencies.forEach((d) => {
            promesas.push(ApiFunction.findOne({
                where: {
                    id: d.parent_id
                },
                include: [{
                    model: Version,
                    order: [
                        ['version', 'desc']
                    ],
                    limit: 1,
                    attributes: ['version', 'function_code']
                }]
            }));
        });
        let codes = [];
        Promise.all(promesas)
            .then(responses => {
                responses.forEach(r => { codes.push(r) });
                resolve(codes);
            })
            .catch(err => console.log(err));
    });
}