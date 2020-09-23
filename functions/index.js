const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


//http request
// exports.randomNumber = functions.https.onRequest((request, response) => {
//   const number = Math.round(Math.random() * 100);
//   response.send(number.toString());
// })

//callable functions
// exports.sayHello = functions.https.onCall((data, context) => {
//     return `hello ninjas`;
// });

//auth trigger (new user signup)
exports.newUserSignup = functions.auth.user().onCreate(user => {
  return admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    upvotedOn: []
  });
});

exports.userDeleted = functions.auth.user().onDelete(user => {
 const doc = admin.firestore().collection('users').doc(user.uid);
 return doc.delete();
})

exports.addRequest = functions.https.onCall((data, context) => {
 if(!context.auth){
   throw new functions.https.HttpsError(
     'unauthenticated',
     'Only authenticated users can add request'
   )
 }
 if(data.text.length > 30) {
  throw new functions.https.HttpsError(
    'invalid-argument',
    'Request must no more than be 30 characters long'
  )
 }
 return admin.firestore().collection('requests').add({
   text: data.text,
   upvotes: 0
 })
})



