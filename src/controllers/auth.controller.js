const { createAuthCredentials } = require('../helpers/general-tools')

module.exports.login = async (req, res) => {
  await createAuthCredentials(req, res, { id: 1, uuid: '39b2bf982bb9e-nwiue1.asd', role: 'admin' })

  return res.returnRes(200, 'Logado com sucesso!')
}
