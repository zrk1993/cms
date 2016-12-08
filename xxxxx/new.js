var readline = require('readline');
var fs = require("fs") ;
var pagename = null;

//创建readline接口实例
var  rl = readline.createInterface({
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


  var basehtml=`<!DOCTYPE html>
<html>
  <head>
    <title>base page</title>
    <meta charset="utf-8"/>
    <meta name='description' content='CNode：Node.js专业中文社区'>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="keywords" content="nodejs, node, express, connect, socket.io"/>  
    <meta name="author" content="EDP@TaoBao" />  
    <link rel="icon" href="/images/cnode_icon_32.png" type="image/x-icon"/>
    <link rel="stylesheet" type="text/css" href="css/base.css">
    <link rel="stylesheet" type="text/css" href="css/${pagename}.css">
  </head>
  <body>
    @@include('./common/head.html')
    <div>
      
    </div>
    @@include('./common/food.html')
    <script type="text/javascript" src='js/${pagename}.js'></script>
  </body>
</html>`;

  fs.writeFile(__dirname + `/html/${pagename}.html`, basehtml, {flag: 'a'}, function (err) {
     if(err) {
      console.error(err);
      } else {
         console.log(`创建${pagename}.html`);
      }
  });

  fs.writeFile(__dirname + `/css/${pagename}.css`, '', {flag: 'a'}, function (err) {
     if(err) {
      console.error(err);
      } else {
         console.log(`创建${pagename}.css`);
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


