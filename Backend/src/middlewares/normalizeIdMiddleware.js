const normalizeId = (req, res, next) => {
    const oldJson = res.json;
  
    res.json = function (data) {
      // Don't touch response if already sent
      if (res.headersSent) {
        return;
      }
  
      if (Array.isArray(data)) {
        data = data.map(normalizeDocumentId);
      } else if (typeof data === "object" && data !== null) {
        data = normalizeDocumentId(data);
      }
  
      return oldJson.call(this, data);
    };
  
    next();
  };
  
  // Helper
  const normalizeDocumentId = (doc) => {
    if (doc && doc._id) {
      doc.id = doc._id.toString();
      delete doc._id;
    }
    return doc;
  };
  
  module.exports = normalizeId;
  