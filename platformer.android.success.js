async function checkPaymentStatus(paymentId) {
    const response = await fetch(`https://api.nowpayments.io/v1/payment/${paymentId}`, {
        method: "GET",
        headers: {
            "x-api-key": "CKV8XXJ-ABH4JP4-J88D3P6-C5M50YM"
        }
    });

    const data = await response.json();
    if (data.payment_status === "finished") {
        console.log("Zahlung erfolgreich abgeschlossen!");
    }
}
