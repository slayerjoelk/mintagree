import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Live demo", href: "/demo" },
    { label: "Login", href: "/login" },
  ],
  Solutions: [
    { label: "Agencies", href: "#solutions" },
    { label: "Consultants", href: "#solutions" },
    { label: "Freelancers", href: "#solutions" },
    { label: "Enterprise", href: "#solutions" },
  ],
  Company: [
    { label: "Blog", href: "#blog" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "mailto:support@mintagree.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-surface">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-semibold text-mint tracking-tight">
              MintAgree
            </Link>
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
              Voice agreement & client sign-off software.
              <br />
              Built in South Africa 🇿🇦
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                {heading}
              </h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} MintAgree. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-zinc-600">
            <span>mintagree.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
