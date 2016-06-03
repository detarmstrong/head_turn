var cheerio = require('cheerio'),
    fs = require('fs'),
    path = require('path');
const folderPath = './images';
const files = fs.readdirSync(folderPath);
files
  .filter(f => f.endsWith('.svg'))
  .forEach(f => {
    const writePath = path.join(folderPath, f);
    const svgText = fs.readFileSync(writePath, 'utf8');
    const $ = cheerio.load(svgText, {xmlMode: true});
    const viewBoxValue = $('svg').attr('viewbox');
    // well this sucks. cheerio downcases attributes, so I have to
    // declare them explicitly here
    $('svg')
      .attr('preserveAspectRatio', 'xMidYMin meet')
      .attr('viewBox', viewBoxValue);
    fs.writeFile(writePath, $.html());
  });