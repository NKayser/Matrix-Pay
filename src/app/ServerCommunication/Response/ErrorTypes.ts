export enum ClientError {
  Autodiscovery,
  InvalidPassword,
  Unknown
}

export enum SettingsError {
  Setter
}

export enum GroupError {
  SendEvent,
  NoOriginal,
  InvalidUsers,
  Unknown,
  InvalidName, // or invalid Alias
  SetCurrency,
  InUse,
  RoomNotFound
}
