const { log } = require("detox");

describe("Login", () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
    // Wait for the app to be ready
    await waitFor(element(by.id("loginButton")))
      .toBeVisible()
      .withTimeout(30000);
  });

  it("should display the login button", async () => {
    await expect(element(by.id("loginButton"))).toBeVisible();
  });

  it("should display the login screen", async () => {
    await element(by.id("loginButton")).tap();
    await waitFor(element(by.id("emailInput")))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id("emailInput"))).toBeVisible();
    await expect(element(by.id("passwordInput"))).toBeVisible();
    await expect(element(by.id("submitLoginButton"))).toBeVisible();
  });

  const failTests = [
    {
      title: "Missing email",
      email: "",
      password: "test$jdsfmlk1234!!",
      contains: "Données invalides",
    },
    {
      title: "Invalid email",
      email: "test3@tessdqfjlkt.qsdflksdjm",
      password: "test$jdsfmlk1234!!",
      contains: "Identifiants incorrects",
    },
    {
      title: "Invalid password",
      email: "candidate@mail.com",
      password: "uyzgcuyeg",
      contains: "Identifiants incorrects",
    },
  ];

  const successTests = [
    {
      title: "Login successful recruteur",
      email: "recruiter@mail.com",
      password: "test1234",
      contains: "Bienvenue, test",
    },
    {
      title: "Login successful candidat",
      email: "candidate@mail.com",
      password: "test1234",
      contains: "Bienvenue, test",
    },
  ];

  describe("Login fail Tests", () => {
    beforeEach(async () => {
      await ClearLoginFields();
    });

    failTests.forEach(({ title, email, password, contains }) => {
      it(title, async () => {
        await Login(email, password);
        if (contains) {
          await expect(element(by.id("loginError"))).toBeVisible();
          await expect(element(by.id("loginError"))).toHaveText(contains);
        }
      });
    });
  });

  describe("Login success Tests", () => {
    afterEach(async () => {
      await LogOut();
      await waitFor(element(by.id("loginButton")))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id("loginButton")).tap();
      await waitFor(element(by.id("emailInput")))
        .toBeVisible()
        .withTimeout(10000);
    });

    successTests.forEach(({ title, email, password, contains }) => {
      it(title, async () => {
        await Login(email, password);
        if (contains) {
          await expect(element(by.id("homeGreeting"))).toBeVisible();
          await expect(element(by.id("homeGreeting"))).toHaveText(contains);
        }
      });
    });
  });
});

function Login(email, password) {
  return element(by.id("emailInput"))
    .typeText(email)
    .then(() => element(by.id("passwordInput")).typeText(password))
    .then(() => element(by.id("backgroundCircles")).tap())
    .then(() => element(by.id("submitLoginButton")).tap());
}

function LogOut() {
  return element(by.id("Profile")).tap()
    .then(async() => {
      await waitFor(element(by.id("logoutButton")))
        .toBeVisible()
        .withTimeout(10000);
      await element(by.id("logoutButton")).scrollTo('bottom');
      await element(by.id("logoutButton")).tap();
      await waitFor(element(by.id("loginButton")))
        .toBeVisible()
    });
}

function ClearLoginFields() {
  return element(by.id("emailInput"))
    .clearText()
    .then(() => element(by.id("passwordInput")).clearText());
}

