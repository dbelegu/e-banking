'use strict';

const CURRENCY = {
  EUR: '€',
  USD: '$',
};

const THEME = {
  light: [
    { key: '--background-color', value: '#f3f3f3' },
    { key: '--text-color', value: '#444' },
    { key: '--button-on-hover-color', value: '#777' },
    { key: '--movement-row-color', value: '#fff' },
  ],
  dark: [
    { key: '--background-color', value: '#444' },
    { key: '--text-color', value: '#f3f3f3' },
    { key: '--button-on-hover-color', value: '#fff' },
    { key: '--movement-row-color', value: '#000' },
  ],
};

const account1 = {
  owner: 'Dren Belegu',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,
  movementsDescriptions: [
    'Standard bank transfer',
    'Paypal incoming transfer',
    'Walmart payment',
    'Mortgage loan',
    'Apple store purchase',
    'H&M store payment',
    'Incoming international bank transfer',
    'Binance profit withdrawl',
  ],
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Besnik Kelmendi',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDescriptions: [
    'Monthly salary',
    'Binance profit withdrawl',
    'Walmart payment',
    'Amazon store purchase',
    'Standard bank transfer',
    'Paypal outgoing transfer',
    'Incoming international bank transfer',
    'H&M store payment',
  ],
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

const rootElement = document.querySelector(':root');
const styleToggler = document.querySelector('.toggle--style');
const themeToggler = document.querySelector('.toggle--theme');
const logo = document.querySelector('.logo');
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnLogout = document.querySelector('.logout__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const loginContainer = document.querySelector('.login');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let hasRoundBorders = styleToggler.value;
let isLightModeOn = themeToggler.value;

const displayMovements = function (account, sort = false) {
  const movements = account.movements;

  labelDate.textContent = new Date().toDateString();
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__description">
        ${account.movementsDescriptions[i]}
      </div>
      <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}
      </div>
      <div class="movements__date">
        ${new Date(account.movementsDates[i]).toDateString()}
      </div>
      <div class="movements__value">
        ${mov.toFixed(2)}${CURRENCY[account.currency]}
      </div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}${
    CURRENCY[acc.currency]
  }`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}${CURRENCY[acc.currency]}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}${
    CURRENCY[acc.currency]
  }`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}${
    CURRENCY[acc.currency]
  }`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

const logout = function () {
  clearInterval(timer);
  labelWelcome.textContent = 'E-Banking';
  containerApp.style.opacity = 0;
  setTimeout(() => {
    containerApp.style.display = 'none';
    loginContainer.style.display = '';
  }, 900);
  btnLogout.style.display = 'none';
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      logout();
    }
    time--;
  };

  let time = 300;

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    loginContainer.style.display = 'none';
    containerApp.style.display = 'grid';
    btnLogout.style.display = 'inline';
    setTimeout(() => {
      containerApp.style.opacity = 1;
      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();

      if (timer) clearInterval(timer);

      timer = startLogOutTimer();
      updateUI(currentAccount);
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 100);
  }
});

btnLogout.addEventListener('click', function (e) {
  e.preventDefault();
  logout();
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    currentAccount.movementsDescriptions.push(
      `Outgoing bank transfer to ${receiverAcc.owner}`
    );

    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDescriptions.push(
      `Incoming bank transfer from ${currentAccount.owner}`
    );

    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      currentAccount.movementsDescriptions.push('Standard bank loan');

      updateUI(currentAccount);

      clearInterval(timer);
      timer = startLogOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.display = 'none';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

themeToggler.addEventListener('change', function (e) {
  e.preventDefault();
  isLightModeOn = !isLightModeOn;

  if (isLightModeOn) {
    logo.src = 'logo.png';
    THEME.light.forEach(style =>
      rootElement.style.setProperty(style.key, style.value)
    );
  } else {
    logo.src = 'logo-white.png';
    THEME.dark.forEach(style =>
      rootElement.style.setProperty(style.key, style.value)
    );
  }
});

styleToggler.addEventListener('change', function (e) {
  e.preventDefault();
  hasRoundBorders = !hasRoundBorders;
  rootElement.style.setProperty(
    '--border-radius-default',
    hasRoundBorders ? '2rem' : '0'
  );
});
