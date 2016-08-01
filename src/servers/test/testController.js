/**
 * Created by raychen on 16/7/14.
 */

export var home = (req, res) => {
  console.log(req.query);
  res.send('Hello world test');
};

export var test_login = (req, res) => {
  res.send(
  `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <title>Title</title>
    </head>
    <body>
      <a href='https://github.com/login/oauth/authorize?scope=user%20public_repo&client_id=d310933db63d64f563a0'>test</a>
    </body>
    </html>
    `);
};
