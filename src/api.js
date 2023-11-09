export default {
  '/api/random-challenge': { get: async (accountId, salt) => {
    // for a real implementation:
    // 1. use a server own key pair to sign the resulting challenge
    // 2. add an expiration mechanism
    const encoder = new TextEncoder();
    const data = encoder.encode(`${accountId}${salt}`);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const randomString = hashArray
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')

    return randomString
  }}
}

