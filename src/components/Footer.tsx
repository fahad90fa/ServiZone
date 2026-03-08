import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => (
  <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-soft">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-sans text-lg font-bold text-foreground">Servi<span className="text-gradient">Zone</span></span>
          </div>
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            Your trusted platform for on-demand home services. Professional, reliable, affordable.
          </p>
        </motion.div>

        {[
          { title: 'Services', links: [['Home Cleaning', '/services'], ['Plumbing', '/services'], ['Electrical', '/services'], ['Painting', '/services']] },
          { title: 'Company', links: [['About Us', '/about'], ['Help & Support', '/help'], ['Become a Provider', '/signup']] },
          { title: 'Support', links: [['Help Center', '/help'], ['Contact Us', '/help']] },
        ].map((section) => (
          <div key={section.title}>
            <h4 className="mb-3 font-sans text-sm font-semibold text-foreground">{section.title}</h4>
            <div className="space-y-2 font-body text-sm text-muted-foreground">
              {section.links.map(([label, path]) => (
                <Link key={label} to={path} className="block hover:text-primary transition-colors">{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-border/50 pt-6 text-center font-body text-sm text-muted-foreground">
        © {new Date().getFullYear()} ServiZone. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
