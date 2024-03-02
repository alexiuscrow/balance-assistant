<p align="center">
    <img src="assets/logo.svg" alt="Balance assistant" style="width:128px;height:128px;"/>
</p>
<p align="center">
    <h1 align="center">Balance assistant</h1>
</p>
<hr>

# Summary

A simple web application containing a REST API endpoint for managing bank account balances.

Built on the Next.js framework and designed to run on the [Vercel platform](https://vercel.com/dashboard). Running on
the Vercel platform enables the use of
the [dynamic caching feature](https://vercel.com/docs/edge-network/caching#using-vercel.json-and-next.config.js), which
is critical for the application. Otherwise, custom server-side caching configuration will be required.

## Origin of the Idea

For planning personal finances, maintaining quality accounting, and controlling expenses, I
use [Google Sheets](https://sheets.google.com/). At the moment, it's the most convenient way for me to customize my
rules and keep accounts according to my needs. However, manually updating the balance in Google Sheets is quite a
tedious task and takes a lot of time. Therefore, it was decided to create
a [Google Apps Script](https://developers.google.com/apps-script/) that could use
the [Monobank API](https://api.monobank.ua/docs/index.html#tag/Kliyentski-personalni-dani) to automatically retrieve
current account status.

However, I soon encountered the problem that sometimes the cell with data obtained from the Monobank API contained
errors. This was because Google Sheets too often triggered the Google Apps Script, resulting in excessively frequent
requests to the Monobank API. Eventually, the Monobank API blocked access and returned the
error `429 Too Many Requests`.

To address this issue, it was decided to create a custom web application that could serve as a kind of proxy for the
Monobank API but with its own data caching rules. This could ensure that even if the number of requests to the endpoint
is high, the actual number of requests to the Monobank API would not exceed the limit I set.


## Environment Variables

To ensure the proper functioning of the application, the following environment variables need to be set on the server:

| Name           | Description                                                                                                                                                          |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `MONO_TOKEN`   | Token required to work with the Monobank API. This token needs to be generated in the [API personal account](https://api.monobank.ua/).                              |
| `MONO_ACCOUNT` | Identifier of the main Monobank bank account                                                                                                                         |
| `APP_TOKEN`    | Token created for authentication purposes while working with the app using REST. Using a permanent token may not seem secure, but it's what works best for my needs. |

## Authentication

To authenticate, use the `Authorization` header with the value `Bearer ${APP_TOKEN}`.
Where `APP_TOKEN` is the token you set as the environment variable `APP_TOKEN`.

## Available Endpoints

### `GET /api/v1/main-account/balance`

Get the current balance of the main bank account.

#### Response

```json
{
  "data": 8070
}
```

## License

This project is [MIT](https://github.com/avneesh0612/next-progress-bar/blob/main/LICENSE) licensed.


