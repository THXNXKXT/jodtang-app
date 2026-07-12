// ponytail: client-side CSV — no server round trip, no dep
export function transactionsToCsv(txs: ReturnType<typeof Array.prototype.slice>): string {
  const rows = [["date", "type", "amount", "category", "wallet", "toWallet", "note"]];
  for (const t of txs) {
    rows.push([
      new Date(t.date).toISOString(),
      t.type,
      String(t.amount),
      (t.categoryName ?? "").replace(/,/g, ";"),
      (t.walletName ?? "").replace(/,/g, ";"),
      (t.toWalletName ?? "").replace(/,/g, ";"),
      (t.note ?? "").replace(/[\n,r]/g, " ").replace(/,/g, ";"),
    ]);
  }
  return rows.map((r) => r.join(",")).join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
