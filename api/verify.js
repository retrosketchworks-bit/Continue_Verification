export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const token = req.body["g-recaptcha-response"];

  if (!token) {
    return res.status(403).send("Captcha missing");
  }

  const google = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET,
        response: token,
      }),
    }
  );

  const result = await google.json();

  if (!result.success) {
    return res.status(403).send("Captcha failed");
  }

  return res.redirect(
    302,
    "https://example.com"
  );
}
