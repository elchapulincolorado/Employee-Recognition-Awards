'use strict';
//path
const path = require('path');
const { join, resolve } =path
const absolutePath = path.join(__dirname,'../');

//library
const nodemailer = require('nodemailer');
const award =require('../award/awardObject.js')
//database
const AwardDao = require('../dao');
const AppRepository = require('../app_repository');

//global object to share among functions


//createMail(7);


//TODO:create a gmail accnt with hidden details in file

function createMail(id){
const moment =require('../node_modules/moment')


const resultAwardInfo ={}
return appRepo.getAward(id)
 .then(user => {
   resultAwardInfo.award_id = id;
   resultAwardInfo.recipient_name =user.recipient_name
    resultAwardInfo.recipient_email =user.recipient_email
    resultAwardInfo.award_type =user.award_type
    resultAwardInfo.creation_time =moment(user.creation_time)
    .format('MMM Do, YYYY')
    resultAwardInfo.creator_id =user.creator_id
    return getCreator(resultAwardInfo, id)
})

}


function getCreator(obj, id){

  return appRepo.getUserById(obj.creator_id)
  .then(cName => {
      obj.creator_name = cName.name
      obj.creator_email=cName.email
    //  mailAwardObj = obj;
    console.log("EMAIL AND NAME", obj.creator_email, obj.creator_name);
    //send to wrapper function
    transportWrapper(obj, id);
  })
//console.log(mailAwardObj);
}


// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
//nodemailer.createTestAccount((err, account) => {
/*
* function: transportWrapper
*  @params: obj --award info;  id--award id number
*  Description: defines mail content; attaches pdf; and mails pdf to gemail
*/
function transportWrapper(obj, id){
  //hide the credentials in a file
  const gmail =require(absolutePath +'award/gmail.js')

    // create reusable object that is able to send mail
    let transporter = nodemailer.createTransport({
      //hostname or IP addr to connect to

        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        requireTLS: true,
        auth: {
            user: gmail.Username, // generated ethereal user
            pass: gmail.password // generated ethereal password
        }
    });

    // setup email configuration
    //from, to, cc, bcc, subjet, text, html, attachments
    var subjectLine= obj.recipient_name +"'s Employee of the " +obj.award_type+ " Award"

    let mailOptions = {
      //  from: creatorEmail '<creatorEmail@haha>', // sender address
        to: '<web3MailPdf@gmail.com>', // list of receivers
        subject: subjectLine, // Subject line
        text: 'Congratulations!', // plain text body optional
        //use html to embed images with "cid" value
        html: 'Embedded image: <img src="cid:picture@hah@2a.com"/>', // html body
        //setup the pdf attachment here
  attachments: [{
		filename: id+'.pdf',
		path: absolutePath+'award/'+id+'.pdf'},
    //cid: <same as cid value in html
//  {//filename, path, cid
{
		filename: 'test.png',
		path: absolutePath+'award/'+'test.png',
    cid: 'picture@hah@2a.com'
	}

]
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        //console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        //console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

    });
    transporter.close();
//});
};

module.exports = createMail;