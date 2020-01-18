/**
 * parses and returns documents in a query snapshot as a JSON object
 * output shape:
 * {
 *   [docId]: {
 *     data
 *   },
 *   ...
 * }
 * @param {QuerySnapshot} querySnapshot firestore QuerySnapshot (https://googleapis.dev/nodejs/firestore/latest/QuerySnapshot.html)
 */
const parseQuerySnapshot = querySnapshot => {
    const output = {}
    querySnapshot.forEach(doc => {
        output[doc.id] = doc.data()
    })
    return output
}

const getAllFromCollection = collectionRef => collectionRef
    .get()
    .then(querySnapshot => parseQuerySnapshot(querySnapshot))

const getAllDocumentIds = collectionRef => collectionRef.get().then(qs => {
    const output = []
    qs.forEach(doc => output.push(doc.id))
    return output
})

module.exports = {
    parseQuerySnapshot,
    getAllFromCollection,
    getAllDocumentIds
}
