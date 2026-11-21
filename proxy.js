const express = require('express');
const soap = require('soap');
const fs = require('fs');
const service = require('./src/soapService');

const app = express();
const wsdl = fs.readFileSync('./service.wsdl', 'utf8');

app.listen(8000, () => {
  console.log("=========================================");
  console.log("=== HTTP СЕРВЕР ЗАПУЩЕН НА ПОРТУ 8000 ===");
  
  soap.listen(app, '/soap', service, wsdl, () => {
    console.log("=== SOAP СЕРВЕР ГОТОВ. ЖДЕМ ЗАПРОСОВ ===");
    console.log("=========================================");
  });
});