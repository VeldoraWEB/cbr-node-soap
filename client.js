const soap = require('soap');

async function main() {
  const url = 'http://localhost:8000/soap?wsdl';
  const client = await soap.createClientAsync(url);

  const [valutesResult] = await client.getValutesAsync({ dummy: '' });
  const valutes = JSON.parse(valutesResult.json);

  console.log('=== Курсы валют ===');
  console.log(valutes.slice(0, 5)); 
  console.log(`Всего валют: ${valutes.length}`);

  const [valuteResult] = await client.getValuteAsync({
    code: 'R01235',
    dateFrom: '2026-11-10', //сюда вписывайте свои даты, я делал на эти числа, поэтому взял такие
    dateTo: '2026-11-20',
  });
  const dynamics = JSON.parse(valuteResult.json);

  console.log('\n=== Динамика USD ===');
  console.log(dynamics);
}

main().catch((err) => {
  console.error('Ошибка:', err);
});