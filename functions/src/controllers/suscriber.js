import mailchimp from '@mailchimp/mailchimp_marketing';
import { MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX } from "../../env.js"

mailchimp.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: MAILCHIMP_SERVER_PREFIX
});

export async function subscribe(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  try {
    const response = await mailchimp.lists.addListMember("2f1d27d1eb", {
      email_address: email,
      status: "subscribed",
    });

    res.status(200).send({ message: "Successfully subscribed", data: response });
  } catch (error) {
    console.error("Error subscribing to Mailchimp:", error);
    res.status(500).send({ message: "Already Suscribed", error: error });
  }
}
