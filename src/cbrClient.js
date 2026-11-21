const soap = require('soap');
const dayjs = require('dayjs');
const { parseCbrRates, parseCbrEnum, parseCbrDynamic } = require('./parsers');

const CBR_WSDL = 'https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';
const CBR_ENDPOINT = 'https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx';

let cbrClient = null;

async function getCbrClient() {
  if (!cbrClient) {
    cbrClient = await soap.createClientAsync(CBR_WSDL);
    cbrClient.setEndpoint(CBR_ENDPOINT);
  }
  return cbrClient;
}

async function getValutes() {
  console.log(" [CBR] Запрос курсов валют...");
  const client = await getCbrClient();

  const [ratesResult] = await client.GetCursOnDateXMLAsync({
    On_date: new Date().toISOString(),
  });

  const [enumResult] = await client.EnumValutesXMLAsync({
    Seld: false,
  });

  const rates = parseCbrRates(ratesResult);
  const dictionary = parseCbrEnum(enumResult);

  return rates.map((r) => {
    const match = dictionary[r.charCode] || dictionary[r.numCode];
    return {
      code: match ? match.code : r.charCode,
      name: match ? match.name : r.name,
      value: r.value,
    };
  });
}

async function getValute({ code, dateFrom, dateTo }) {
  console.log(` [CBR] Запрос динамики для ${code}...`);
  const client = await getCbrClient();

  const from = dayjs(dateFrom).toISOString();
  const to = dayjs(dateTo).toISOString();

  const [dynamicResult] = await client.GetCursDynamicXMLAsync({
    FromDate: from,
    ToDate: to,
    ValutaCode: code,
  });

  const rows = parseCbrDynamic(dynamicResult);

  return rows.map((r) => ({
    date: dayjs(r.date).format('DD.MM.YYYY'),
    value: r.value,
  }));
}

module.exports = { getValutes, getValute };