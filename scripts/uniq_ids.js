var cheerio = require('cheerio'),
    fs = require('fs');

//SHIT cheerio has a bug and it'll downcase all the 
// attribute names in svg, including viewBox and preserveAspectRatio
// breaking those in hard to find ways!
const files = fs.readdirSync('../images');
files
  .filter(f => f.endsWith('.svg'))
  .forEach(f => {
    const svgText = fs.readFileSync(f, 'utf8');
    const $ = cheerio.load(svgText);
    const ids = $('[id]').toArray().map(i => i.attribs.id);
    const key = f.split('.')[0];
    const processed = ids.reduce((html, id) =>
                                    html.replace(new RegExp(id, 'g'),
                                                 `${id}_${key}`),
                                 $.html());
    fs.writeFile(`__${f}`, processed);
  });