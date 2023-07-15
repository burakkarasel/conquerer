const { createClient } = require("redis");

const checkLogin = async (userId, token) => {
  const client = createClient();
  //* Implementing log out on second device login

  await client.connect();

  const clientActiveKey = `activeTokens:${userId}`;
  const clientRestrictedKey = `restrictedTokens:${userId}`;

  // checking if token exists in activeTokens
  const exists = await client.exists(clientActiveKey);

  if (exists) {
    // if it's we retrieve the old token to put it with restrict ones
    const oldToken = await client.get(clientActiveKey);

    // first we set the old token as restricted in restricted tokens
    await client.set(clientRestrictedKey, oldToken, {
      EX: 3600,
    });

    // then we set the new token for the user in active tokens
    await client.set(clientActiveKey, token, {
      EX: 3600,
    });

    await client.quit();

    return;
  }

  // if doesn't exists we just put the token in active tokens
  client.set(clientActiveKey, token);

  await client.quit();

  return;
};

const checkIfTokenRestricted = async (userId, token) => {
  const client = createClient();

  await client.connect();

  const key = `restrictedTokens:${userId}`;

  // first we check if token exists in restrictedTokens
  const exists = await client.exists(key);
  if (!exists) return false;

  // if it exists we retrieve the token
  const restrictedToken = await client.get(key);

  await client.quit();

  // check if the restricted token is the same in the request
  return restrictedToken === token;
};

module.exports = { checkLogin, checkIfTokenRestricted };
