from pathlib import Path
from app.core.config import settings

# PUBLIC_INTERFACE
def export_results_csv(rows: list[dict], filename: str = "results.csv") -> str:
    """Export rows to a CSV file in REPORT_EXPORT_DIR. Stub writes simple CSV."""
    Path(settings.REPORT_EXPORT_DIR).mkdir(parents=True, exist_ok=True)
    path = Path(settings.REPORT_EXPORT_DIR) / filename
    if not rows:
        path.write_text("")
        return str(path)
    headers = list(rows[0].keys())
    with open(path, "w", encoding="utf-8") as f:
        f.write(",".join(headers) + "\n")
        for r in rows:
            f.write(",".join([str(r.get(h, "")) for h in headers]) + "\n")
    return str(path)
