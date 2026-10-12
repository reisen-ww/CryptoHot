// A daily's front-page picture comes from the item its lead is about: the editors' lead matched to an
// item by title, never simply the first highlight.
import "./setup.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import type { ReportCitation } from "@aihot/contracts/site";
import { leadItemOf } from "@aihot/backend/publication/reports";

const cite = (itemId: string, title: string, available = true) => ({ itemId, title, available }) as ReportCitation;
const arena = cite("a", "以太坊现货 ETF 单日净流入创下 15 亿美元新高");
const binance = cite("b", "Binance 暂停部分衍生品交易，披露做市商利用 API 漏洞操纵价格等安全事件");

test("an editors' lead is matched to the item it is written about", () => {
  assert.equal(leadItemOf("Binance 暂停部分衍生品交易，披露做市商安全事件", [arena, binance], [arena, binance])?.itemId, "b");
});

test("a lead that matches no item clearly has no item", () => {
  assert.equal(leadItemOf("多家交易所上线新产品，行业竞争加剧", [arena], [arena, binance]), undefined);
});

test("without an editors' lead the first highlight leads", () => {
  assert.equal(leadItemOf(undefined, [arena], [binance, arena])?.itemId, "a");
});

test("a withdrawn highlight never leads the front page", () => {
  const withdrawn = cite("w", "已下架", false);
  assert.equal(leadItemOf(undefined, [withdrawn, arena], [withdrawn, arena, binance])?.itemId, "a");
});
