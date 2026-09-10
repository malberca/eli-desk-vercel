export class BotIdentityRepositoryError extends Error {
  readonly code = "identity_repository_error";

  constructor() {
    super("Bot identity resolution is temporarily unavailable.");
    this.name = "BotIdentityRepositoryError";
  }
}

export class BotIdentityInputError extends Error {
  readonly code = "invalid_identity_input";

  constructor() {
    super("Bot identity input is invalid.");
    this.name = "BotIdentityInputError";
  }
}
