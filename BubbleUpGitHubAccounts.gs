/**
 * Watch a whole repository, but only see GitHub notifications created on behalf
 * of specific users.
 *
 * Uses [Google Apps Script]{@link https://developers.google.com/apps-script/}
 * to periodically read a Gmail label and move messages to the inbox.
 */

/**
 * Holds the GitHub usernames of the people you want to bubble up.
 * @type {string[]}
 */
var gitHubAccounts = [];

/**
 * The name of the GMail label you want to bubble from.
 * @type string
 */
var gmailLabel = '';

/**
 * Google Apps Script Gmail API
 * @external GmailApp
 * @see {@link https://developers.google.com/apps-script/reference/gmail/}
 */

/**
 * Google Apps Script Gmail Message Object
 * @class GmailMessage
 * @memberof external:GmailApp
 * @see {@link https://developers.google.com/apps-script/reference/gmail/gmail-message}
 */

/**
 * Google Apps Script Gmail Thread Object
 * @class GmailThread
 * @memberof external:GmailApp
 * @see {@link https://developers.google.com/apps-script/reference/gmail/gmail-thread}
 */


/**
 * Checks whether the given message should bubble.
 * 
 * A message bubbles if it was sent to you explicitly by GitHub
 * (`X-GitHub-Reason: ...`), or if it was sent on behalf of one of the
 * whitelisted users from {@link gitHubAccounts}.
 *
 * @param {external:GmailApp.GmailMessage}
 * @return {Boolean}
 */
function messageShouldBubble( message ) {
	var raw = message.getRawContent();
	
	if ( ~ raw.indexOf( 'X-GitHub-Reason:' ) ) {
		return true;
	}
	
	return gitHubAccounts.some( function( gitHubAccount ) {
		return
			( ~ raw.indexOf( Utilities.formatString(
				'X-GitHub-Sender: %s',
				gitHubAccount
			) ) )
		||
			( ~ raw.indexOf( Utilities.formatString(
				'@%s',
				gitHubAccount
			) ) );
	} );
}

/**
 * Checks whether the given thread should bubble.
 * 
 * A thread bubbles if it contains any message which bubbles.
 * @see messageShouldBubble
 *
 * @param {external:GmailApp.GmailThread}
 * @return {Boolean}
 */
function threadShouldBubble( thread ) {
	var messages = thread.getMessages();
	if ( ! messages ) {
		thread.markImportant();
		return false;
	}
	
	return messages.some( messageShouldBubble );
}

/**
 * Runs the script.
 */
function main() {
	/*
 	 * Google App Scripts are fastest when read and write operations are
	 * batched. Alternating between read and write is slow, so we do write
	 * operation on many threads/messages at once rather than looping
	 * through them and reading from/writing to each in turn.
	 */

	// READ
	var searchResults = GmailApp.search( Utilities.formatString(
		'label:%s is:unread is:important -in:inbox',
		gmailLabel
	) );
	if ( ! searchResults.length ) {
		return;
	}
	
	// WRITE ALL
	GmailApp.markThreadsUnimportant( searchResults );
	
	// READ ALL
	var moveToInbox = searchResults.filter( threadShouldBubble );
	if ( ! moveToInbox.length ) {
		return;
	}
	
	// WRITE ALL
	GmailApp.moveThreadsToInbox( moveToInbox );
	GmailApp.markThreadsImportant( moveToInbox );
}
