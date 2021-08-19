import User from '@models/User'

test('it should be ok', () => {
  const user = new User()

  user.name = 'André'

  expect(user.name).toEqual('André')
})
