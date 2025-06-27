let usd = 1000;
let holdings = {BTC: 0, ETH: 0, DOGE: 0};
let prices = {BTC: 20000, ETH: 1000, DOGE: 0.05};
let lastPrices = {...prices};
let position = null;

function updatePortfolio() {
  document.getElementById('usd').textContent = usd.toFixed(2);
  const holdDiv = document.getElementById('holdings');
  holdDiv.innerHTML = '';
  for (const coin in holdings) {
    holdDiv.innerHTML += `<div>${coin}: ${holdings[coin].toFixed(4)}</div>`;
  }
}

function updateMarket() {
  const table = document.getElementById('marketTable');
  table.innerHTML = '<tr><th>Монета</th><th>Цена ($)</th><th>Купить</th></tr>';
  for (const coin in prices) {
    table.innerHTML += `<tr><td>${coin}</td><td>${prices[coin].toFixed(2)}</td>`+
      `<td><input type="number" id="buy_${coin}" placeholder="Количество">`+
      `<button onclick="buyCoin('${coin}')">Купить</button></td></tr>`;
  }
  const select = document.getElementById('futuresCoin');
  select.innerHTML = '';
  for (const coin in prices) {
    select.innerHTML += `<option value="${coin}">${coin}</option>`;
  }
}

function donate() {
  const amount = parseFloat(prompt('Сколько добавить долларов?')) || 0;
  usd += amount;
  updatePortfolio();
}

function buyCoin(coin) {
  const amount = parseFloat(document.getElementById('buy_'+coin).value) || 0;
  const cost = amount * prices[coin];
  if (cost > usd) {
    alert('Недостаточно средств');
    return;
  }
  usd -= cost;
  holdings[coin] += amount;
  updatePortfolio();
}

function randomizePrices() {
  for (const coin in prices) {
    lastPrices[coin] = prices[coin];
    const change = 1 + (Math.random() - 0.5) * 0.1; // +/-5%
    prices[coin] *= change;
  }
  updateMarket();
  updateAdvice();
  updatePosition();
}

function openPosition() {
  if (position) {
    alert('Уже есть открытая позиция');
    return;
  }
  const coin = document.getElementById('futuresCoin').value;
  const amount = parseFloat(document.getElementById('futuresAmount').value) || 0;
  const lev = parseFloat(document.getElementById('leverage').value) || 1;
  if (amount > usd) {
    alert('Недостаточно средств');
    return;
  }
  usd -= amount;
  position = {coin, amount, lev, entry: prices[coin]};
  document.getElementById('position').textContent = `Позиция: ${coin}, сумма ${amount}$, плечо ${lev}x`;
  updatePortfolio();
}

function updatePosition() {
  if (!position) return;
  const current = prices[position.coin];
  const diff = (current - position.entry) / position.entry;
  const pnl = diff * position.lev * position.amount;
  if (diff <= -1/position.lev) {
    document.getElementById('position').textContent = 'Позиция ликвидирована';
    position = null;
  } else {
    document.getElementById('position').textContent =
      `Позиция: ${position.coin}, PnL: ${(pnl).toFixed(2)}$`;
  }
}

function updateAdvice() {
  const div = document.getElementById('advice');
  div.innerHTML = '';
  for (const coin in prices) {
    const trend = prices[coin] > lastPrices[coin] ? 'рост' : 'падение';
    div.innerHTML += `<div>${coin}: ожидается ${trend}</div>`;
  }
}

updatePortfolio();
updateMarket();
updateAdvice();
setInterval(randomizePrices, 5000);
