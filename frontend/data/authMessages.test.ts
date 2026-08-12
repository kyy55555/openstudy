import assert from "node:assert/strict";
import test from "node:test";

import { authErrorMessage } from "./authMessages.ts";

test("common authentication errors are localized without hiding unknown errors", () => {
  assert.equal(authErrorMessage("Invalid login credentials", "zh"), "邮箱或密码错误。");
  assert.equal(authErrorMessage("Email not confirmed", "zh"), "邮箱尚未确认，请先检查确认邮件。");
  assert.equal(authErrorMessage("User already registered", "zh"), "该邮箱已经注册，请直接登录。");
  assert.equal(authErrorMessage("Unexpected provider error", "zh"), "Unexpected provider error");
  assert.equal(authErrorMessage("Invalid login credentials", "en"), "Invalid login credentials");
});
