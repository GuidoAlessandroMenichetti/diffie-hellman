class Cryptography {
  static async createAesHash(key) {
    const encoder = new TextEncoder();

    // crea hash sha-256 para la clave
    const hash = await crypto.subtle.digest(
      'SHA-256',
      encoder.encode(key)
    );

    return hash;
  }

  static async createAesKey(key) {
    // crea clave AES
    return crypto.subtle.importKey(
      'raw',
      await Cryptography.createAesHash(key),
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(key, message) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(message);

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );

    return {
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted))
    };
  }

  static async decrypt(key, payload) {
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(payload.iv) },
      key,
      new Uint8Array(payload.data)
    );

    return new TextDecoder().decode(decrypted);
  }
}