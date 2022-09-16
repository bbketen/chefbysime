var http = require("http");
var mysql = require("mysql");
const express = require("express");
const port= process.env.PORT || 5000;
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
let sql;



var con = mysql.createConnection({
    host: "sql11.freemysqlhosting.net",
    user: "sql11520252",
    password: "1234",
    database: "dVEC1Jraix"
  });

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  app.use((req,res,next)=>{
      res.header('Access-Control-Allow-Headers, *, Access-Control-Allow-Origin', 'Origin, X-Requested-with, Content_Type,Accept,Authorization','http://localhost:4200');
      if(req.method === 'OPTIONS') {
          res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
          return res.status(200).json({});
      }
      next();
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  
  /*con.query(sql,function(err,result) {
    if(err){
        throw err;
    } 
    console.log(JSON.stringify(result));
  });*/

  app.get("/api/getUrun", (req, res) => {
    sql="SELECT * FROM urunler order by urun_id desc";
    con.query(sql,function(err,result) {
        if(err){
            throw err;
        } 
        res.send(result);
      });
  });

  app.get("/api/getYemekDetay/:id",(req,res) => {
    sql=`select u.urun_adi,CONCAT(y.urun_adet,' ',u.urun_olcu) as urun_malzeme from urunler u, urun_yemek y where u.urun_id = y.urun_id and y.yemek_id = ${req.params.id}`;
    console.log(sql);
    con.query(sql,function(err,result) {
          if(err){
              throw err;
          } 
          console.log(result);
          res.send(result);
    });
});

  app.post("/api/setUrun", (req, res) => {
    console.log(req.body);
    if(req.body.urun_adi && req.body.urun_olcu){
      sql=`INSERT INTO urunler(urun_adi,urun_olcu) VALUES('${req.body.urun_adi}','${req.body.urun_olcu}')`;
      con.query(sql,function(err,result) {
          if(err){
              throw err;
          } 
          console.log(result);
          result.message = "Kayıt Başarılı";
          res.send(result);
      });
    } else{
      res.send("Ürünler Boş");
      console.log("hata");
    }
  });

  app.post("/api/updUrun", (req, res) => {
    console.log(req.body);
    if(req.body.urun_adi && req.body.urun_olcu && req.body.urun_id){
      sql=`UPDATE urunler SET urun_adi='${req.body.urun_adi}',urun_olcu='${req.body.urun_olcu}' WHERE urun_id=${req.body.urun_id}`;
      console.log(sql);
      con.query(sql,function(err,result) {
          if(err){
              throw err;
          } 
          console.log(result);
          result.message = "Güncelleme Başarılı";
          res.send(result);
      });
    } else{
      res.send("Ürünler Boş");
      console.log("hata");
    }
  });

  app.get("/api/getYemek", (req, res) => {
    sql="select y.*, u.yemek_malzemeleri from yemekler y,(SELECT uy.yemek_id,GROUP_CONCAT(u.urun_adi) as yemek_malzemeleri from urun_yemek uy,urunler u where u.urun_id=uy.urun_id group by uy.yemek_id) as u where u.yemek_id = y.yemek_id order by y.yemek_id desc;";
    con.query(sql,function(err,result) {
        if(err){
            throw err;
        } 
        res.send(result);
      });
  });

  app.post("/api/setYemek", (req, res) => {
    console.log(req.body);
    if(req.body.yemek_adi && req.body.yemek_aciklamasi){
      sql=`INSERT INTO yemekler(yemek_adi,yemek_aciklamasi) VALUES('${req.body.yemek_adi}','${req.body.yemek_aciklamasi}')`;
      con.query(sql,function(err,result) {
          if(err){
              throw err;
          } 
          console.log(result);
          result.message = "Kayıt Başarılı";
          res.send(result);
      });
    } else{
      res.send("Yemekler Boş");
      console.log("hata");
    }
  });

  app.post("/api/updYemek", (req, res) => {
    console.log(req.body);
    if(req.body.yemek_adi && req.body.yemek_aciklamasi && req.body.yemek_id){
      sql=`UPDATE yemekler SET yemek_adi='${req.body.yemek_adi}',yemek_aciklamasi='${req.body.yemek_aciklamasi}' WHERE yemek_id=${req.body.yemek_id}`;
      console.log(sql);
      con.query(sql,function(err,result) {
          if(err){
              throw err;
          } 
          console.log(result);
          result.message = "Güncelleme Başarılı";
          res.send(result);
      });
    } else{
      res.send("Ürünler Boş");
      console.log("hata");
    }
  });
  
  app.post("/api/setyemekurun", (req, res) => {
    console.log(req.body);
    var temp = JSON.parse(req.body.data);
    let i=0;
    sql = "INSERT INTO urun_yemek(yemek_id,urun_id,urun_adet) VALUES";
    temp.forEach(element => {
      if(element.yemek_id && element.urun_id && element.urun_adet){
        if(i == temp.length -1){
          sql += `(${element.yemek_id},${element.urun_id},${element.urun_adet})`;
        } else{
          sql += `(${element.yemek_id},${element.urun_id},${element.urun_adet}),`;
        }
      }
      i++;
    });
        console.log(sql);
        con.query(sql,function(err,result) {
            if(err){
                throw err;
            } 
            console.log(result);
            result.message = "Güncelleme Başarılı";
            res.send(result);
      });
  });

  app.post("/api/setMenu", (req, res) => {
    console.log(req.body);
    if(req.body.menu_adi && req.body.menu_tarihi && req.body.kisi_sayisi){
      sql=`INSERT INTO menuler(menu_adi,menu_tarihi,kisi_sayisi) VALUES('${req.body.menu_adi}','${new Date(req.body.menu_tarihi).toLocaleDateString('en-CA')}','${req.body.kisi_sayisi}')`;
      con.query(sql,function(err,result) {
          if(err){
              throw err;
          } 
          console.log(result);
          result.message = "Kayıt Başarılı";
          res.send(result);
      });
    } else{
      res.send("Menüler Boş");
      console.log("hata");
    }
  });

  
  app.get("/api/getMenu", (req, res) => {
    sql="select m.*, y.menu_yemekleri from menuler m,(SELECT my.menu_id,GROUP_CONCAT(y.yemek_adi) as menu_yemekleri from menu_yemek my,yemekler y where y.yemek_id=my.yemek_id group by my.menu_id) as y where y.menu_id = m.menu_id order by m.menu_id desc;";
    con.query(sql,function(err,result) {
        if(err){
            throw err;
        } 
        res.send(result);
      });
  });

  app.post("/api/updMenu", (req, res) => {
    console.log(req.body);
    if(req.body.menu_adi && req.body.menu_tarihi && req.body.menu_id && req.body.kisi_sayisi){
      sql=`UPDATE menuler SET menu_adi='${req.body.menu_adi}',menu_tarihi='${req.body.menu_tarihi}', kisi_sayisi='${req.body.kisi_sayisi}' WHERE menu_id=${req.body.menu_id}`;
      console.log(sql);
      con.query(sql,function(err,result) {
          if(err){
              throw err;
          } 
          console.log(result);
          result.message = "Güncelleme Başarılı";
          res.send(result);
      });
    } else{
      res.send("Menüler Boş");
      console.log("hata");
    }
  });

  app.get("/api/getYemekMenu", (req, res) => {
    sql="Select * From yemekler";
    con.query(sql,function(err,result) {
        if(err){
            throw err;
        } 
        res.send(result);
      });
  });

  app.post("/api/setyemekmenu", (req, res) => {
    console.log(req.body);
    var temp = JSON.parse(req.body.data);
    console.log(temp);
    let i=0;
    sql = "INSERT INTO menu_yemek(menu_id,yemek_id) VALUES";
    temp.forEach(element => {
      if(element.yemek_id && element.menu_id){
        if(i == temp.length -1){
          sql += `(${element.menu_id},${element.yemek_id})`;
        } else{
          sql += `(${element.menu_id},${element.yemek_id}),`;
        }
      }
      i++;
    });
        console.log(sql);
        con.query(sql,function(err,result) {
            if(err){
                throw err;
            } 
            console.log(result);
            result.message = "Güncelleme Başarılı";
            res.send(result);
      });
  });

  app.get("/api/getSonMenuYemek/:id", (req, res) => {
    sql=`select * from menuler m, menu_yemek my, yemekler y where m.menu_id=${req.params.id} and m.menu_id=my.menu_id and my.yemek_id=y.yemek_id`;
    con.query(sql,function(err,result) {
        if(err){
            throw err;
        } 
        res.send(result);
      });
  });

  app.get("/api/getSonMenuUrun/:id", (req, res) => {
    sql=`select * from yemekler y, urun_yemek uy, urunler u where y.yemek_id=${req.params.id} and y.yemek_id=uy.yemek_id and u.urun_id = uy.urun_id`;
    con.query(sql,function(err,result) {
        if(err){
            throw err;
        } 
        res.send(result);
      });
  });

  app.get("/api/getMenuTotal/:id",(req,res) => {
    sql=`SELECT m.menu_id,u.urun_adi,sum(uy.urun_adet) as toplam_urun, u.urun_olcu FROM menu_yemek my, menuler m, yemekler y, urunler u, urun_yemek uy where my.menu_id=m.menu_id and y.yemek_id = my.yemek_id and uy.urun_id=u.urun_id and uy.yemek_id = y.yemek_id and m.menu_id=${req.params.id} group by u.urun_id,u.urun_adi,m.menu_id;`
    con.query(sql,function(err,result) {
      if(err){
          throw err;
      } 
      console.log(result);
      res.send(result);
    });
  })

  app.delete("/api/deleteMenu/:id", (req,res) => {
    sql=`DELETE from menuler WHERE menu_id = ${req.params.id}`;
    con.query(sql,function(err,result) {
      if(err){
          throw err;
      } 
    });
    sql=`DELETE from menu_yemek WHERE menu_id = ${req.params.id}`;
    con.query(sql,function(err,result) {
      if(err){
          throw err;
      } 
      result.message = "Silme Başarılı";
      res.send(result);
    });
  })

  app.delete("/api/deleteYemek/:id", (req,res) => {
    sql=`DELETE from yemekler WHERE yemek_id = ${req.params.id}`;
    con.query(sql,function(err,result) {
      if(err){
          throw err;
      } 
    });
    sql=`DELETE from urun_yemek WHERE yemek_id = ${req.params.id}`;
    con.query(sql,function(err,result) {
      if(err){
          throw err;
      } 
      console.log(result);
      result.message = "Silme Başarılı";
      res.send(result);
    });
  })


  app.delete("/api/deleteUrun/:id", (req,res) => {
    sql=`DELETE from urunler WHERE urun_id = ${req.params.id}`;
    con.query(sql,function(err,result) {
      if(err){
          throw err;
      } 
      console.log(result);
      result.message = "Silme Başarılı";
      res.send(result);
    });
  })


  

/*http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);*/

// Console will print the message
app.listen(port, () => {
    console.log(`localhost:${port} -> üzerinden apiye ulaşabilirsiniz !!! `);
  });


  /*
  select y.*,(SELECT uy.yemek_id,GROUP_CONCAT(uy.urun_id) from urun_yemek uy,urunler u where u.urun_id=uy.urun_id and uy.yemek_id = y.yemek_id group by uy.yemek_id) from yemekler y
  */