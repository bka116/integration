const { create } = require('xmlbuilder2');

function convertToXML(participant) {
  const doc = create({ version: '1.0' })
    .ele('Participant')
      .ele('FullName').txt(participant.fullName).up()
      .ele('BirthDate').txt(participant.birthDate).up()
      .ele('Role').txt(participant.role).up()
      .ele('Email').txt(participant.email).up()
      .ele('Phone').txt(participant.phone).up()
      .ele('Source').txt(participant.source || 'json').up() // 👈 добавляем тег Source
    .up();

  return doc.end({ prettyPrint: true });
}

module.exports = convertToXML;
