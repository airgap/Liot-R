import {deleteCollators} from '../delete-collators';

/**
 * Delete one or more filter collators. Exposed to API.
 * @name Action: Delete Collators
 * @function
 * @param {boolean} DEBUG - enable verbose logging
 * @param {object} CONNECTION - connection to the RethinkDB database
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export async function actionDeleteCollators({ids}, r) {
    if (!Array.isArray(ids))
        return {err: "No list of IDs provided."};
    for (const id of ids) if (typeof id != 'string' || id.length > 55)
        return {err: 'Invalid (non-string) ID provided.'}
    try {
        const collators = await deleteCollators(r, ids);
        console.log('Deleted collators.', collators);
        return {collators: collators};
    } catch (err) {
        return {err: 'Unable to delete collators.'};
    }
}
