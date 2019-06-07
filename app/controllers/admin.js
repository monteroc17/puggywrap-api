const ApiFunction = require('../models/function');
const User = require('../models/user');
const Dependency = require('../models/dependency');


/**
 * FUNCTIONS
 */
exports.getFunctions = async(req, res, next) => {
    let functions = await ApiFunction.findAll();
    if (!functions) {
        throw new Error('Error getting all functions!');
    }
    if (req.query.searchText) {
        const search = req.query.searchText;
        functions = functions.filter(f => {
            return f.id == search ||
                f.name.includes(search) ||
                f.description.includes(search) ||
                f.function_code.includes(search) ||
                f.tags.includes(search);
        });
        res.render('functions/functions', {
            pageTitle: 'PuggyWrap API - Functions',
            path: '/functions',
            isAuthenticated: req.session.isLoggedIn,
            functions: functions,
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
            noFunc_msg: 'There seems to be no functions yet...'
        });
    }

};

/**
 * ADD FUNCTION
 */

exports.getAddFunction = async (req, res, next) => {
    // Get Dependencies from DB
    const dependencies = await ApiFunction.findAll();
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

exports.postAddFunction = async (req, res, next) => {
    const { name, description, function_code, dependencies } = req.body;
    let tags = req.body.tags;
    tags = tags.replace(/\s/g, '') //.split(',');
        //Add User function to db
    const newFunction = await ApiFunction.create({
        name,
        description,
        function_code,
        tags,
        userId: req.user.id
    });
    if (!newFunction) {
        throw new Error('An error occured while creating function!');
    }
    // Add tags to db table
    // tags.forEach(async tag => {
    //     newTag = await Tag.create({ name: tag });
    //     if (!newTag) {
    //         throw new Error('An error occured while creating tags');
    //     }
    // });
    //Look for dependencies
    if (dependencies) { // are there dependencies?
        if (typeof dependencies === 'array') {
            // Add dependencies to intermediate table
            dependencies.forEach(async dependency => {
                newDep = await Dependency.create({
                    parent_id: newFunction.id, // get current function id
                    dependency_id: dependency
                });
            });
        } else {
            newDep = await Dependency.create({
                parent_id: newFunction.id, // get current function id
                dependency_id: dependencies
            });
        }
        if (!newDep) {
            throw new Error('An error occured while adding dependencies');
        }
    }

    // Render Account Page
    res.redirect('/admin/functions');

};

/**
 * UPDATE FUNCTION
 */

exports.getSingleFunction = async (req, res, _) => {
    const function_code = req.body.function_code;
    const functions = await ApiFunction.find({
        function_code: function_code
    });
    if (!functions) {
        throw new Error('Error getting the function!');
    }

    res.render('functions/update-function', {
        pageTitle: 'PuggyWrap API - Edit Function',
        path: '/edit_function',
        isAuthenticated: true,
        functions: functions
    });
};

exports.putSingleFunction = async (req, res, _) => {
    const { name, description, function_code, dependencies } = req.body;

    res.redirect(`/admin/function/${function_code}`);
};

/**
 * DETAILS FUNCTION
 */

exports.getFunctionDetails = (req, res, next) => {

    // This const variable was created just for testing a function's details view
    const funcion =
    {
        id: 1,
        name: 'A function name',
        description: 'A description',
        function_code: 'let a = 0;',
        userID: req.params.functionID
    };

    res.render('functions/details-function', {
        pageTitle: 'PuggyWrap API - Function Details',
        path: '/details',
        isAuthenticated: true,
        funcion: funcion
    });
};