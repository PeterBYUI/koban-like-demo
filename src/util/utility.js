export function displayNameFormat(dn) {
  const splitDn = dn.split(" "); //["firstName", "lastName"]
  return `${splitDn[0].at(0).toUpperCase()}${splitDn[1].at(0).toUpperCase()}`;
}
