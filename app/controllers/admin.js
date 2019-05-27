const ApiFunction = require('../models/function');
const Tag = require('../models/tag');


/**
 * FUNCTIONS
 */
exports.getFunctions = async(req, res, next) => {
    const functions = await ApiFunction.findAll();
    if (!functions) {
        throw new Error('Error getting all functions!');
    }

    res.render('functions/functions', {
        pageTitle: 'Puggy Wrap API - Functions',
        path: '/functions',
        isAuthenticated: true,
        functions: functions
    });
};

/**
 * ADD FUNCTION
 */

exports.getAddFunction = (req, res, next) => {
    res.render('functions/add-function', {
        pageTitle: 'Puggy Wrap API - Add Function',
        path: '/add_function',
        isAuthenticated: true,
        errorMessage: ''
    });
}

exports.postAddFunction = async(req, res, next) => {
    const { name, description, function_code, dependencies } = req.body;
    let tags = req.body.tags;
    tags = tags.replace(/\s/g, '').split(',');
    //Add User function to db
    const newFunction = await ApiFunction.create({
        name: name,
        description: description,
        function_code: function_code
    });
    if (!newFunction) {
        throw new Error('An error occured while creating function!');
    }
    // Add tags to db table
    tags.forEach(async tag => {
        newTag = await Tag.create({ name: tag });
        if (!newTag) {
            throw new Error('An error occured while creating tags')
        }
    });
    //Look for dependencies
    if (dependencies) { // are there dependencies?
        // Add dependencies to intermediate table
    }

    // Render Account Page
    res.redirect('/admin/functions');

};