var proxy = require('express-http-proxy');
var app = require('express')();

app.use(
  '/api',
  proxy('https://localhost:808', {
    userResHeaderDecorator: (headers, userReq) => {
      return {
        ...headers,
        'Access-Control-Allow-Origin': userReq.get('origin'),
        'Access-Control-Allow-Credentials': 'true'
      };
    },
  }),
);

console.log("Start on 8080");
app.listen(8080);
