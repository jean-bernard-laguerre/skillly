describe('Login', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // Wait for the app to be ready
    await waitFor(element(by.id('loginButton')))
      .toBeVisible()
      .withTimeout(30000);
  });

  it ('should display the welcome screen', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
  });

  it('should display the login button', async () => {
    await expect(element(by.id('loginButton'))).toBeVisible();
  });

  it('should display the login screen', async () => {
    await element(by.id('loginButton')).tap();
    await waitFor(element(by.id('emailInput')))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id('emailInput'))).toBeVisible();
    await expect(element(by.id('passwordInput'))).toBeVisible();
    await expect(element(by.id('submitLoginButton'))).toBeVisible();
  });

  const failTests = [
    {title: 'Missing email', email: '', password: 'test$jdsfmlk1234!!', contains: 'Please enter a valid email address'},
    {title: 'Invalid email', email: 'test3@tessdqfjlkt.qsdflksdjm', password: 'test$jdsfmlk1234!!', contains: 'Login Failed - User Not Found'},
    {title: 'Invalid password', email: 'test3@test.tst', password : '', contains: 'Login Failed - Password Incorrect'},
  ]

  const successTests = [
    {title: 'Login successful recruteur', email: 'recruiter@mail.com', password: 'test1234', contains: 'Bienvenue, test'},
    {title: 'Login successful candidat', email: 'candidate@mail.com', password: 'test1234', contains: 'Bienvenue, test'},
  ]

  failTests.forEach(({ title, email, password, contains }) => {
    it(title, async () => {
      await Login(email, password);
      if (contains) {
        await expect(element(by.id('loginError'))).toBeVisible();
        await expect(element(by.id('loginError'))).toHaveText(contains);
      }
    });
  });
});

function Login(email, password) {
  return element(by.id('emailInput')).typeText(email)
    .then(() => element(by.id('passwordInput')).typeText(password))
    .then(() => element(by.id('submitLoginButton')).tap());
}