var uri = require('url')
  , util = require('util')
  , OAuth2Strategy = require('passport-oauth2')
  , InternalOAuthError = require('passport-oauth2').InternalOAuthError


baseUri = 'https://api.producthunt.com/v1/'

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || baseUri + 'oauth/authorize';
  options.tokenURL = options.tokenURL || baseUri + 'oauth/token';
  options.scopeSeparator = options.scopeSeparator || ' ';

  OAuth2Strategy.call(this, options, verify);

  this.name = 'product-hunt';
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  this._oauth2.get(baseUri + 'me', accessToken, function (err, body, res) {
    if (err) {
      error = JSON.parse(err.data);
      return done(new Error(error.error_description));
    }

    var profile = {};
    try {
      profile = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    profile.provider = 'product-hunt';
    done(null, profile);
  });
};

module.exports = Strategy;
