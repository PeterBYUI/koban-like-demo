import { BANNED_PASSWORDS } from "./banned_passwords";

export function isEmailValid(str) {
  if (!str || typeof str !== "string") return false; //makes sure it's a valid string

  const email = str.trim();
  const firstCharacter = email[0];
  const lastCharacter = email[email.length - 1];
  const [local, domain] = email.split("@");

  if (!email.includes("@")) return false;
  if (email.includes(" ")) return false;
  if (firstCharacter === "@" || lastCharacter === "@") return false;
  if (firstCharacter === "." || lastCharacter === ".") return false;
  if (email.includes("..")) return false;
  if (!local || !domain) return false;
  if (!domain.includes(".")) return false;

  let atNumber = 0;
  for (let char of email) {
    if (char === "@") atNumber++;
  }
  if (atNumber > 1) return false;

  return true;
}

export function isPasswordValid(str) {
  if (!str || typeof str !== "string") return false;

  const password = str.trim();
  if (BANNED_PASSWORDS.includes(password)) return false;
  if (password.length < 6) return false;
  if (!/\d/.test(password)) return false;
  if (password.includes(" ")) return false;
  return true;
}
