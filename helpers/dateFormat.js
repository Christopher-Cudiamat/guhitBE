const dateFormat = require('dateformat');

module.exports = {
  formatedNewDate: () => {
    return dateFormat(new Date(), "mmm dd yyyy" )
  }
}