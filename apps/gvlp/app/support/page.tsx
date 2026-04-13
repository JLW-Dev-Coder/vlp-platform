import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import styles from './page.module.css';

const contactMethods = [
  {
    icon: '✈',
    label: 'Telegram',
    detail: 'Fastest response',
    href: 'https://t.me/virtuallaunchpro',
    note: 'Usually within minutes',
  },
  {
    icon: '📞',
    label: 'Google Voice',
    detail: 'Call or text us',
    href: 'tel:+16198005457',
    note: '619-800-5457',
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    detail: 'Professional inquiries',
    href: 'https://linkedin.com/company/virtuallaunchpro',
    note: 'Send a message',
  },
  {
    icon: '📘',
    label: 'Facebook',
    detail: 'Updates & community',
    href: 'https://facebook.com/virtuallaunchpro',
    note: 'Join the group',
  },
];

const faqs = [
  {
    id: 'faq-1',
    question: 'How long does it take to hear back?',
    answer: 'Within 24 hours on business days. For the fastest response, reach out via Telegram.',
  },
  {
    id: 'faq-2',
    question: 'Where do I find my client ID?',
    answer: 'Your client ID is available in your dashboard under the Embed Code section.',
  },
  {
    id: 'faq-3',
    question: 'Can I upgrade my plan?',
    answer: 'Yes! You can upgrade at any time from the Settings tab inside your dashboard.',
  },
  {
    id: 'faq-4',
    question: 'What games are included in each tier?',
    answer: 'Check the pricing page for a full breakdown of which games are available on each subscription tier.',
  },
];

const supportPaths = [
  {
    icon: '💳',
    title: 'Billing Questions',
    description: 'Charges, invoices, upgrades, and cancellations.',
    href: 'https://t.me/virtuallaunchpro',
    cta: 'Contact via Telegram',
  },
  {
    icon: '🛠',
    title: 'Technical Support',
    description: 'Embed issues, integration help, and troubleshooting.',
    href: 'mailto:support@virtuallaunch.pro',
    cta: 'Email Support',
  },
];

export default function SupportPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        {/* Background blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroIcon}>🤝</div>
          <h1 className={styles.heroHeadline}>We&apos;re Here to Help</h1>
          <p className={styles.heroSub}>
            Reach out through any channel below — we&apos;re a real team that actually responds.
          </p>
        </section>

        {/* Contact method cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Get in Touch</h2>
          <div className={styles.contactGrid}>
            {contactMethods.map((method) => (
              <a
                key={method.label}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactCard}
              >
                <span className={styles.contactIcon}>{method.icon}</span>
                <h3 className={styles.contactLabel}>{method.label}</h3>
                <p className={styles.contactDetail}>{method.detail}</p>
                <p className={styles.contactNote}>{method.note}</p>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqs.map((faq) => (
              <details key={faq.id} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{faq.question}</summary>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Support paths */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Choose Your Path</h2>
          <div className={styles.pathGrid}>
            {supportPaths.map((path) => (
              <div key={path.title} className={styles.pathCard}>
                <span className={styles.pathIcon}>{path.icon}</span>
                <h3 className={styles.pathTitle}>{path.title}</h3>
                <p className={styles.pathDesc}>{path.description}</p>
                <a href={path.href} className={styles.pathCta}>
                  {path.cta} &rarr;
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
      <CtaBanner />
      <Footer />
    </>
  );
}
