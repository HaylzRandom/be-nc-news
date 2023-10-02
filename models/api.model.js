const { readFile } = require('fs/promises');

exports.getAllEndpoints = () => {
  return readFile(`${__dirname}/../endpoints.json`, 'utf-8').then((file) => {
    const parsedEndpoints = JSON.parse(file);
    return parsedEndpoints;
  });
};
