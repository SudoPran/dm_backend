const dbQuery = require('./laura-db');

async function createEntry(tableName, schema, types, values) {
  valueString = "(";
  for (let i = 0; i < values.length; i++) {
    value = values[i];

    if (types[i] == 'str') {
      value = "'" + value + "'";
    }

    if (i < values.length - 1) {
      valueString += value + ", ";
    }
    else {
      valueString += value;
    }
  }
  valueString += ")";

  queryString = 'INSERT into ' + tableName + ' ' + schema + ' values ' + valueString;
  console.log(queryString);
  try {
    return await dbQuery(queryString);
  }
  catch (error) {
    return null;
  }
}

async function getEntries(tableName, fields, filter) {
  columns = ''
  if (fields && fields.length > 0) {
    for (let i = 0; i < fields.length; i++) {
      if (i < fields.length - 1) {
        columns += fields[i] + ', ';
      }
      else {
        columns += fields[i];
      }
    }
  }
  else {
    columns = '*';
  }

  queryString = 'SELECT ' + columns + ' FROM ' + tableName + ' WHERE ' + filter;
  return await dbQuery(queryString);
}

module.exports = {
  createEntry,
  getEntries
}