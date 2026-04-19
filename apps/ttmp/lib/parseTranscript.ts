// Client-side IRS transcript parser. Extracted from
// components/member/TranscriptParser.tsx so marketing (anonymous) and
// authenticated tool views share one parsing implementation.

export const PDFJS_VERSION = '3.11.174'

const CODES: Record<string, string> = {
  '000': 'Establishment of tax module',
  '011': 'Entity created',
  '012': 'Entity updated',
  '013': 'Entity updated \u2014 name change',
  '014': 'Address change',
  '016': 'Employer identification number (EIN) change',
  '020': 'Name change',
  '036': 'Reactivate tax module',
  '050': 'Module blocked from automated collection',
  '054': 'Amended return filed \u2014 TC 54',
  '076': 'Duplicate return filed',
  '080': 'Entity updated \u2014 bankruptcy',
  '090': 'Penalty suspension \u2014 disaster relief',
  '150': 'Tax return filed \u2014 tax liability established',
  '151': 'Tax return filed \u2014 tax liability reduced',
  '152': 'Tax return filed \u2014 no tax liability',
  '160': 'Failure-to-file (FTF) penalty assessed',
  '161': 'Failure-to-file penalty abated',
  '166': 'Failure-to-pay (FTP) penalty assessed',
  '167': 'Failure-to-pay penalty abated',
  '170': 'Estimated tax penalty assessed',
  '171': 'Estimated tax penalty abated',
  '190': 'Accuracy-related penalty assessed',
  '196': 'Interest charged for late payment',
  '197': 'Interest abated',
  '240': 'Miscellaneous penalty assessed',
  '270': 'Failure-to-pay penalty assessed',
  '290': 'Additional tax assessed',
  '291': 'Tax decreased',
  '300': 'Additional tax assessed \u2014 examination',
  '301': 'Tax decreased \u2014 examination',
  '310': 'Additional tax assessed \u2014 automated underreporter',
  '370': 'Credit transferred from another module',
  '400': 'Earned income credit applied',
  '420': 'Examination of tax return initiated',
  '421': 'Examination closed \u2014 no change',
  '424': 'Examination request indicator',
  '430': 'Estimated tax payment',
  '460': 'Extension of time to file granted',
  '470': 'Collection action suspended',
  '480': 'Offer in compromise (OIC) pending',
  '482': 'Offer in compromise accepted',
  '500': 'Installment agreement granted',
  '520': 'Collection suspended \u2014 pending litigation',
  '530': 'Currently not collectible (CNC) \u2014 hardship',
  '570': 'Additional liability pending \u2014 refund hold',
  '571': 'Additional liability resolved \u2014 hold released',
  '580': 'Notice of levy filed',
  '582': 'Federal tax lien (FTL) filed',
  '583': 'Federal tax lien released',
  '590': 'Statute of limitations extended',
  '610': 'Payment submitted with return',
  '620': 'Regular payment received',
  '650': 'Payment received',
  '670': 'Payment applied to balance due',
  '694': "Refund applied to next year's estimated tax",
  '700': 'Credit transferred to this module',
  '706': 'Credit transferred from another year',
  '720': 'Refundable credit applied',
  '766': 'Credit to your account (refundable credit)',
  '768': 'Earned income credit applied',
  '770': 'Interest credited to account',
  '776': 'Interest credited to account',
  '800': 'Withholding credit applied',
  '806': 'Federal income tax withholding credit applied',
  '810': 'Refund freeze \u2014 refund held',
  '811': 'Refund freeze released',
  '820': 'Credit transferred to another account',
  '826': 'Credit transferred to another account/year',
  '836': 'Overpayment transferred to another year',
  '840': 'Manual refund issued',
  '846': 'Refund issued',
  '850': 'Overpayment applied to non-tax debt (TOP)',
  '898': 'Refund applied to non-tax debt (TOP offset)',
  '960': 'Power of attorney (POA) on file',
  '971': 'Notice issued to taxpayer',
  '977': 'Amended return filed \u2014 TC 977',
}

export function getCodeDescription(code: string): string {
  return CODES[code] || `IRS Transaction Code ${code}`
}

/** Dynamically load pdf.js from CDN. Returns the pdfjsLib global. */
export function loadPdfJs(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any
    if (w.pdfjsLib) {
      resolve(w.pdfjsLib)
      return
    }
    const script = document.createElement('script')
    script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`
    script.onload = () => {
      const lib = (window as any).pdfjsLib
      if (!lib) {
        reject(new Error('pdfjsLib not available after load'))
        return
      }
      lib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`
      resolve(lib)
    }
    script.onerror = () => reject(new Error('Failed to load pdf.js'))
    document.head.appendChild(script)
  })
}

/** Extract raw text from a PDF File using pdf.js in the browser. */
export async function extractRawTextFromPdf(file: File): Promise<string> {
  const pdfjs = await loadPdfJs()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    fullText += content.items.map((item: any) => item.str).join(' ') + '\n'
  }
  return fullText.trim()
}

export type TranscriptKind = 'return' | 'record-of-account' | 'wage-income' | 'account'

export type ParsedTransaction = {
  code: string
  date: string
  amount: string
  description: string
  impact: string
}

export type ParsedTranscript = {
  transcriptType: TranscriptKind
  taxpayer: Record<string, string>
  transactions: ParsedTransaction[]
  balances: Record<string, string>
  returnSummary?: Record<string, string>
  accountBalance?: Record<string, string>
  income?: Record<string, string>
  adjustments?: Record<string, string>
  taxAndCredits?: Record<string, string>
  payments?: Record<string, string>
  refundOrOwed?: Record<string, string>
  scheduleC?: Record<string, string>
  selfEmploymentTax?: Record<string, string>
  qualifiedBusinessIncome?: Record<string, string>
  w2Forms?: any[]
  b1099Forms?: any[]
  summary?: Record<string, string | number>
  metadata: { transcriptType: string; requestDate: string; parsedAt: string }
}

/**
 * Parse a raw transcript text blob into a structured report.
 * Handles: Account Transcript, Record of Account, Return Transcript, Wage & Income.
 * Logic mirrored from the authenticated TranscriptParser tool.
 */
export function parseTranscriptText(text: string): ParsedTranscript {
  const isReturnTranscript  = /Form 1040 Tax Return Transcript/i.test(text)
  const isRecordOfAccount   = /Form 1040 Record of Account/i.test(text)
  const isWageAndIncome     = /Wage and Income Transcript/i.test(text)

  const norm = text.replace(/\s{2,}/g, ' ')

  const amt = (label: string): string => {
    const pattern = label.split(' ').map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+')
    const re = new RegExp(pattern + '\\s*:\\s*\\$?([\\d,]+\\.\\d{2})', 'i')
    const m  = norm.match(re)
    return m ? '$' + m[1] : '$0.00'
  }
  const amtDirect = (label: string): string => {
    const words = label.split(/\s+/)
    const pattern = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[\\s\\S]{0,30}?')
    const re = new RegExp(pattern + '[\\s\\S]{0,10}?\\$?([\\d,]+\\.\\d{2})', 'i')
    const m  = norm.match(re)
    return m ? '$' + m[1] : '$0.00'
  }

  const ssnMatch        = norm.match(/SSN[^:]*:\s*(XXX-XX-\d{4}|\d{3}-\d{2}-\d{4})/i)
  const taxPeriodMatch  = norm.match(/Tax Period(?:\s+Ending|\s+Requested)?:\s*\d{2}-\d{2}-(\d{4})/i)
    || norm.match(/Report for Tax Period Ending:\s*\d{2}-\d{2}-(\d{4})/i)
  const taxYear         = taxPeriodMatch?.[1] || ''
  const requestDateMatch = norm.match(/Request Date:\s*(\d{2}-\d{2}-\d{4})/i)
  const requestDate     = requestDateMatch?.[1] || ''
  const cycleMatch      = norm.match(/Cycle posted:\s*(\d+)/i)
  const receivedMatch   = norm.match(/Received date:\s*(\d{2}-\d{2}-\d{4})/i)
  const filingStatusMatch = norm.match(/Filing status:\s*(\w+)/i)
  const formMatch       = norm.match(/(?:Taxpayer )?Form number:\s*([\w-]+)/i)
  const trackingMatch   = norm.match(/Tracking Number:\s*(\d+)/i)
  const ssnProvided     = norm.match(/SSN provided:\s*(XXX-XX-\d{4})/i)
    || norm.match(/Taxpayer Identification Number:\s*(XXX-XX-\d{4})/i)
  const nameMatch       = norm.match(/XXX-XX-\d{4}\s+([A-Z][A-Z\s,]{2,40}?)(?:\s+\d{3,}|\s*$)/)?.[1]?.trim()

  if (isReturnTranscript) {
    return {
      transcriptType: 'return',
      taxpayer: {
        ssn: ssnProvided?.[1] || ssnMatch?.[1] || '\u2014',
        name: nameMatch || '\u2014', taxYear, requestDate,
        filingStatus: filingStatusMatch?.[1] || '\u2014',
        formNumber: formMatch?.[1] || '1040',
        cyclePosted: cycleMatch?.[1] || '\u2014',
        receivedDate: receivedMatch?.[1] || '\u2014',
        trackingNumber: trackingMatch?.[1] || '\u2014',
      },
      income: {
        totalWages: amt('Total wages'),
        totalIncome: amt('Total income'),
        adjustedGrossIncome: amt('Adjusted gross income'),
      },
      taxAndCredits: {
        taxableIncome: amt('Taxable income'),
        totalTaxLiability: amtDirect('Total tax liability taxpayer figures'),
        totalCredits: amt('Total credits'),
      },
      payments: {
        federalWithheld: amtDirect('Federal income tax withheld'),
        totalPayments: amt('Total payments'),
      },
      refundOrOwed: {
        amountOwed: amt('Amount you owe'),
      },
      transactions: [],
      balances: {
        assessedTax: amt('Total assessment per computer'),
        payments: amt('Total payments'),
        credits: amt('Total credits'),
        balance: amt('Amount you owe'),
      },
      metadata: { transcriptType: 'Form 1040 Tax Return Transcript', requestDate, parsedAt: new Date().toISOString() },
    }
  }

  if (isWageAndIncome) {
    return {
      transcriptType: 'wage-income',
      taxpayer: {
        ssn: ssnProvided?.[1] || ssnMatch?.[1] || '\u2014',
        taxYear, requestDate,
        trackingNumber: trackingMatch?.[1] || '\u2014',
      },
      transactions: [],
      balances: { assessedTax: '', payments: '', credits: '', balance: '' },
      metadata: { transcriptType: 'Wage and Income Transcript', requestDate, parsedAt: new Date().toISOString() },
    }
  }

  // Record of Account or Account Transcript
  const transactions: ParsedTransaction[] = []
  const txRegex = /\b(\d{3})\s+((?:[A-Za-z][^$\n]*?)?)\s+(\d{2}-\d{2}-\d{4})\s+([-]?\$?[\d,]+\.\d{2})/g
  let txMatch
  const txStart = text.indexOf('TRANSACTIONS')
  const txEnd   = text.indexOf('This   Product   Contains Sensitive Taxpayer Data', txStart > 0 ? txStart : 0)
  const txSection = txStart > 0 ? text.slice(txStart, txEnd > txStart ? txEnd : undefined) : text
  while ((txMatch = txRegex.exec(txSection)) !== null) {
    const code = txMatch[1]
    const rawDesc = txMatch[2].trim()
    const date = txMatch[3]
    const rawAmount = txMatch[4]
    const amount = rawAmount.startsWith('$') || rawAmount.startsWith('-$') ? rawAmount : '$' + rawAmount
    if (code === 'COD' || rawDesc.includes('EXPLANATION')) continue
    const desc = rawDesc.replace(/\b\d{8}\b/g, '').replace(/\b\d{5}-\d{3}-\d{5}-\d\b/g, '')
      .replace(/\b(NOTICE\d+|CP\s+\d+)\b/gi, '').replace(/\b00-00-0000\b/g, '')
      .replace(/\b00\b/g, '').replace(/\s{2,}/g, ' ').trim()
    if (!desc && !getCodeDescription(code)) continue
    transactions.push({ code, date, amount, description: desc || getCodeDescription(code), impact: desc || getCodeDescription(code) })
  }

  const acctBalanceMatch = norm.match(/Account\s+balance:\s*\$([\d,\.]+)/i)
  const balanceMatch     = norm.match(/Account\s+balance[:\s]+\$?([\d,\.]+)/i)
  const accruedIntMatch  = norm.match(/Accrued\s+interest:\s*\$([\d,\.]+)/i)
  const accruedPenMatch  = norm.match(/Accrued\s+penalty:\s*\$([\d,\.]+)/i)
  const payoffMatch      = norm.match(/Account\s+balance\s+plus\s+accruals[^:]*:\s*\$([\d,\.]+)/i)

  if (isRecordOfAccount) {
    return {
      transcriptType: 'record-of-account',
      taxpayer: {
        ssn: ssnProvided?.[1] || ssnMatch?.[1] || '\u2014', name: nameMatch || '\u2014',
        taxYear, requestDate, filingStatus: filingStatusMatch?.[1] || '\u2014',
        formNumber: formMatch?.[1] || '\u2014',
        trackingNumber: trackingMatch?.[1] || '\u2014',
      },
      accountBalance: {
        balance: acctBalanceMatch ? `$${acctBalanceMatch[1]}` : '$0.00',
        accruedInt: accruedIntMatch ? `$${accruedIntMatch[1]}` : '$0.00',
        accruedPenalty: accruedPenMatch ? `$${accruedPenMatch[1]}` : '$0.00',
        payoffAmount: payoffMatch ? `$${payoffMatch[1]}` : '$0.00',
      },
      transactions,
      balances: {
        balance: acctBalanceMatch ? `$${acctBalanceMatch[1]}` : '$0.00',
      },
      metadata: { transcriptType: 'Form 1040 Record of Account', requestDate, parsedAt: new Date().toISOString() },
    }
  }

  // Account Transcript
  const filingStatusMatch2 = norm.match(/Filing\s+status[:\s]+(\w+)/i)
  const agiMatch           = norm.match(/Adjusted\s+gross\s+income[:\s]+\$?([\d,\.]+)/i)
  const taxableIncMatch    = norm.match(/Taxable\s+income[:\s]+\$?([\d,\.]+)/i)
  const taxPerReturnMatch  = norm.match(/Tax\s+per\s+return[:\s]+\$?([\d,\.]+)/i)
  const procDateMatch      = norm.match(/Processing\s+date[:\s]+(\d{2}-\d{2}-\d{4})/i)
    || norm.match(/Processing\s+date[:\s]+([A-Za-z]{3,9}\.?\s+\d{1,2},\s*\d{4})/i)
  const returnDueMatch     = norm.match(/Return\s+due\s+date[^:]*:\s*(\d{2}-\d{2}-\d{4})/i)

  return {
    transcriptType: 'account',
    taxpayer: {
      ssn: ssnProvided?.[1] || ssnMatch?.[1] || '\u2014', name: nameMatch || '\u2014',
      taxYear, requestDate,
      filingStatus: filingStatusMatch?.[1] || '\u2014',
      formNumber: formMatch?.[1] || '\u2014',
      trackingNumber: trackingMatch?.[1] || '\u2014',
    },
    transactions,
    balances: {
      balance: acctBalanceMatch ? `$${acctBalanceMatch[1]}` : (balanceMatch?.[1] ? `$${balanceMatch[1]}` : '$0.00'),
      accruedInt: accruedIntMatch ? `$${accruedIntMatch[1]}` : '$0.00',
      accruedPenalty: accruedPenMatch ? `$${accruedPenMatch[1]}` : '$0.00',
      payoffAmount: payoffMatch ? `$${payoffMatch[1]}` : '$0.00',
    },
    returnSummary: {
      filingStatus: filingStatusMatch2?.[1] || '\u2014',
      adjustedGrossIncome: agiMatch ? `$${agiMatch[1]}` : '\u2014',
      taxableIncome: taxableIncMatch ? `$${taxableIncMatch[1]}` : '\u2014',
      taxPerReturn: taxPerReturnMatch ? `$${taxPerReturnMatch[1]}` : '\u2014',
      processingDate: procDateMatch?.[1] || '\u2014',
      returnDueDate: returnDueMatch?.[1] || '\u2014',
    },
    metadata: { transcriptType: 'Account Transcript', requestDate, parsedAt: new Date().toISOString() },
  }
}
