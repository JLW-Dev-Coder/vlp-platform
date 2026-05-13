"""
Generate the 4 freebie PDFs delivered by the exit-intent welcome email.

Outputs (in current working directory):
  - ttmp-transcript-cheatsheet.pdf
  - tmp-monitoring-checklist.pdf
  - tcvlp-kwong-checklist.pdf
  - vlp-platform-recommendation.pdf

Run:
  pip install reportlab --break-system-packages
  python apps/worker/scripts/generate-freebie-pdfs.py

Then upload to R2 under the `freebies/` prefix on R2_VIRTUAL_LAUNCH.
"""

from datetime import date
from reportlab.lib import colors
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
)


def hex_color(hx):
    return colors.HexColor(hx)


def make_styles(brand_hex):
    styles = getSampleStyleSheet()
    base = styles["Normal"]
    return {
        "title": ParagraphStyle(
            "title", parent=base, fontSize=20, leading=24,
            textColor=hex_color("#1a1a2e"), spaceAfter=10, fontName="Helvetica-Bold",
        ),
        "subtitle": ParagraphStyle(
            "subtitle", parent=base, fontSize=11, leading=14,
            textColor=hex_color(brand_hex), spaceAfter=14, fontName="Helvetica-Bold",
        ),
        "body": ParagraphStyle(
            "body", parent=base, fontSize=10.5, leading=15,
            textColor=hex_color("#333333"), spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2", parent=base, fontSize=13, leading=17,
            textColor=hex_color("#1a1a2e"), spaceBefore=12, spaceAfter=6,
            fontName="Helvetica-Bold",
        ),
        "small": ParagraphStyle(
            "small", parent=base, fontSize=8.5, leading=11,
            textColor=hex_color("#6b7280"),
        ),
        "footer_brand": ParagraphStyle(
            "footer_brand", parent=base, fontSize=9, leading=12,
            textColor=hex_color(brand_hex), fontName="Helvetica-Bold",
        ),
        "checkbox": ParagraphStyle(
            "checkbox", parent=base, fontSize=10.5, leading=16, leftIndent=14,
            textColor=hex_color("#333333"),
        ),
    }


def header_footer(brand_hex, brand_label):
    def _draw(canvas, doc):
        canvas.saveState()
        # Top brand bar
        canvas.setFillColor(hex_color(brand_hex))
        canvas.rect(0, LETTER[1] - 0.25 * inch, LETTER[0], 0.25 * inch, fill=1, stroke=0)
        # Footer
        canvas.setFillColor(hex_color("#9ca3af"))
        canvas.setFont("Helvetica", 8)
        canvas.drawString(0.6 * inch, 0.5 * inch, brand_label)
        canvas.drawRightString(LETTER[0] - 0.6 * inch, 0.5 * inch, f"Page {doc.page}")
        canvas.restoreState()
    return _draw


def build_doc(filename, brand_hex, brand_label, story):
    doc = SimpleDocTemplate(
        filename, pagesize=LETTER,
        leftMargin=0.6 * inch, rightMargin=0.6 * inch,
        topMargin=0.55 * inch, bottomMargin=0.7 * inch,
        title=brand_label,
    )
    cb = header_footer(brand_hex, brand_label)
    doc.build(story, onFirstPage=cb, onLaterPages=cb)


# ---------------------------------------------------------------------------
# PDF 1: TTMP — IRS Transcript Cheat Sheet
# ---------------------------------------------------------------------------

def build_ttmp():
    brand = "#14b8a6"
    s = make_styles(brand)
    story = []
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("IRS Transcript Cheat Sheet", s["title"]))
    story.append(Paragraph("20 Codes That Matter — by Transcript Tax Monitor Pro", s["subtitle"]))
    story.append(Paragraph(
        "Every IRS transcript uses transaction codes (TC) to record actions on a "
        "taxpayer's account. Most practitioners memorize a handful. Here are the 20 "
        "you'll encounter most — and what they actually mean.", s["body"]))
    story.append(Spacer(1, 0.1 * inch))

    rows = [
        ["Code", "Name", "What It Actually Means", "Watch For"],
        ["TC 150", "Tax return filed", "Return was processed and posted to the account", "Date is processing date, not filing date"],
        ["TC 290", "Additional tax assessed", "Additional tax was charged (often audit/amended return)", "$0.00 does NOT always mean 'no change'"],
        ["TC 291", "Abatement of prior assessment", "Previously assessed tax was reduced or removed", "Confirm it matches the abatement amount"],
        ["TC 300", "Additional tax (with interest)", "Tax assessment that includes interest computation", "vs TC 290 — this includes interest"],
        ["TC 420", "Examination indicator", "Client is under audit/examination", "The 'audit flag' — do not ignore"],
        ["TC 421", "Examination closure", "Audit/examination has been closed", "Check if closed with changes (TC 290/300)"],
        ["TC 460", "Extension to file", "Extension was granted", "Verify the extended due date"],
        ["TC 570", "Additional liability / credit hold", "Account is frozen — refund held", "Pair with TC 571; call IRS if no 571 in 60 days"],
        ["TC 571", "Resolved additional liability", "Hold from TC 570 has been released", "Refund follows in 2-3 weeks"],
        ["TC 582", "Lien indicator", "Federal tax lien has been filed", "Check immediately for release (TC 583)"],
        ["TC 583", "Lien release", "Federal tax lien has been released", "Confirm with county records"],
        ["TC 670", "Payment received", "IRS received a payment", "Match amount/date to client records"],
        ["TC 700", "Credit transferred in", "Credit moved from another tax period", "Trace the source period"],
        ["TC 706", "Credit transferred out", "Credit moved to another tax period", "May indicate offset to another year"],
        ["TC 766", "Earned Income Credit", "EIC was applied to the account", "Verify amount matches return"],
        ["TC 806", "W-2 withholding credited", "Federal income tax withheld per W-2", "Compare to W-2 box 2"],
        ["TC 826", "Credit offset", "Overpayment applied to another period's balance", "Client didn't get refund — went to a debt"],
        ["TC 846", "Refund issued", "Refund was sent", "Allow 5 business days for direct deposit"],
        ["TC 922", "Review of unreported income", "IRS identified potential unreported income", "Review, not a finding — does not always assess"],
        ["TC 971", "Notice issued", "A notice was sent to the taxpayer", "Action code matters — AC 199 = silent freeze"],
    ]

    cell_style = ParagraphStyle(
        "cell", parent=s["body"], fontSize=8.5, leading=11,
        textColor=hex_color("#1a1a2e"), spaceAfter=0,
    )
    header_style = ParagraphStyle(
        "cell_h", parent=cell_style, fontName="Helvetica-Bold",
        textColor=colors.white,
    )

    table_data = [[Paragraph(c, header_style if i == 0 else cell_style) for c in row]
                  for i, row in enumerate(rows)]

    t = Table(
        table_data,
        colWidths=[0.7 * inch, 1.5 * inch, 2.7 * inch, 2.4 * inch],
        repeatRows=1,
    )
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), hex_color(brand)),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, hex_color("#f3f4f6")]),
        ("GRID", (0, 0), (-1, -1), 0.4, hex_color("#d1d5db")),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        f"Generated by Transcript Tax Monitor Pro &middot; {date.today().isoformat()}<br/>"
        "Parse your next transcript at <b>transcript.taxmonitor.pro</b>",
        s["small"]))

    build_doc("ttmp-transcript-cheatsheet.pdf", brand, "Transcript Tax Monitor Pro", story)


# ---------------------------------------------------------------------------
# PDF 2: TMP — IRS Account Monitoring Checklist
# ---------------------------------------------------------------------------

def _checklist(items, style):
    paras = []
    for item in items:
        paras.append(Paragraph(f"&#9744;&nbsp;&nbsp;{item}", style))
    return paras


def build_tmp():
    brand = "#f59e0b"
    s = make_styles(brand)
    story = []
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("IRS Account Monitoring Checklist", s["title"]))
    story.append(Paragraph("Never Miss a Change — by Tax Monitor Pro", s["subtitle"]))
    story.append(Paragraph(
        "A practical cadence for keeping every active client account under control. "
        "Run weekly, monthly, quarterly, and annually — and the surprises stop happening.",
        s["body"]))

    sections = [
        ("Weekly Checks", [
            "Review any new notices (TC 971) on active client accounts",
            "Check for payment postings (TC 670) against expected payment dates",
            "Verify refund status (TC 846) for clients awaiting refunds",
            "Scan for new examination indicators (TC 420) across all clients",
            "Check for credit holds (TC 570) that may delay refunds",
        ]),
        ("Monthly Checks", [
            "Compare assessed balances to prior month for unexpected changes",
            "Review any collection actions (TC 582 liens, TC 530 CNC status)",
            "Verify installment agreement compliance (expected payments posting)",
            "Check for statute of limitations expirations approaching",
            "Review any credit offsets (TC 826) that may affect client refunds",
        ]),
        ("Quarterly Checks", [
            "Run full account status report for all active clients",
            "Identify accounts with no activity (lost mail or compliance gap)",
            "Review estimated tax payment compliance for 1040-ES clients",
            "Check for penalty abatement opportunities on new assessments",
            "Update client contact info and POA (Form 2848) expirations",
        ]),
        ("Annually", [
            "Verify all active POAs are current (not expired)",
            "Review fee schedule against monitoring workload",
            "Archive completed cases and remove from active monitoring",
            "Identify cross-sell opportunities (Kwong claims, transcript analysis)",
        ]),
    ]

    for title, items in sections:
        story.append(Paragraph(title, s["h2"]))
        story.extend(_checklist(items, s["checkbox"]))
        story.append(Spacer(1, 0.06 * inch))

    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph(
        f"Generated by Tax Monitor Pro &middot; {date.today().isoformat()}<br/>"
        "Automate your monitoring at <b>taxmonitor.pro</b>",
        s["small"]))

    build_doc("tmp-monitoring-checklist.pdf", brand, "Tax Monitor Pro", story)


# ---------------------------------------------------------------------------
# PDF 3: TCVLP — Kwong Eligibility Quick-Check
# ---------------------------------------------------------------------------

def build_tcvlp():
    brand = "#eab308"
    s = make_styles(brand)
    story = []
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("Kwong v. US Eligibility Quick-Check", s["title"]))
    story.append(Paragraph("5-Minute Triage — by TaxClaim Pro", s["subtitle"]))
    story.append(Paragraph(
        "Walk through these five steps for any client with recent IRS penalties. "
        "If steps 1-3 all return 'Yes,' the client likely qualifies for Kwong-based "
        "abatement. The full claim deadline is July 2026.",
        s["body"]))

    def step(title, body_lines):
        story.append(Paragraph(title, s["h2"]))
        for line in body_lines:
            if line.startswith("[ ]"):
                story.append(Paragraph(f"&#9744;&nbsp;&nbsp;{line[3:].strip()}", s["checkbox"]))
            else:
                story.append(Paragraph(line, s["body"]))
        story.append(Spacer(1, 0.04 * inch))

    step("Step 1 — Penalty Window", [
        "Does the client have IRS penalties assessed between January 2020 and July 2023?",
        "[ ] Yes — continue to Step 2",
        "[ ] No — client does not qualify under Kwong",
    ])
    step("Step 2 — Penalty Type", [
        "Is the penalty one of these types?",
        "[ ] Failure to file (IRC §6651(a)(1))",
        "[ ] Failure to pay (IRC §6651(a)(2))",
        "[ ] Estimated tax penalty (IRC §6654)",
        "[ ] Accuracy-related penalty (IRC §6662)",
        "[ ] Yes to any — continue to Step 3",
        "[ ] None of the above — review penalty code; may still qualify under broader abatement",
    ])
    step("Step 3 — Filing Deadline", [
        "Is today before July 2026?",
        "[ ] Yes — client is within the filing window",
        "[ ] No — deadline has passed",
    ])
    step("Step 4 — Prior Abatement", [
        "Has the client previously received first-time abatement (FTA) for the same period?",
        "[ ] No — stronger case for Kwong-based abatement",
        "[ ] Yes — may still qualify; Kwong is a separate legal basis from FTA",
    ])
    step("Step 5 — Documentation", [
        "Do you have:",
        "[ ] IRS transcript showing the penalty assessment",
        "[ ] Client's tax return for the relevant period",
        "[ ] Penalty notice (CP14, CP501, or equivalent)",
    ])

    story.append(Paragraph("Result", s["h2"]))
    story.append(Paragraph(
        "If Steps 1–3 are all 'Yes' → client likely qualifies. "
        "Generate Form 843 at <b>taxclaim.virtuallaunch.pro/gala</b>.",
        s["body"]))

    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph(
        f"Generated by TaxClaim Pro &middot; {date.today().isoformat()} &middot; "
        "Filing deadline: <b>July 2026</b><br/>"
        "Automate Form 843 generation at <b>taxclaim.virtuallaunch.pro</b>",
        s["small"]))

    build_doc("tcvlp-kwong-checklist.pdf", brand, "TaxClaim Pro", story)


# ---------------------------------------------------------------------------
# PDF 4: VLP — Platform Recommendation Guide
# ---------------------------------------------------------------------------

def build_vlp():
    brand = "#f97316"
    s = make_styles(brand)
    story = []
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("Which VLP Platform Is Right for Your Practice?", s["title"]))
    story.append(Paragraph("Decision Guide — by Virtual Launch Pro", s["subtitle"]))
    story.append(Paragraph(
        "Ten platforms in the Virtual Launch Pro ecosystem cover transcript "
        "analysis, monitoring, penalty claims, client education, AI video, and "
        "more. Use the matrix below to pick the right starting point.",
        s["body"]))

    rows = [
        ["If you need...", "Use this platform", "Why"],
        ["IRS transcript analysis", "TTMP — transcript.taxmonitor.pro", "Upload a PDF, get plain-English analysis in seconds"],
        ["IRS account monitoring", "TMP — taxmonitor.pro", "Automated alerts on notices, payments, status changes"],
        ["Kwong penalty claims", "TCVLP — taxclaim.virtuallaunch.pro", "Auto-generate Form 843 before the July 2026 deadline"],
        ["Client education games", "TTTMP — taxtools.taxmonitor.pro", "21 interactive games covering tax concepts and IRS forms"],
        ["AI YouTube avatar", "TAVLP — taxavatar.virtuallaunch.pro", "AI spokesperson for your channel — you don't record"],
        ["Professional website", "WLVLP — websitelotto.virtuallaunch.pro", "Buy, bid, or win a ready-to-publish site"],
        ["Developer marketplace", "DVLP — developers.virtuallaunch.pro", "Find developers or get client introductions"],
        ["Client games on your site", "GVLP — games.virtuallaunch.pro", "Embed engagement games for your clients"],
        ["Full tax prep workflow", "TPP — taxprep.virtuallaunch.pro", "8-phase client journey in a branded portal"],
    ]

    cell_style = ParagraphStyle(
        "cell", parent=s["body"], fontSize=9.5, leading=12,
        textColor=hex_color("#1a1a2e"), spaceAfter=0,
    )
    header_style = ParagraphStyle(
        "cell_h", parent=cell_style, fontName="Helvetica-Bold", textColor=colors.white,
    )
    table_data = [[Paragraph(c, header_style if i == 0 else cell_style) for c in row]
                  for i, row in enumerate(rows)]
    t = Table(table_data, colWidths=[1.7 * inch, 2.5 * inch, 3.1 * inch], repeatRows=1)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), hex_color(brand)),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, hex_color("#fff7ed")]),
        ("GRID", (0, 0), (-1, -1), 0.4, hex_color("#d1d5db")),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(t)

    story.append(PageBreak())
    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph("By Credential", s["h2"]))

    cred = [
        ("CPAs",
         "Start with TTMP (transcript parser) and TCVLP (Kwong claims). These two "
         "save the most time for compliance-heavy practices."),
        ("Enrolled Agents",
         "TCVLP (Kwong claims) and TMP (monitoring). EAs handle the most penalty "
         "cases — these tools were built for your workflow."),
        ("Tax Attorneys",
         "TCVLP (Kwong claims, July 2026 deadline) is urgent. TTMP (transcript "
         "parser) supports case prep."),
        ("All credentials",
         "TAVLP (AI YouTube) is the long play — build a content engine without "
         "camera time."),
    ]
    for title, body in cred:
        story.append(Paragraph(f"<b>{title}.</b> {body}", s["body"]))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        f"Generated by Virtual Launch Pro &middot; {date.today().isoformat()}<br/>"
        "Explore all platforms at <b>virtuallaunch.pro</b>",
        s["small"]))

    build_doc("vlp-platform-recommendation.pdf", brand, "Virtual Launch Pro", story)


if __name__ == "__main__":
    build_ttmp()
    build_tmp()
    build_tcvlp()
    build_vlp()
    print("Generated:")
    for f in [
        "ttmp-transcript-cheatsheet.pdf",
        "tmp-monitoring-checklist.pdf",
        "tcvlp-kwong-checklist.pdf",
        "vlp-platform-recommendation.pdf",
    ]:
        print(f"  - {f}")
