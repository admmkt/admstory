// node worker/test.mjs — confere as duas peças que decidem quem tem acesso.
import assert from "node:assert";
import { createHmac } from "node:crypto";
import { validSignature, paidUntilFrom } from "./src/index.js";

const secret = "segredo", reqId = "req-1", ts = "1760700000";
const v1 = createHmac("sha256", secret).update(`id:abc123;request-id:${reqId};ts:${ts};`).digest("hex");
assert.equal(await validSignature(`ts=${ts},v1=${v1}`, reqId, "ABC123", secret), true);
assert.equal(await validSignature(`ts=${ts},v1=${v1}`, reqId, "outro", secret), false);
assert.equal(await validSignature(`ts=${ts},v1=${v1}`, reqId, "abc123", "errado"), false);
assert.equal(await validSignature(null, reqId, "abc123", secret), false);

assert.equal(paidUntilFrom([]), 0);
assert.equal(paidUntilFrom([{ payment: { status: "rejected" }, debit_date: "2026-10-01T00:00:00Z" }]), 0);
assert.equal(
  paidUntilFrom([
    { payment: { status: "approved" }, debit_date: "2026-09-01T00:00:00Z" },
    { payment: { status: "approved" }, debit_date: "2026-10-01T00:00:00Z" },
    { payment: { status: "rejected" }, debit_date: "2026-11-01T00:00:00Z" },
  ]),
  Date.parse("2026-11-04T00:00:00Z"),
);
console.log("ok");

// ADM Story: plano anual cobre 12 meses; o período vem da assinatura no MP.
import { planMonths } from "./src/index.js";
assert.equal(planMonths({ auto_recurring: { frequency: 12, frequency_type: "months" } }), 12);
assert.equal(planMonths({ auto_recurring: { frequency: 1, frequency_type: "months" } }), 1);
assert.equal(planMonths({}), 1);
assert.equal(
  paidUntilFrom([{ payment: { status: "approved" }, debit_date: "2026-10-01T00:00:00Z" }], 12),
  Date.parse("2027-10-04T00:00:00Z"),
);
console.log("anual ok");
