import type { BotHmacKey, BotKeyRegistry, BotSecurityEnvironment } from "../../lib/bot-security/security-types";

export interface ServerKeyResolver {
  resolveServerKey(keyId: string, environment: BotSecurityEnvironment): Promise<BotHmacKey | null>;
}

export class ServerBotKeyRegistry implements BotKeyRegistry {
  private readonly resolver: ServerKeyResolver;

  constructor(resolver: ServerKeyResolver) {
    this.resolver = resolver;
  }

  resolve(keyId: string, environment: BotSecurityEnvironment): Promise<BotHmacKey | null> {
    return this.resolver.resolveServerKey(keyId, environment);
  }
}
