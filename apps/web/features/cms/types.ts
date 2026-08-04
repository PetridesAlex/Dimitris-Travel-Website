export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

export type AuthActionResult =
  | { ok: true }
  | { ok: false; error: string };
