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

export enum GroupError {
  SendEvent,
  NoOriginal,
  InvalidUsers
}
