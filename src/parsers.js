const { XMLParser } = require('fast-xml-parser');

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: true,
  trimValues: true,
});

function ensureObject(data) {
  if (!data) return null;
  if (typeof data === 'string' && data.trim().startsWith('<')) {
    return parser.parse(data);
  }
  return data;
}

function parseCbrRates(rawData) {
  const obj = ensureObject(rawData);
  if (!obj) return [];
  
  const dataNode = obj.ValuteData || obj.GetCursOnDateXMLResult?.ValuteData || obj;
  let items = dataNode.ValuteCursOnDate || [];
  if (!Array.isArray(items)) items = [items];

  return items.filter(Boolean).map((item) => {
    const vnom = Number(item.Vnom || 1);
    const vcurs = Number(item.Vcurs || 0);
    return { 
      numCode: String(item.Vcode || ''),
      charCode: String(item.VchCode || ''),
      name: String(item.Vname || ''), 
      value: vnom > 1 ? vcurs / vnom : vcurs 
    };
  });
}

function parseCbrEnum(rawData) {
  const obj = ensureObject(rawData);
  if (!obj) return {};
  
  const dataNode = obj.ValuteData || obj.EnumValutesXMLResult?.ValuteData || obj;
  let items = dataNode.EnumValutes || [];
  if (!Array.isArray(items)) items = [items];

  const map = {};
  for (const item of items) {
    if (!item) continue;
    const rCode = String(item.Vcode || '');
    const name = String(item.Vname || '');
    const numCode = String(item.VcommonCode || '').replace(/^0+/, '');
    const charCode = String(item.VcharCode || '');

    if (numCode) map[numCode] = { code: rCode, name: name };
    if (charCode) map[charCode] = { code: rCode, name: name };
  }
  return map;
}

function parseCbrDynamic(rawData) {
  const obj = ensureObject(rawData);
  if (!obj) return [];
  
  const dataNode = obj.ValuteData || obj.GetCursDynamicXMLResult?.ValuteData || obj;
  let items = dataNode.ValuteCursDynamic || [];
  if (!Array.isArray(items)) items = [items];

  return items.filter(Boolean).map((item) => {
    const vnom = Number(item.Vnom || 1);
    const vcurs = Number(item.Vcurs || 0);
    return { 
      date: item.CursDate || item.Date || '', 
      value: vnom > 1 ? vcurs / vnom : vcurs 
    };
  });
}

module.exports = {
  parseCbrRates,
  parseCbrEnum,
  parseCbrDynamic
};