export type AuthLanguage = "en" | "zh";

const zhAuthErrors: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "邮箱或密码错误。"],
  [/email not confirmed/i, "邮箱尚未确认，请先检查确认邮件。"],
  [/user already registered/i, "该邮箱已经注册，请直接登录。"],
  [/password should be at least/i, "密码至少需要 8 位。"],
  [/email rate limit exceeded|rate limit/i, "邮件发送过于频繁，请稍后再试。"],
];

export function authErrorMessage(message: string, language: AuthLanguage) {
  if (language === "en") return message;
  return zhAuthErrors.find(([pattern]) => pattern.test(message))?.[1] ?? message;
}
