'using strict';

const bcrypt = require('bcrypt');
const BCRYPT_SALTROUNDS = require('../settings.json').BCRYPT_SALTROUNDS;
const jwt = require('jsonwebtoken');
const TOKEN_RANDOM_SECRET = require('../settings.json').TOKEN_RANDOM_SECRET;

const Applicant = require('../models/applicant').model;
const ApplicantStatusEnum = require('../models/applicantStatus');
const Process = require('../models/process').model;

const signinForm = require('./signin-form.json');

// TODO add dynamically the choices for the campaign
exports.getSigninForm = (req, res, next) => {
  const today = new Date();
  Process.find({
    deadline: {$gt : today }
  }).then((processes) => {
    const campaigns = processes.map(p => p.label);
    signinForm[1].questions[0].choices = campaigns;
  });
  res.status(201).json(signinForm);
};

// TODO
exports.createApplicant = (req, res, next) => {
  const body = req.body;
  const campaignIndex = body[1].questions[0].answer;
  const campaign = body[1].questions[0].choices[campaignIndex];
  const name = body[2].questions[0].answer;
  const password = body[2].questions[1].answer;
  const mailAddress = body[3].questions[0].answer;
  const phoneNumber = body[3].questions[1].answer;

  Process.findOne({
    label: campaign
  }).then(process => {
    bcrypt.hash(password, BCRYPT_SALTROUNDS).then((hash) => {
      // TODO crypt password
      // TODO add process corresponding to this campaign
      const applicant = new Applicant({
        campaign: campaign,
        name: name,
        password: hash,
        mailAddress: mailAddress,
        phoneNumber: phoneNumber,
        status: 'pending',
        process: process,
      });
      applicant.save().then(() => {
        res.status(201).json({
          message: 'Applicant created successfully'
        });
      }).catch((error) => {
        res.status(500).json({
          error: error
        });
      });
    }).catch((error) => {
      res.status(503).json({
        error: {message: "An unknown error occured. Please contact the administrator of this website."}
      });
    });
  }).catch((error) => {
    res.status(503).json({
      error: {message: "An unknown error occured. Please contact the administrator of this website."}
    });
  });
};

// TODO generate token
// 401 Unauthorized error
exports.login = (req, res, next) => {
  console.log(req.body);
  const mailAddress = req.body.mail;
  const password = req.body.password;
  Applicant.findOne({
    mailAddress: mailAddress
  }).then((applicant) => {
    if (!applicant) {
      return res.status(401).json({
        error: {message: 'User or password is incorrect'}
      });
    }
    bcrypt.compare(password, applicant.password).then((valid) => {
      if (!valid) {
        return res.status(401).json({
          error: {message: 'User or password is incorrect'}
        });
      }
      const token = jwt.sign({ applicantId: applicant._id }, TOKEN_RANDOM_SECRET, { expiresIn: '24h' });
      res.status(200).json({
        id: applicant._id,
        token: token
      });
    }).catch((error) => {
      res.status(500).json({
        error: error
      });
    });
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

exports.getApplicant = (req, res, next) => {
  Applicant.findOne({
    _id: req.params.id
  }).then((applicant) => {
    applicant.password = undefined;
    res.status(200).json(applicant);
  }).catch((error) => {
    res.status(500).json({
      error: error
    });
  });
};

// TODO
exports.editApplicantStep = (req, res, next) => {
  console.log('TODO edit applicant step');
  res.status(200);
};

// TODO
exports.getApplicantStep = (req, res, next) => {
  console.log('TODO get applicant step');
  res.status(200);
};