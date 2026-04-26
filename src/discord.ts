export async function notifyDiscord(webhookUrl: string, message: string): Promise<void> {
  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  })
}

export function formatError(e: unknown): string {
  return e instanceof Error
    ? `${e.name}: ${e.message}\n${e.stack ?? ""}`
    : String(e)
}

export async function notifyError(webhookUrl: string, context: string, e: unknown): Promise<void> {
  await notifyDiscord(webhookUrl, `❌ ${context}\n\`\`\`\n${formatError(e)}\n\`\`\``)
}

export async function runWithNotify(
  name: string,
  fn: () => Promise<void>,
  webhookUrl: string
): Promise<void> {
  try {
    await fn()
    await notifyDiscord(webhookUrl, `✅ ${name} が完了しました`)
  } catch (e) {
    await notifyError(webhookUrl, `${name} が失敗しました`, e)
  }
}