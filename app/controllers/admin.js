const ApiFunction = require('../models/function');
const Version = require('../models/version');
const User = require('../models/user');
const Dependency = require('../models/dependency');


/**
 * FUNCTIONS
 */
exports.getFunctions = async(req, res, next) => {
    let functions = await ApiFunction.findAll({include: [{
        model: Version,
        order: [
          ['version', 'desc']
        ],
        limit: 1,
        attributes: ['version', 'function_code']
      }]});
    if (!functions) {
        throw new Error('Error getting all functions!');
    }
    if (req.query.searchText) {
        const search = req.query.searchText;
        functions = functions.filter(f => {
            return f.id == search ||
                f.name.includes(search) ||
                f.description.includes(search) ||
                f.tags.includes(search);
        });
        res.render('functions/functions', {
            pageTitle: 'Puggy Wrap API - Functions',
            path: '/functions',
            isAuthenticated: req.session.isLoggedIn,
            functions: functions,
            noFunc_msg: 'No results match your search'
        });
        // const url = require('url'); // built-in utility
        // res.redirect(url.parse(req.url).pathname);
    } else {
        res.render('functions/functions', {
            pageTitle: 'Puggy Wrap API - Functions',
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
    const dependencies = await ApiFunction.findAll({include: [{
        model: Version,
        order: [
          ['version', 'desc']
        ],
        limit: 1
      }]});
    if (!dependencies) {
        throw new Error('Error getting dependencies!');
    }

    res.render('functions/add-function', {
        pageTitle: 'Puggy Wrap API - Add Function',
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
        tags,
        userId: req.user.id
    });
    if (!newFunction) {
        throw new Error('An error occured while creating function!');
    }
    const version = await Version.create({
        function_code,
        version: 1,
        functionId: newFunction.id
    });
    if(!version) {
        throw new Error('An error occured while creating function!');
    }
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

exports.getEditFunction = async(req, res, _) => {
    const function_code = req.body.function_code;
    const functions = await ApiFunction.findOne({
        where: {function_code : function_code}
    });
    if (!functions) {
        throw new Error('Error getting the function!');
    }
    //render Edit Page
    res.render('functions/update-function', {
        pageTitle: 'Puggy Wrap API - Edit Function',
        path: '/edit_function',
        isAuthenticated: true,
        functions: functions
    });
};

exports.putEditFunction = async(req, res, _) => {
    const { name, description, function_code } = req.body;
    const newFunction = await ApiFunction.update({
        name: name,
        description: description,
        function_code: function_code
    });

    if (!newFunction) {
        throw new Error('An error occured while creating function!');
    }
    
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
        pageTitle: 'Puggy Wrap API - Function Details',
        path: '/details',
        isAuthenticated: true,
        funcion: funcion
    });
};