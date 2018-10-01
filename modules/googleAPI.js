const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


class GoogleAPI {

  constructor(whichDay, spreadsheetId) {
    this.whichDay = whichDay;
    this.spreadsheetId = spreadsheetId;
    // If modifying these scopes, delete token.json.
    this.scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
    this.token_path = './google_api_credentials/token.json';
  }

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */

  authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    let token = fs.readFileSync(this.token_path);
    if (!token) return this.getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    return this.getAttendence(oAuth2Client);
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */

  getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: this.scopes,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error while trying to retrieve access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(this.token_path, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', this.token_path);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
   */

  getAttendence(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    const promiseAfterAttendence = new Promise(function(resolve, reject) {
      sheets.spreadsheets.values.batchGet({
        spreadsheetId: this.spreadsheetId,
        ranges: [
          'C:C', 'D:D', this.whichDay
        ],
        majorDimension: 'COLUMNS'
      }, (err, res) => {
        let data = [];
        if (err) return console.log('The API returned an error: ' + err);
        const objects = res.data.valueRanges;
        objects.forEach((obj) => {
          data.push(obj.values[0]);
        });
        if (this.whichDay !== "J:J") {
          resolve(data);
        } else {
          fs.truncateSync("./files/prevPairs.txt", 0);
          resolve(data);
        }
      });
    }.bind(this));
    return promiseAfterAttendence;
  }
}

module.exports = GoogleAPI;
