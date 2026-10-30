exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, email, phone, service, eventDate, packagePrice, details } = data;

    if (!name || !email || !phone || !service || !eventDate ||
        !Number.isFinite(Number(packagePrice)) || Number(packagePrice) < 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Please complete all required booking fields and enter a valid package price.' })
      };
    }

    const deposit = Math.ceil(Number(packagePrice) / 2);
    const amountKobo = Math.round(deposit * 100);
    const reference = `MCP_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        reference,
        callback_url: `${process.env.URL || ''}/payment-success.html`,
        metadata: {
          custom_fields: [
            { display_name: 'Customer name', variable_name: 'customer_name', value: name },
            { display_name: 'Phone', variable_name: 'phone', value: phone },
            { display_name: 'Service', variable_name: 'service', value: service },
            { display_name: 'Event date', variable_name: 'event_date', value: eventDate },
            { display_name: 'Full package price (NGN)', variable_name: 'package_price', value: String(packagePrice) },
            { display_name: 'Details', variable_name: 'details', value: String(details || '').slice(0, 500) }
          ]
        }
      })
    });

    const result = await response.json();

    if (!response.ok || !result.status) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: result.message || 'Paystack could not initialize this payment.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        authorization_url: result.data.authorization_url,
        reference: result.data.reference
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to start payment. Please try again or contact us on WhatsApp.' })
    };
  }
};
