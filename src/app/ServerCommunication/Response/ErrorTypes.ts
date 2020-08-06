export enum LoginError {
  AlreadyLoggedIn,
  Autodiscovery,
  UserIdFormat,
  ServerUnreachable,
  InvalidPassword,
  Unknown
}

export enum SettingsError {
  NoClient,
  Setter,
  Getter
}
