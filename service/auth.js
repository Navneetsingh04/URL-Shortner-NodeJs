const jwt = require("jsonwebtoken");
const secret = "kjhdu$#^%@%";

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secret
  );
}

function getUser(token) {
  if (!token) return null;
  try{
    return jwt.verify(token, secret);
  }catch(error){
    return null;
  }
}
// const sessionToUserMap = new Map();

// function setUser(id, user) {
//   sessionToUserMap.set(id, user);
// }

// function getUser(id) {
//   return sessionToUserMap.get(id);
// }

module.exports = { getUser, setUser };
