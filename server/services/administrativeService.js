import Administrative from '../schemas/administrative'

async function createUpdateAdministrative(administrative) {
    const query = {}
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    return await Administrative.findOneAndUpdate(query, administrative, options)
}

async function getAdministrative() {
    return await Administrative.findOne({})
}

export { createUpdateAdministrative, getAdministrative }