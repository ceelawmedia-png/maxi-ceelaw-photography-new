exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const params = new URLSearchParams(event.rawQuery || '');
    const reference = params.get('reference');

    if (!reference) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment reference is missing.' })
      };
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const result = await response.json();

    if (!response.ok || !result.status || result.data.status !== 'success') {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Payment could not be verified.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        reference: result.data.reference,
        amount: result.data.amount,
        currency: result.data.currency
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unable to verify payment. Please try again.' })
    };
  }
};
