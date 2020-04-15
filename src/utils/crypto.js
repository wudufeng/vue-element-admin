import MD5 from 'crypto-js/md5'
export function loginCrypto(str) {
  const cryptoPrefix = '!@#'
  const cryptoSuffix = '#@!*&^'
  return MD5(cryptoPrefix + str + cryptoSuffix).toString()
}
