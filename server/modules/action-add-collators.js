var insertCollators = require('./insert-collators.js');
/**
 * Creates one or more filter collators.
 * @name Action: Add Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
function actionAddCollators(DEBUG, CONNECTION, req, res) {
    'use strict';
    var collators = [], collator, tcol = {}, filters = [], filter;
    if (Array.isArray(req.body.collators)) {
        for (collator of req.body.collators) {
            if (typeof collator.id === "string") {
                tcol.id = collator.id;
            }
            if (typeof collator.name === "string" && collator.name.length) {
                tcol.name = collator.name;
            }
            if (Array.isArray(collator.filters)) {
                for (filter of collator.filters) {
                    if (typeof filter === 'string' && filters.indexOf(filter) === -1) {
                        filters.push(filter);
                    }
                }
            }
            tcol.filters = filters;
            collators.push(tcol);
        }
    }
    insertCollators(CONNECTION, collators, (err, inserted) => {
        if(err) {
            res.send( { err:"Unable to create collators." } );
            if (DEBUG) console.log(err);
        } else {
            res.send({});
            if (DEBUG) console.log("Created collators.");
        }
    })
}
module.exports = actionAddCollators;
