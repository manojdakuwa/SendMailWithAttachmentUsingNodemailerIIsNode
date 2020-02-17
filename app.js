    const express= require('express');
    const cors=require('cors');
    const http=require('http');
    const https=require('https');
    const path = require('path');
    const app=express();
    const nodemailer=require('nodemailer');
    const bodyParser=require('body-parser');
    var smtpTransport=require('nodemailer-smtp-transport');
    const port =process.env.PORT||3005;
    app.all("/*",function(req, res, next){
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Length,X-Requested-With');
       next();
    });
    app.use(bodyParser.json({limit: '150mb'}));
    app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));
    app.listen(port,()=>{
        console.log("The server is running on port "+port+"!!!!!!!!!!!");
    });

    app.get("/",(req,res)=>{res.send("<h1>Hello</h1>")})

    app.post("/SendMailwithAttachment",(req,res)=>{
    console.log("Inside the sendMail");
        console.log("request came");
        let _mailvalue=req.body;
        let RefVal=_mailvalue.RefNo;
        console.log("calling sendmail");
        var mail = nodemailer.createTransport(
          smtpTransport({
          service: 'gmail',
          host: "smtp.gmail.com",
          port: 587,
          secure:true,
          secureProtocol: "TLSv1_method",
          auth: {
            user: 'manoj@econshipping.com',
            pass: '******'//your password
          }
        }));
       var mailOptions = {
        from: 'manoj@econshipping.com',
        to: _mailvalue.To,
        subject: 'Subject',
        text: 'textual subject',
        html:'',
        attachments: [
                //{
                  // encoded string as an attachment
                //     filename: 'text1.txt',
                //     content: 'aGVsbG8gd29ybGQh',
                //     encoding: 'base64'
                // },
                {   // data uri as an attachment
                    filename: _mailvalue.RefNo+'.png',
                    path: _mailvalue.att
                }
            ]
        }
         var Emailutil=
         {
           SendMail: mail.sendMail(mailOptions, function(error, info){
           console.log("reached inside mail.sendMail function")
             if (error) {
                console.log(error);
                res.sendStatus(500);
                //res.write(info);
                res.json(info.response);
             } else {
                //res.sendStatus(200);
                //response.statusCode = 200;
		//res.write(info);
                res.json(info.response);
                console.log('Email sent: ' + info.response);
             }
            //callback(info);
           })
        }
        module.exports= app;
        mail.close();//shut down the connection pool, no more messages.  Comment this line out to continue sending emails.
    });
    
   