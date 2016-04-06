"use strict";
var dbHost = process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost:27017/";
var dbName = process.env.OPENSHIFT_APP_NAME       || "tripList";
var dbUrl = "" + dbHost + dbName;


module.exports = function (ROOT_PATH) {
  var config = {
    server: {
      port: process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.OPENSHIFT_INTERNAL_PORT || 8080,
      hostname: process.env.OPENSHIFT_NODEJS_IP ||
                process.env.OPENSHIFT_INTERNAL_IP || '127.0.0.1',
    },
    database: {
      url: dbUrl
    },
    BaseApiURL : "http://"+process.env.HOSTNAME+":3001/api/",
    root     : ROOT_PATH,
    app      : {
      name : 'CodePal'
    },
    twitterAuth: true,
    twitter: {
      consumerKey: process.env.TWITTER_KEY || 'asa',
      consumerSecret: process.env.TWITTER_SECRET || 'asa',
      callbackURL: '/auth/twitter/callback',
      passReqToCallback: true
    },
    facebookAuth: true,
    facebook: {
      clientID: process.env.FACEBOOK_ID || 'asa',
      clientSecret: process.env.FACEBOOK_SECRET || 'asa',
      callbackURL: '/auth/facebook/callback',
      passReqToCallback: true
    },
    mailgun: {
      user: process.env.MAILGUN_USER || 'asa',
      password: process.env.MAILGUN_PASSWORD || 'asa'
    },
    phamtom : {
      retries: 3,
      width       : 1280,
      height      : 800,
      maxRenders: 50
    }
  }
  return config;
}
