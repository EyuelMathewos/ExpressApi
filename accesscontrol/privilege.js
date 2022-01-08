const AccessControl = require('accesscontrol');
let grantArray = [{
    role: 'admin',
    resource: 'user',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'user',
    action: 'read:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'user',
    action: 'update:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'user',
    action: 'delete:any',
    attributes: '*'
  }
]

const privileges = new AccessControl(grantArray);
module.exports = privileges;