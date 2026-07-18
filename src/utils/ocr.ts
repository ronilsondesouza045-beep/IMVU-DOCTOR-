/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utilitário para ler arquivos de imagem e convertê-los em String Base64 limpa,
 * pronta para ser enviada para a API do Gemini.
 */
export function readImageAsBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remover o cabeçalho data:image/...;base64,
        const matches = reader.result.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          resolve({
            mimeType: matches[1],
            base64: matches[2],
          });
        } else {
          reject(new Error("Formato de imagem inválido para decodificação."));
        }
      } else {
        reject(new Error("Falha ao ler o arquivo como string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}
