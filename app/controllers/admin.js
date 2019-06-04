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
            pageTitle: 'Puggy Wrap API - Functions',
            path: '/functions',
            isAuthenticated: true,
            functions: functions,
            noFunc_msg: 'No results match your search'
        });
        // const url = require('url'); // built-in utility
        // res.redirect(url.parse(req.url).pathname);
    } else {
        res.render('functions/functions', {
            pageTitle: 'Puggy Wrap API - Functions',
            path: '/functions',
            isAuthenticated: true,
            functions: functions,
            noFunc_msg: 'There seems to be no functions yet...'
        });
    }

};

/**
 * ADD FUNCTION
 */

exports.getAddFunction = async(req, res, next) => {
    // Get Dependencies from DB
    const dependencies = await ApiFunction.findAll();
    if (!dependencies) {
        throw new Error('Error getting dependencies!');
    }

    res.render('functions/add-function', {
        pageTitle: 'Puggy Wrap API - Add Function',
        path: '/add_function',
        isAuthenticated: true,
        errorMessage: '',
        dependencies: dependencies
    });
}

exports.postAddFunction = async(req, res, next) => {
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