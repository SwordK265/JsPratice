'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
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
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//Display Movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  //Dùng slice() để copy array vì sort làm thay đổi array ban đầu
  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//Display Balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accum, mov) => accum + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

//Display Summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((accum, mov) => accum + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((accum, mov) => accum + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(deposit => deposit > 1)
    .reduce((accum, mov) => accum + mov, 0);
  labelSumInterest.textContent = `${interest}€`;
};

//Create account.username
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(el => el[0])
      .join('');
  });
};
createUsernames(accounts);

//Update UI of account
const updateUI = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

let currentAccount;
btnLogin.addEventListener('click', function (event) {
  // Prevent form from submitting
  event.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    //Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();

  const value = Number(inputTransferAmount.value);
  const transferAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';

  //Ở đây dùng optional chaining (transferAccount?.username) tuy nhiên biểu thức vẫn đúng bởi vì
  //undefined luôn != với currentAccount.username nên  vì vậy trong if conditions ta phải thêm điều kiện
  // transferAcount(transferAcount === true) để chỉ sự tồn tại của account đó
  if (
    transferAccount?.username !== currentAccount.username &&
    value > 0 &&
    transferAccount &&
    currentAccount.balance >= value
  ) {
    console.log('Transfer');
    //Add negative & positive to currentUser and recipient
    currentAccount.movements.push(-value);
    transferAccount.movements.push(value);

    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (currentAccount.movements.some(mov => mov >= amount * 0.1) && amount > 0) {
    // Add positive movements to current use
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }

  //Clear input field
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const indexAccount = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //Delete account
    accounts.splice(indexAccount, 1);

    //Updated account
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let conditionSort = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();

  displayMovements(currentAccount, !conditionSort);
  conditionSort = !conditionSort;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//findIndex()
/*
const accountIndex = accounts.findIndex(acc =>
  acc.movements.every(mov => mov > 0)
);
console.log(accountIndex);
console.log(accounts[3]);
console.log(accounts);
console.log(accounts.splice(0, 2));
*/

//sort() : sắp xếp mảng
// if a>b return 1 (swap position)
// if a<b return -1 (swap position)
const arrs = [24, 2, 1000, 42, 66];
console.log(arrs.sort((a, b) => a - b)); // sắp xếp tăng dần
console.log(arrs.sort((a, b) => b - a)); // sắp xếp giảm dần

/**có 2 cách để khai báo array theo cách phổ biến
 * Cách 1 : [1,2,3,4,5]
 * Cách 2 : new Array(1,2,3,4,5,6)
 * tuy nhiên với new Array(5) -- chỉ có 1 đối số trong constructor thì đó là độ dài của mảng
 * với 1 mảng trống [] ta có thể dùng fill() để lấp đầy mảng đó với đối số truyền vào
 */

/**Dùng Array.from() để tạo mảng giống như 2 cách khai báo trên
 * array.from() có thể dùng để biến 1 nodelist[] thành 1 array thực sự vì bản chất nodelist kp mảng
 * nodelist có thể thấy trong querySelectorAll() của DOM khi truy xuất elements
 * đối số thứ 2 của array.from() chấp nhận 1 function callback để thực hiện các thao tác khác
 */

const arr = Array.from({ length: 7 }, () => 1);
console.log(arr);

const arr1 = Array.from({ length: 7 }, (cur, i) => i + 1);
console.log(arr1);
