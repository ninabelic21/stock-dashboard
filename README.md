# Stock Dashboard — Cowork package

`index.html` is a self-contained dashboard (works offline, just double-click to open in a browser). It's also published live via GitHub Pages.

## Where the data lives
All portfolio data is **sample data**, hardcoded inside the HTML file in the `data()` function of the component logic. Each holding looks like:

```js
{ ticker: 'NVDA', name: 'NVIDIA', sector: 'Halbleiter', value: 9850, day: 2.8, cost: 5200, shares: 78, price: 126.28, seed: 11, target: 8 }
```

- `value` — current position value in EUR
- `day` — today's change in %
- `cost` — total purchase cost (for P&L)
- `shares` — number of shares
- `price` — current price per share
- `target` — target portfolio weight in % (used for rebalancing suggestions)

The watchlist entries live in the `state.watch` array in the same file. Chart curves are generated (not real history).

## News headlines
Each stock's detail view shows a "Nachrichten" section. The headlines live in the `newsData()` function (keyed by ticker, newest first):

```js
NVDA: [ { date: '02.07.', source: '...', title: '...' } ]
```

## Example Cowork prompts
- "Open index.html, fetch today's prices for the tickers in the data() function, and update `price`, `value` and `day` accordingly."
- "Here is my broker CSV export in Downloads — update the holdings in index.html to match it (shares, cost, value)."
- "Add a new holding: 12 shares of ASML bought at €790."
- "Recalculate the suggestion texts (overweight/underweight vs. `target`) after updating the data."
- "Search for today's news headlines about each ticker in my portfolio and update the `newsData()` function in index.html (2–3 headlines per stock, newest first, with date, source and title)."

## Caution
Keep this folder scoped to just the dashboard — don't point Cowork at folders containing sensitive financial documents you don't want it to read.
