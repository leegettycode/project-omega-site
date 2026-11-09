/* ============================================================
   Project Omega — email list configuration
   ============================================================
   Edit the two constants below, nothing else. See README.md.

   EMAIL_PROVIDER: "buttondown" | "kit" | "mailchimp"
   EMAIL_LIST_ID : the identifier your provider gives you:
      - Buttondown: your newsletter username (the slug), e.g. "projectomega"
      - Kit (ConvertKit): the numeric form ID, e.g. "1234567"
      - Mailchimp: the full form POST URL copied from the embed code, e.g.
        "https://xxxx.us21.list-manage.com/subscribe/post?u=...&id=..."

   The "thank you" redirect to pocket.html is configured inside your
   provider's dashboard (instructions in README.md), not here.
   ============================================================ */

const EMAIL_PROVIDER = "buttondown";
const EMAIL_LIST_ID = "OMEGA_LIST";

/* ------------------------------------------------------------
   No changes needed below this line.
   The form in the HTML already works for Buttondown without this
   script; this script rewrites the form for the chosen provider.
   ------------------------------------------------------------ */
(function () {
  var form = document.getElementById("signup-form");
  if (!form) return;
  var email = form.querySelector('input[type="email"]');
  var tag = form.querySelector('input[name="tag"]');
  var meta = form.querySelector('input[name^="metadata__"]');

  if (EMAIL_PROVIDER === "buttondown") {
    form.action = "https://buttondown.com/api/emails/embed-subscribe/" + EMAIL_LIST_ID;
    form.method = "post";
    email.name = "email";
  } else if (EMAIL_PROVIDER === "kit") {
    form.action = "https://app.kit.com/forms/" + EMAIL_LIST_ID + "/subscriptions";
    form.method = "post";
    email.name = "email_address";
    if (tag) tag.remove();
    if (meta) meta.remove();
  } else if (EMAIL_PROVIDER === "mailchimp") {
    form.action = EMAIL_LIST_ID;
    form.method = "post";
    email.name = "EMAIL";
    if (tag) tag.remove();
    if (meta) meta.remove();
    // Mailchimp's embed code includes a bot-protection field named b_<u>_<id>.
    try {
      var u = new URL(EMAIL_LIST_ID);
      var hp = document.createElement("div");
      hp.className = "hp-field";
      hp.setAttribute("aria-hidden", "true");
      hp.innerHTML =
        '<input type="text" name="b_' +
        u.searchParams.get("u") +
        "_" +
        u.searchParams.get("id") +
        '" tabindex="-1" value="" autocomplete="off">';
      form.appendChild(hp);
    } catch (e) {
      /* leave the form as it is */
    }
  }
})();
