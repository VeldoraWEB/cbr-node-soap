const cbrClient = require('./cbrClient');

const service = {
  CbrProxyService: {
    CbrProxyPort: {
      getValutes: async () => {
        try {
          const json = JSON.stringify(await cbrClient.getValutes());
          return { json };
        } catch (e) {
          console.error("Ошибка в getValutes:", e.message);
          return { json: "[]" };
        }
      },
      getValute: async (args) => {
        try {
          const json = JSON.stringify(await cbrClient.getValute(args));
          return { json };
        } catch (e) {
          console.error("Ошибка в getValute:", e.message);
          return { json: "[]" };
        }
      },
    },
  },
};

module.exports = service;