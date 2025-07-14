const fs = require('fs');
const libxmljs = require('libxmljs2');

function validateXML(xmlString, xsdPath = './participant.xsd') {
  const xsd = fs.readFileSync(xsdPath, 'utf-8');
  const xsdDoc = libxmljs.parseXml(xsd);
  const xmlDoc = libxmljs.parseXml(xmlString);

  const isValid = xmlDoc.validate(xsdDoc);
  return {
    valid: isValid,
    errors: xmlDoc.validationErrors
  };
}

module.exports = validateXML;
