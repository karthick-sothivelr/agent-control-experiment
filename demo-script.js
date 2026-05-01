// demo-script.js  — playwright-cli run-code --filename=demo-script.js
async (page) => {
  const sleep = ms => page.waitForTimeout(ms);

  const typeSlowly = async (locator, text, delay=60) => {
    await locator.click();
    await locator.fill('');
    for (const ch of text) {
      await locator.pressSequentially(ch);
      await sleep(delay);
    }
  };

  const billingHtml = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<title>Billing Agent</title>\n<style>\n  *{box-sizing:border-box;margin:0;padding:0}\n  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8f9fa;color:#111827}\n  .header{background:#fff;border-bottom:1px solid #e5e7eb;padding:14px 32px;display:flex;align-items:center;gap:12px}\n  .header h1{font-size:17px;font-weight:600}\n  .badge{background:#ede9fe;color:#5b21b6;font-size:11px;padding:3px 10px;border-radius:999px;font-weight:600;margin-left:4px}\n  .container{max-width:960px;margin:36px auto;padding:0 24px;display:grid;grid-template-columns:1fr 1fr;gap:24px}\n  .card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:24px}\n  .card h2{font-size:15px;font-weight:600;margin-bottom:3px}\n  .card .sub{color:#6b7280;font-size:13px;margin-bottom:18px}\n  label{display:block;font-size:13px;font-weight:500;color:#374151;margin-bottom:5px;margin-top:14px}\n  input[type=text],input[type=number]{width:100%;padding:9px 12px;border:1px solid #d1d5db;border-radius:8px;font-size:14px;outline:none;transition:border .15s,box-shadow .15s}\n  input:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.1)}\n  .btn{width:100%;margin-top:18px;padding:11px;background:#7c3aed;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s}\n  .btn:hover{background:#6d28d9}\n  .btn:disabled{background:#c4b5fd;cursor:not-allowed}\n  .quick{display:flex;gap:8px;margin-top:10px}\n  .quick button{flex:1;padding:9px 4px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid;transition:opacity .15s}\n  .quick button:hover{opacity:.85}\n  .q-green{border-color:#86efac;color:#166534;background:#f0fdf4}\n  .q-red{border-color:#fca5a5;color:#991b1b;background:#fff1f2}\n  .placeholder{text-align:center;padding:48px 20px;color:#9ca3af;font-size:14px}\n  .placeholder span{font-size:32px;display:block;margin-bottom:10px}\n  .result-box{border-radius:10px;padding:20px}\n  .allowed{background:#f0fdf4;border:1.5px solid #86efac}\n  .blocked{background:#fff1f2;border:1.5px solid #fca5a5}\n  .status{font-size:18px;font-weight:700;margin-bottom:8px}\n  .allowed .status{color:#15803d}\n  .blocked .status{color:#b91c1c}\n  .detail{font-size:13px;color:#374151;line-height:1.6;margin-top:8px}\n  .ctrl-tag{display:inline-block;background:#fee2e2;color:#991b1b;font-size:11px;padding:2px 8px;border-radius:4px;font-family:monospace;margin-top:10px}\n  .escalate{margin-top:12px;padding:10px 14px;background:#fefce8;border:1px solid #fde047;border-radius:8px;font-size:13px;color:#713f12;font-weight:500}\n  .log{margin-top:10px;padding:8px 12px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;font-size:11px;font-family:monospace;color:#6b7280}\n  .spinner{display:inline-block;width:16px;height:16px;border:2px solid #ddd;border-top-color:#7c3aed;border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:8px}\n  @keyframes spin{to{transform:rotate(360deg)}}\n  .loading-box{text-align:center;padding:40px;color:#6b7280;font-size:14px}\n</style>\n</head>\n<body>\n\n<div class=\"header\">\n  <span style=\"font-size:22px\">\ud83d\udcb3</span>\n  <h1>Billing Agent</h1>\n  <span class=\"badge\">\ud83d\udee1 Protected by Agent Control</span>\n</div>\n\n<div class=\"container\">\n  <div class=\"card\">\n    <h2>Assign Credits to User</h2>\n    <p class=\"sub\">Simulate the billing agent processing a credit assignment</p>\n\n    <label>User ID</label>\n    <input type=\"text\" id=\"userId\" value=\"user_42\" />\n\n    <label>Credits to assign</label>\n    <input type=\"number\" id=\"amount\" value=\"\" placeholder=\"Enter amount...\" min=\"1\" />\n\n    <button class=\"btn\" id=\"sendBtn\" onclick=\"sendRequest()\">Send to Billing Agent \u2192</button>\n\n    <div class=\"quick\">\n      <button class=\"quick q-green\" onclick=\"quickTest(20)\">\u2713 Test 20 credits (allowed)</button>\n      <button class=\"quick q-red\" onclick=\"quickTest(100)\">\u2717 Test 100 credits (blocked)</button>\n    </div>\n  </div>\n\n  <div class=\"card\">\n    <h2>Agent Response</h2>\n    <p class=\"sub\">Real-time guardrail evaluation via Agent Control</p>\n    <div id=\"resultArea\">\n      <div class=\"placeholder\"><span>\ud83e\udd16</span>Send a request to see the guardrail in action</div>\n    </div>\n  </div>\n</div>\n\n<script>\nasync function quickTest(amount) {\n  document.getElementById('amount').value = amount;\n  await sendRequest();\n}\n\nasync function sendRequest() {\n  const amount = parseInt(document.getElementById('amount').value);\n  const userId = document.getElementById('userId').value;\n  if (!amount || !userId) return;\n\n  const output = `Approved: assigning ${amount} credits to ${userId}. Routing to billing system.`;\n  const btn = document.getElementById('sendBtn');\n  btn.disabled = true;\n\n  document.getElementById('resultArea').innerHTML =\n    `<div class=\"loading-box\"><span class=\"spinner\"></span>Evaluating with Agent Control...</div>`;\n\n  try {\n    const res = await fetch('/api/v1/evaluation', {\n      method: 'POST',\n      headers: {'Content-Type': 'application/json'},\n      body: JSON.stringify({\n        agent_name: 'awesome_bot_3000',\n        step: {type: 'llm', name: 'assign_credit',\n               input: `assign ${amount} credits to ${userId}`, output},\n        stage: 'post'\n      })\n    });\n    const data = await res.json();\n    const blocked = data.matches?.[0]?.control_name;\n    const pct = (data.confidence * 100).toFixed(0);\n\n    if (data.is_safe) {\n      document.getElementById('resultArea').innerHTML = `\n        <div class=\"result-box allowed\">\n          <div class=\"status\">\u2705 Request Allowed</div>\n          <div class=\"detail\"><strong>Agent output:</strong><br>${output}</div>\n          <div class=\"log\">is_safe: true &nbsp;\u00b7&nbsp; confidence: ${pct}% &nbsp;\u00b7&nbsp; guardrails checked: ${(data.non_matches||[]).length}</div>\n        </div>`;\n    } else {\n      document.getElementById('resultArea').innerHTML = `\n        <div class=\"result-box blocked\">\n          <div class=\"status\">\ud83d\udeab Request Blocked</div>\n          <div class=\"detail\"><strong>Intercepted output:</strong><br><em>${output}</em></div>\n          <div><span class=\"ctrl-tag\">${blocked}</span></div>\n          <div class=\"escalate\">\u26a0\ufe0f Escalating to human agent for review</div>\n          <div class=\"log\">is_safe: false &nbsp;\u00b7&nbsp; confidence: ${pct}% &nbsp;\u00b7&nbsp; action: deny</div>\n        </div>`;\n    }\n  } catch(e) {\n    document.getElementById('resultArea').innerHTML =\n      `<div class=\"placeholder\"><span>\u26a0\ufe0f</span>${e.message}</div>`;\n  } finally {\n    btn.disabled = false;\n  }\n}\n</script>\n</body>\n</html>\n";

  // Serve billing demo at same origin so fetch('/api/v1/evaluation') is same-origin
  await page.route('**/billing-demo', route =>
    route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: billingHtml })
  );

  // ─── ACT 1: UI OVERVIEW ───────────────────────────────
  await page.goto('http://localhost:8000');
  await sleep(2500);

  await page.locator('[data-testid="jds-table-row-0"]').click();
  await page.waitForURL('**/agents/**');
  await sleep(1200);

  // Monitor tab
  await page.getByRole('tab', { name: 'Monitor' }).click();
  await sleep(3500);

  // Controls tab — 2 existing controls
  await page.getByRole('tab', { name: 'Controls' }).click();
  await sleep(3000);

  // ─── ACT 2: CREATE THE CREDIT GUARDRAIL ───────────────
  await page.getByTestId('add-control-button').click();
  await sleep(1200);

  await page.getByRole('button', { name: 'Create Control' }).click();
  await sleep(1000);

  await page.getByRole('row', { name: /regex/i }).getByTestId('add-control-button').click();
  await sleep(1200);

  // Control name
  await typeSlowly(page.locator('input[placeholder="Enter control name"]'), 'block-high-credit');
  await sleep(400);

  // Description
  await page.locator('input[placeholder*="Optional description"]').fill(
    'Block credit assignments over 50 — escalate to human agent'
  );
  await sleep(500);

  // Selector path: * → output
  const selectorInput = page.locator('input[placeholder*="input or input.args"]');
  await selectorInput.clear();
  await typeSlowly(selectorInput, 'output', 80);
  await sleep(400);

  // Regex pattern
  const patternInput = page.locator('input[placeholder*="regex pattern"], textarea[placeholder*="regex pattern"]').first();
  await patternInput.clear();
  await typeSlowly(patternInput, 'assigning\\s+([5-9][0-9]|[1-9][0-9]{2,})\\s+credits', 40);
  await sleep(2500);

  // Save → Confirm
  await page.getByRole('button', { name: 'Save' }).click();
  await sleep(700);
  await page.getByRole('button', { name: 'Confirm' }).click();
  await sleep(2800);

  // ─── ACT 3: BILLING AGENT LIVE DEMO ───────────────────
  await page.goto('http://localhost:8000/billing-demo');
  await sleep(2000);

  // Test 1: 20 credits — ALLOWED
  await page.locator('#amount').fill('20');
  await sleep(600);
  await page.locator('#sendBtn').click();
  await sleep(1200);
  await sleep(3500);

  // Test 2: 100 credits — BLOCKED
  await page.locator('#amount').fill('100');
  await sleep(600);
  await page.locator('#sendBtn').click();
  await sleep(1200);
  await sleep(4500);

  // ─── ACT 4: MONITOR ───────────────────────────────────
  await page.goto('http://localhost:8000/agents/?id=awesome_bot_3000&tab=monitor');
  await sleep(3500);

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  await sleep(3000);
}
