const AccessControl = require('accesscontrol');
let grantArray = [
  {
    role: 'admin',
    resource: 'Account',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'Account',
    action: 'read:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'Account',
    action: 'update:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'Account',
    action: 'delete:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'accessTokens',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'accessTokens',
    action: 'read:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'accessTokens',
    action: 'update:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'accessTokens',
    action: 'delete:any',
    attributes: '*'
  }
  ,
  {
    role: 'admin',
    resource: 'maintenance',
    action: 'create:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'maintenance',
    action: 'read:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'maintenance',
    action: 'update:any',
    attributes: '*'
  },
  {
    role: 'admin',
    resource: 'maintenance',
    action: 'delete:any',
    attributes: '*'
  }
]

const privileges = new AccessControl(grantArray);
module.exports = privileges;