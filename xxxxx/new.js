const readline = require('readline');
const fs = require("fs") ;
let pagename = null;

//创建readline接口实例
const  rl = readline.createInterface({
  input:process.stdin,
  output:process.stdout
});

rl.question("页面名是什么？",function(answer){      
  rl.close();
  pagename = answer;

  if(fs.existsSync(__dirname + `/html/${pagename}.html`)){
    console.log(`页面${pagename}已经存在`);
    process.exit(0);
  }


  let basehtml=`<!DOCTYPE html>
<html>
  <head>
    <title>base page</title>
    <meta charset="utf-8"/>
    <meta name='description' content=''>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="keywords" content=""/>  
    <meta name="author" content="" />  
    <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="../css/base.scss">
    <link rel="stylesheet" type="text/css" href="../css/${pagename}.scss">
  </head>
  <body>
    @@include('./common/head.html')
    <div>
      
    </div>
    @@include('./common/food.html')
    <script type="text/javascript" src='../js/${pagename}.js'></script>
  </body>
</html>`;

  fs.writeFile(__dirname + `/html/${pagename}.html`, basehtml, {flag: 'a'}, function (err) {
     if(err) {
      console.error(err);
      } else {
         console.log(`创建${pagename}.html`);
      }
  });

  fs.writeFile(__dirname + `/css/${pagename}.scss`, '', {flag: 'a'}, function (err) {
     if(err) {
      console.error(err);
      } else {
         console.log(`创建${pagename}.scss`);
      }
  });

  fs.writeFile(__dirname + `/js/${pagename}.js`, '', {flag: 'a'}, function (err) {
     if(err) {
      console.error(err);
      } else {
         console.log(`创建${pagename}.js`);
      }
  });

});


