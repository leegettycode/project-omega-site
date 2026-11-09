# Project Omega website

A small, dependency-free static site for *The First 72 Hours: The Family Emergency Handbook* and its free Pocket Companion. Plain HTML, one stylesheet, one tiny config script. No framework, no build step.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Landing page: hero with cover, email form, benefits, chapter list, sourcing, editorial status |
| `pocket.html` | Thank-you / download page for the Pocket Companion PDF |
| `sources.html` | Evidence register template. `<div id="register">` is empty and is filled by a separate script |
| `privacy.html` | UK GDPR privacy notice for the email list |
| `styles.css` | All styling (navy `#0f1f3d`, cream `#f3ecdd`, amber `#d9962b`; Barlow Condensed and Crimson Text from Google Fonts) |
| `config.js` | The only JavaScript: email provider and list ID constants |
| `assets/cover.png` | Front cover render, 960 x 1200 px |
| `downloads/Omega-Pocket-Companion.pdf` | The Pocket Companion PDF served to readers |
| `deploy-pages.yml` | GitHub Actions workflow; copy to `.github/workflows/` in the repository |

## Run locally

From the repository root:

```sh
cd site
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. Any static file server works; nothing needs compiling.

## Configure the email provider

The form on `index.html` posts directly to a hosted list provider, so there is no backend. Open `config.js` and edit the two constants at the top:

```js
const EMAIL_PROVIDER = "buttondown";   // "buttondown" | "kit" | "mailchimp"
const EMAIL_LIST_ID = "OMEGA_LIST";    // see below
```

The HTML form itself is hard-coded for Buttondown with the placeholder slug `OMEGA_LIST`, so it works even if JavaScript is disabled once you also replace `OMEGA_LIST` in the `action` attribute of the form in `index.html`. The script rewrites the form for whichever provider you choose.

### Buttondown

1. Create a newsletter at <https://buttondown.com>. Your username is the list slug (for example `projectomega`).
2. In `config.js` set `EMAIL_PROVIDER = "buttondown"` and `EMAIL_LIST_ID = "projectomega"`. Also replace `OMEGA_LIST` in the form's `action` in `index.html` so the form works without JavaScript.
3. In Buttondown go to **Settings -> Subscribing** and set the redirect URL after a successful subscription to your `pocket.html` address (for example `https://USERNAME.github.io/REPO/pocket.html`). You can set a separate confirmation redirect too.
4. Buttondown's embed endpoint must receive a normal HTML form POST (not `fetch`), which is what the site does. Subscribers may be shown a CAPTCHA on Buttondown's side before being redirected.
5. The hidden `tag` field (`pocket-companion`) and `metadata__source` field are supported by Buttondown and let you see who came from the landing page. Set up a welcome email in **Emails -> Automations** that attaches or links the Pocket Companion.

### Kit (formerly ConvertKit)

1. In Kit create an **inline form** and note its numeric ID from the embed code (`https://app.kit.com/forms/1234567/subscriptions`).
2. In `config.js` set `EMAIL_PROVIDER = "kit"` and `EMAIL_LIST_ID = "1234567"`.
3. In the form's **Settings -> General**, choose "Redirect to an external page" and enter your `pocket.html` address. Kit also sends the confirmation (double opt-in) email; set the incentive download there if you prefer Kit to host the PDF.
4. The script renames the email input to `email_address`, which is what Kit expects, and removes the Buttondown-only hidden fields.

### Mailchimp

1. In Mailchimp go to **Audience -> Signup forms -> Embedded forms** and copy the `action` URL from the generated code. It looks like `https://xxxx.us21.list-manage.com/subscribe/post?u=abc123&id=def456`.
2. In `config.js` set `EMAIL_PROVIDER = "mailchimp"` and paste the full URL into `EMAIL_LIST_ID`.
3. The script renames the email input to `EMAIL` and adds the `b_<u>_<id>` honeypot field Mailchimp expects.
4. Set the thank-you redirect in **Audience -> Signup forms -> Form builder -> Confirmation thank you page** to your `pocket.html` address.

### Testing

Subscribe with your own address, confirm, and check that you land on `pocket.html` and the PDF downloads. The download link is a plain file link, so it works even if the redirect does not fire.

## Deploy to GitHub Pages

1. Copy `site/deploy-pages.yml` to `.github/workflows/deploy-pages.yml` in the repository and commit it.
2. In the repository go to **Settings -> Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions** (not "Deploy from a branch").
3. Push to `main`. The workflow runs whenever anything under `site/` changes, or you can trigger it manually from the **Actions** tab (**Deploy site to GitHub Pages -> Run workflow**).
4. The site appears at `https://USERNAME.github.io/REPO/`. If you add a custom domain, set it in **Settings -> Pages** and add a `CNAME` file containing the domain to the `site/` folder.

The workflow uses `actions/upload-pages-artifact` and `actions/deploy-pages` with `pages: write` and `id-token: write` permissions, which is the current recommended method and needs no personal access token.

## Things the owner must change before launch

- Replace `OMEGA_LIST` in `config.js` and in the form `action` in `index.html`.
- Replace `hello@example.com` (footer of every page, `privacy.html`, `sources.html`) with a real contact address.
- Add the publisher's legal name and address to `privacy.html` if trading as a company.
- Replace `downloads/Omega-Pocket-Companion.pdf` when a newer Pocket build is approved; keep the file name so existing links still work.
- Update the "Editorial status" section on `index.html` when the handbook goes on sale, and add the retailer link.
- Fill `<div id="register">` on `sources.html` with the generated register markup (a table using the `.register` styles in `styles.css` will pick up the formatting automatically).
