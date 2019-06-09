const ApiFunction = require('../models/function');
const Version = require('../models/version');
const User = require('../models/user');
const Dependency = require('../models/dependency');


/**
 * FUNCTIONS
 */
exports.getFunctions = async(req, res, next) => {
    let functions = await ApiFunction.findAll({
        include: [{
                model: Version,
                order: [
                    ['version', 'desc']
                ],
                limit: 1,
                attributes: ['version', 'function_code']
            },
            {
                model: User,
                attributes: ['name']
            }
        ]
    });
    if (!functions) {
        throw new Error('Error getting all functions!');
    }
    if (req.query.searchText) {
        let search = req.query.searchText;
        if (search.includes(':')) {
            search = search.split(':');
            console.log(search);
            value = search[1].toLowerCase();
            functions = functions.filter(f => {
                let result = '';
                if (search[0] === 'code') result = f[search[0]].values[0].toLowerCase().includes(value);
                else if (search[0] === 'user') result = f[search[0]].user.name.toLowerCase().includes(value);
                else result = f[search[0]].toLowerCase().includes(value);
                return result;
            });

        } else {
            functions = functions.filter(f => {
                return f.id == search ||
                    f.name.includes(search) ||
                    f.description.includes(search) ||
                    f.tags.includes(search);
            });
        }
        res.render('functions/functions', {
            pageTitle: 'PuggyWrap API - Functions',
            path: '/functions',
            isAuthenticated: req.session.isLoggedIn,
            functions: functions,
            isCreator: false,
            noFunc_msg: 'No results match your search'
        });
        // const url = require('url'); // built-in utility
        // res.redirect(url.parse(req.url).pathname);
    } else {
        res.render('functions/functions', {
            pageTitle: 'PuggyWrap API - Functions',
            path: '/functions',
            isAuthenticated: req.session.isLoggedIn,
            functions: functions,
            isCreator: false,
            noFunc_msg: 'There seems to be no functions yet...'
        });
    }

};
exports.getMyFunctions = async(req, res, next) => {
    let functions = await ApiFunction.findAll({
        include: [{
                model: Version,
                order: [
                    ['version', 'desc']
                ],
                limit: 1,
                attributes: ['version', 'function_code']
            },
            {
                model: User,
                attributes: ['name']
            }
        ]
    });
    if (!functions) {
        throw new Error('Error getting all functions!');
    }
    if (req.query.searchText) {
        let search = req.query.searchText;
        if (search.includes(':')) {
            search = search.split(':');
            value = search[1].toLowerCase();
            functions = functions.filter(f => {
                let result = search[0] === 'code' ?
                    f[search[0]].values[0].toLowerCase().includes(value) :
                    f[search[0]].toLowerCase().includes(value);
                return result;
            });

        } else {
            functions = functions.filter(f => {
                return f.id == search ||
                    f.name.includes(search) ||
                    f.description.includes(search) ||
                    f.tags.includes(search);
            });
        }
        res.render('functions/functions', {
            pageTitle: 'PuggyWrap API - Functions',
            path: '/functions',
            isAuthenticated: req.session.isLoggedIn,
            functions: functions,
            isCreator: false,
            noFunc_msg: 'No results match your search'
        });
        // const url = require('url'); // built-in utility
        // res.redirect(url.parse(req.url).pathname);
    } else {
        res.render('functions/functions', {
            pageTitle: 'Puggy Wrap API - My Functions',
            path: '/functions',
            isAuthenticated: req.session.isLoggedIn,
            functions: functions,
            isCreator: true,
            noFunc_msg: 'There seems to be no functions yet...'
        });
    }

};

/**
 * ADD FUNCTION
 */

exports.getAddFunction = async(req, res, next) => {
    // Get Dependencies from DB
    const dependencies = await ApiFunction.findAll({
        include: [{
            model: Version,
            order: [
                ['version', 'desc']
            ],
            limit: 1
        }]
    });
    if (!dependencies) {
        throw new Error('Error getting dependencies!');
    }

    res.render('functions/add-function', {
        pageTitle: 'PuggyWrap API - Add Function',
        path: '/add_function',
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: '',
        dependencies: dependencies
    });
}

exports.postAddFunction = async(req, res, next) => {
    const {
        name,
        description,
        function_code,
        dependencies
    } = req.body;
    let tags = req.body.tags;
    tags = tags.replace(/\s/g, '') //.split(',');
        //Add User function to db
    const newFunction = await ApiFunction.create({
        name,
        description,
        tags,
        userId: req.session.user.id
    });
    if (!newFunction) {
        throw new Error('versionerror occured while creating function!');
    }
    const version = await Version.create({
        function_code,
        version: 1,
        functionId: newFunction.id
    });
    if (!version) {
        throw new Error('An error occured while creating function!');
    }
    //Look for dependencies
    if (dependencies) { // are there dependencies?
        if (Array.isArray(dependencies)) {
            var numberDependencies = dependencies.map(Number);
            // Add dependencies to intermediate table
            numberDependencies.forEach(async dependency => {
                const newDep = await Dependency.create({
                    parent_id: dependency, // get current function id
                    dependency_id: newFunction.id
                });
                if (!newDep) {
                    throw new Error('An error occured while adding dependencies');
                }
            });
        } else {
            const newDep = await Dependency.create({
                parent_id: dependencies, // get current function id
                dependency_id: newFunction.id
            });
            if (!newDep) {
                throw new Error('An error occured while adding dependencies');
            }
        }
    }

    // Render Account Page
    res.redirect('/admin/functions');

};

/**
 * UPDATE FUNCTION
 */

exports.getEditFunction = async(req, res, _) => {
    const id = req.params.functionID;
    const editableFunction = await ApiFunction.findOne({
        where: {
            id: id
        },
        include: [{
            model: Version,
            order: [
                ['version', 'DESC']
            ],
            limit: 1
        }]
    });
    if (!editableFunction) {
        throw new Error('Error getting the function!');
    }
    res.render('functions/update-function', {
        pageTitle: 'PuggyWrap API - Edit Function',
        path: '/edit_function',
        isAuthenticated: true,
        editableFunction: editableFunction,
        version: editableFunction.versions[0]
    });
};

exports.postEditFunction = async(req, res, _) => {
    const { name, id, version, description, function_code } = req.body;
    const updateFunction = await ApiFunction.update({
        name: name,
        description: description
    }, {
        where: {
            id: id
        }
    });
    if (!updateFunction) {
        throw new Error('versionerror occured while creating function!');
    }
    const newVersion = await Version.create({
        function_code,
        version: parseInt(version) + 1,
        functionId: id
    });
    if (!newVersion) {
        throw new Error('An error occured while creating version!');
    }

    res.redirect(`/admin/function/${function_code}`);
};

/**
 * DETAILS FUNCTION
 */

exports.getFunctionDetails = async(req, res, next) => {
    const backURL = req.header('Referer') || '/admin/functions';
    const id = req.params.functionID;
    const functionDetails = await ApiFunction.findOne({
        where: {
            id: id
        },
        include: [{
                model: Version,
                order: [
                    ['version', 'DESC']
                ],
                limit: 1,
                attributes: ['version', 'function_code']
            },
            {
                model: User,
                attributes: ['name']
            }
        ]
    });
    if (!functionDetails) {
        throw new Error('Error getting the function!');
    }
    res.render('functions/details-function', {
        pageTitle: 'PuggyWrap API - Function Details',
        path: '/details',
        previous_page: backURL,
        isAuthenticated: true,
        functionDetails: functionDetails,
        version: functionDetails.versions[0]
    });
};