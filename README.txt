MAXI CEELAW PHOTOGRAPHY WEBSITE

IMPORTANT SECURITY SETUP
This site uses a Netlify serverless function to initialize Paystack payments. Never put your Paystack SECRET KEY in index.html or script.js.

To enable online payment, deploy this project with its Netlify Functions folder using a Git-based deploy or Netlify CLI. Then, in Netlify:
1. Open the new Maxi Ceelaw Photography site.
2. Go to Site configuration (or Project configuration) > Environment variables.
3. Add PAYSTACK_SECRET_KEY with the SECRET key from your Paystack dashboard. Keep it private.
4. Redeploy the site so the function receives the variable.

The customer enters the agreed full package price. The site calculates and requests 50% as the deposit. The site also offers WhatsApp booking.

The static site files are index.html, styles.css, script.js and payment-success.html. The payment functions are in netlify/functions/initialize-payment.js and verify-payment.js.

A successful Paystack redirect means the payment process returned to the website; confirm the actual transaction in your Paystack dashboard before confirming the booking.
