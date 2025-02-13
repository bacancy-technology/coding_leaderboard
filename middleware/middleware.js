const csv = require('csvtojson');
const path = require('path');
const { envConstants } = require('../helpers/constants');
const {
  errorResponse,
} = require('../helpers/helpers');
const { errorMessages } = require('../helpers/messages');
const { LeaderboardsModel } = require('../models/leaderboard');
const { UsersModel } = require('../models/users');

const authorizationData = [];
const adminEmails = envConstants.ADMIN_EMAILS.split(',');

// Middleware for admin routes
exports.isAdmin = (req, res, next) => {
  if (adminEmails.includes(req.oidc.user.email)) {
    return next();
  }
  return res.status(403).send('Access denied');
};

exports.authentication = async (req, res, next) => {
  if (!req.oidc.isAuthenticated()) {
    return errorResponse(req, res, errorMessages.LOGIN_REQUIRED, 401);
  }

  if (!req.oidc.user.email.endsWith('@bacancy.com')) {
    return errorResponse(req, res, 'Only @bacancy.com email addresses are allowed.', 401);
  }

  if (adminEmails.includes(req.oidc.user.email)) {
    res.locals.ROLE = 'admin';
  } else {
    res.locals.ROLE = 'user';
  }

  const usersData = await UsersModel.findOneAndUpdate({ email: req.oidc.user.email }, {
    name: req.oidc.user.name,
    email: req.oidc.user.email,
    role: res.locals.ROLE,
    picture: req.oidc.user.picture,
    external_id: req.oidc.user.sub,
  }, {
    new: true,
    upsert: true,
  }).lean();

  await LeaderboardsModel.findOneAndUpdate({ usersId: usersData._id }, {}, {
    new: true,
    upsert: true,
  }).lean();

  req.user = usersData;
  res.locals.METHOD = req.method;
  res.locals.URL = req.url;

  return next();
};

const validateURL = (req, authorizeURL) => {
  const requestURL = req.originalUrl;
  let systemURL = '';
  if ((req.route.path).length > 1) {
    systemURL = req.baseUrl + req.route.path;
  } else {
    systemURL = req.baseUrl;
  }
  const policyURL = authorizeURL;
  if (requestURL === systemURL && systemURL === policyURL) return true;

  const lastSegmentRequestURL = requestURL.substring(requestURL.lastIndexOf('/') + 1);
  const lastSegmentSystemURL = systemURL.substring(systemURL.lastIndexOf('/') + 1);
  const lastSegmentPolicyURL = policyURL.substring(policyURL.lastIndexOf('/') + 1);
  if (lastSegmentRequestURL && lastSegmentSystemURL === lastSegmentPolicyURL) return true;

  return false;
};

exports.authorization = async (req, res, next) => {
  for (let i = 0; i < authorizationData.length; i += 1) {
    if (authorizationData[i].role === res.locals.ROLE) {
      if (authorizationData[i].method === res.locals.METHOD || authorizationData[i].method === '*') {
        const isValidated = validateURL(req, authorizationData[i].url);
        if (isValidated) return next();
      }
    }
  }
  return errorResponse(req, res, errorMessages.YOU_ARE_NOT_AUTHORIZED, 401);
};

exports.getROLES = async () => {
  const csvPath = path.resolve(path.join(__dirname, 'policy.csv'));

  await csv()
    .fromFile(csvPath)
    .then((jsonObj) => {
      authorizationData.push(...jsonObj);
    });
};
