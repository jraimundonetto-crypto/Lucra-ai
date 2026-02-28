const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const supabase = require("../config/supabaseClient");

router.post("/webhook/mercadopago", async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === "payment") {
      const paymentId = data.id;

      const response = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
          },
        }
      );

      const payment = await response.json();

      if (payment.status === "approved") {
        const userId = payment.metadata?.user_id;

        if (userId) {
          await supabase
            .from("users")
            .update({
              plan: "pro",
              status: "active",
              paid_at: new Date(),
            })
            .eq("id", userId);

          console.log("✅ Usuário liberado:", userId);
        }
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.sendStatus(500);
  }
});

module.exports = router;