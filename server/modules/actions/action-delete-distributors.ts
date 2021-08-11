import {deleteDistributors} from "../delete-distributors";

/**
 * Delete one or more packet distributors.
 * @name Action: Delete Distributors
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export async function actionDeleteDistributors(DEBUG, CONNECTION, req, res) {
    if (!Array.isArray(req.body.ids))
        return {err: "No list of IDs provided."};
    for (const id of req.body.ids)
        if (typeof id != 'string' || id.length > 55)
            return {err: 'Invalid (non-string) ID provided.'};
    try {
        const deleted = await deleteDistributors(CONNECTION, req.body.ids);
        console.log('Deleted distributors.', deleted);
        return {};
    } catch (err) {
        console.error(err);
        return {err: 'Unable to delete distributors.'};
    }
}

module.exports = actionDeleteDistributors;
