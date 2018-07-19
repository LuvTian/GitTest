import Cookies from 'js-cookie'

const TokenKey = 'MadisonToken'

export function getToken() {
  var tk = Cookies.get(TokenKey);
  return (tk ? tk : '')
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getMadisonToken() {
  var tk = Cookies.get('MadisonToken');
  return (tk ? tk : '')
}