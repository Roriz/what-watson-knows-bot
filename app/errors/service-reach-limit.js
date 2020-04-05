
module.exports = class ServiceReachLimit extends Error {
  constructor(serviceName) {
    super(`${serviceName} has reach the limit. Sorry :(`);
    this.name = 'ServiceReachLimit';
  }
};
