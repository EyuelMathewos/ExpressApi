
function Customer(fullName, phoneNo, address) {
  this.fullName = fullName;
  this.phoneNo = phoneNo;
  this.address = address;
  return {
    name: this.fullName,
    phoneNo: this.phoneNo,
    address: this.address
  };
}
module.exports = Customer;