# Testimonials Standby Site: Setup Guide

This is the standby demo site for past customers. It stays separate from the main El Austral system.
Later, only the testimonials (data/testimonials.json) move into the main system.

## What's in this folder

| File | What it does |
|---|---|
| testimonials.html | The Wall of Fame. It shows a picture frame for every comment, opens the full message, and shows your reply below it |
| contact_us.html | Thank-you message plus the form (first name, last name, year served, testimonial) |
| data/testimonials.json | The database: one entry per comment. It starts empty |
| connector/worker.js | The small free connector that saves each new comment into the database on GitHub |

index.html, services.html and about.html are already included and fixed for this folder. The menu, links and
paths all match, the Order buttons are hidden, and Sign Up is removed.
Before uploading, copy these folders from your English folder into this one (copy, don't move):
`Scripts`, `Graph` and `Music`. (`Styles` and `Images` with the two mountain pictures are already included.)

## Step 1: Put the site on GitHub (about 10 minutes)
1. On github.com, create a new public repository, for example `el-austral-testimonials`.
2. Upload every file and folder from this site, keeping the `data` folder.
3. Go to Settings > Pages > Source: "Deploy from a branch", choose `main`, then `/ (root)`, then Save.
4. Your site address will be `https://miguelzapata1967.github.io/el-austral-testimonials/`.

## Step 2: Create the GitHub key for the connector
1. Go to GitHub > your picture > Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token.
2. Name: `testimonials-connector`. Repository access: **Only select repositories**, then pick `el-austral-testimonials`.
3. Permissions > Repository permissions > **Contents: Read and write**. Leave everything else alone.
4. Generate the token and copy it. GitHub shows it only once.

## Step 3: Set up the connector (free Cloudflare Worker, no credit card needed)
1. Sign up at dash.cloudflare.com, then go to Workers & Pages > Create > Create Worker. Name it `el-austral-testimonials`, then Deploy.
2. Click **Edit code**, delete the sample code, paste all of `connector/worker.js`, then Deploy.
3. Go to Settings > Variables and Secrets and add:
   - `GITHUB_TOKEN`: the token from Step 2 (choose type **Secret**)
   - `GITHUB_REPO`: `miguelzapata1967/el-austral-testimonials`
   - `GITHUB_BRANCH`: `main`
   - `FILE_PATH`: `data/testimonials.json`
   - `ALLOWED_ORIGIN`: `https://miguelzapata1967.github.io` (no slash at the end)
4. Copy the Worker address, for example `https://el-austral-testimonials.YOUR-ACCOUNT.workers.dev`.
5. In `contact_us.html`, replace the `CONNECTOR_URL` value with that address. Upload the file to GitHub again.

## Step 4: Test before sending any emails
1. Open the Contact Us page on the live site and submit 2 test comments.
2. On GitHub, open `data/testimonials.json`. You should see both entries.
3. Wait 1-2 minutes, then open the Testimonials page. The frames should appear, open, and close.
4. Write a reply (see below) and check that it shows under the comment.
5. Delete the test entries from the file and commit. Now you're ready to email the link.

## How to reply to a comment
1. On GitHub, open `data/testimonials.json` and click the pencil icon (Edit).
2. Find the comment and type your reply between the quotes after `"reply":`. For example:
   `"reply": "Thank you for your honest point of view. I'd love the chance to make it right."`
3. Click **Commit changes**. Your reply appears under the customer's comment in a minute or two.

Tip: GitHub sends you an email for every new commit if you "Watch" the repository (Watch > All Activity),
so you'll know when a new testimonial arrives.

## Moving to the main system later
Copy `data/testimonials.json` and `testimonials.html` into the main site. Point the connector's
`GITHUB_REPO` to the main repository. Nothing else changes.

## Icon and link preview
- `favicon.ico` and the `icons` folder hold your El Austral Consultant icon. It shows on the browser tab and on phone home screens.
- `icons/link-preview.png` is the picture people see when you send the link by email or text.
- After Step 1, open both HTML files and replace `YOUR-USERNAME` (and `el-austral-standby` if you named the repo differently) in the `og:image` line. Link previews need the full web address.
- To use the same icon on your homepage, Services and About Us pages, copy the icon and preview lines from the top of `testimonials.html` into the `<head>` of each page.
