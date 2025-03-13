const normalizeId = (req, res, next) => {
    const oldJson = res.json;

    res.json = function (data) {
        if (Array.isArray(data)) {
            data = data.map((item) => normalizeDocumentId(item));
        } else if (typeof data === "object") {
            data = normalizeDocumentId(data);
        }
        oldJson.call(this, data);
    };

    next();
};

// Helper Function to Replace `_id` with `id`
const normalizeDocumentId = (doc) => {
    if (doc && doc._id) {
        doc.id = doc._id.toString();
        delete doc._id;
    }
    return doc;
};

module.exports = normalizeId;
