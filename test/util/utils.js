'use strict';
module.exports = {
  mockAdminUserSession(app) {
    app.mockSession({
      userId: 1,
      role: 'admin',
    });
  },
  mockGeneralUsers(app) {
    app.mockSession({
      userId: 99,
      role: 'general',
    });
  },
};
