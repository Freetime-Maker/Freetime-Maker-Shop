async function createOneTimePayment() {
    const response = await fetch("https://api.nowpayments.io/v1/payment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "CKV8XXJ-ABH4JP4-J88D3P6-C5M50YM"
        },
        body: JSON.stringify({
            price_amount: 11,
            price_currency: "USD",
            pay_currency: "BTC",
            order_id: "5708002305",
            success_url: "https://freetimmaker.github.io/Freetime-Maker-Shop/download.platformer.android.html",
            cancel_url: "https://freetimemaker.github.io/Freetime-Maker-Shop/index.html"
        })
    });

    const data = await response.json();
    window.location.href = data.invoice_url; // Weiterleitung zur Zahlungsseite
}
