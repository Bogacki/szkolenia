function checkIfLogged(req) {
  return req.cookies["_logged"] ? true : false;
}
function logout(res) {
  res.clearCookie("_logged");
}

module.exports = {
  checkIfLogged,
  logout,
};
