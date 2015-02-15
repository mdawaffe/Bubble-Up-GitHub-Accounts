Bubble Up GitHub Accounts
=========================

Watch an entire GitHub repo, but only send notifications from specific GitHub users to your Gmail inbox.

Set up a Gmail label to archive all incoming repo notifications into.  The script will watch that label
and move threads that involve you or the specific GitHub users you whitelist back into your inbox.

Uses [Google App Scripts](https://developers.google.com/apps-script/).

Installation
------------

This is a pain :)

1. Watch a GitHub repo.
2. Create a Gmail filter for the repo: `list:"{repo}.{organization_or_user}.github.com"`
   to archive *all* incoming messages (skip the inbox) and apply a label.
3. Go to https://script.google.com/.
4. Make sure you're logged in as the user you want to be logged in as.
5. Under "Create script for", click "Gmail".
6. Paste the contents of `BubbleUpGitHubAccounts.gs` into the text editor.
7. Rename the file to `BubbleUpGitHubAccounts.gs`.
8. Edit the `gitHubAccounts` array to include all of the GitHub usernames you
   want to follow for this repo.
9. Edit the `gmailLabel` string to match the label you created in step 2 above.
10. You can test the script by selecting Run → main.  The first run may take a
    while if there are already lots of threads in the Gmail label.
11. Go to Resources → Current project's triggers
12. Click "Add a new trigger".
13. Run: main, Time-driven, minutes-timer, every 15 minutes.
14. Click "notifications"
15. Via email, hourly.
16. OK.
17. Save.

Consequences
------------

Will mark all non-matching threads as not important.
