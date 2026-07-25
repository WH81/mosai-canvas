/**
 * SenderService
 * Handles all communication with the Sender.net API.
 * API docs: https://api.sender.net/v2
 *
 * Security: API token is never exposed to the frontend.
 * All calls are made server-side only.
 */

const SENDER_API_BASE = 'https://api.sender.net/v2';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.SENDER_API_TOKEN}`,
});

/**
 * Add a subscriber to Sender.net and assign to group.
 * Returns the Sender.net subscriber object.
 */
export const addSubscriber = async (
  firstName: string,
  lastName: string,
  email: string
): Promise<{ id: string }> => {
  const response = await fetch(`${SENDER_API_BASE}/subscribers`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email,
      firstname: firstName,
      lastname: lastName,
      groups: [process.env.SENDER_GROUP_ID],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Sender.net addSubscriber failed: ${JSON.stringify(error)}`
    );
  }

  const data = await response.json();
  return data.data; // { id, email, firstname, ... }
};

/**
 * Unsubscribe a subscriber from Sender.net by their Sender subscriber ID.
 */
export const unsubscribeSubscriber = async (
  senderSubscriberId: string
): Promise<void> => {
  const response = await fetch(
    `${SENDER_API_BASE}/subscribers/${senderSubscriberId}`,
    {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status: 'inactive' }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Sender.net unsubscribe failed: ${JSON.stringify(error)}`
    );
  }
};
