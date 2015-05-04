module.exports = {
  facebook: {
    appId: '1594707767440171',
    appSecret: 'insertsecret!',
    routing: {
      appRouter: 'api/user/authenticate/facebook',
      //This needs to be adaptive
      appCallback: 'http://localhost:8000'+'api/auth/facebook/callback',
      successRedirect: '',
      failureRedirect: '',
    }, 
    profileFields: [
      'id',
      'username',
      'name',
      'gender',
      'emails',
      'photos'
    ]
  },
  errors: {
    notFound: 'No Such User',
    asinExists: 'User Already Subscribed To Product',
    asinNotFound: 'User Is Not Subscribed To Product',
    asinSave: 'Failed To Update Subscription',
    asinRemove: 'Failed To Remove Subscription',
    noSuchProduct: 'No Such Product Found',
    deactivate: 'Could Not Deactivate Account',
    reactivate: 'Could Not Reactivate Account'
  }
}

