import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => (
  <footer className="relative border-t border-border/30 bg-card/30 backdrop-blur-sm">
    <div className="absolute top-0 left-0 right-0 line-glow" />
    <div className="container py-14">
      <div className="grid gap-8 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
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
            <div className="space-y-2.5 font-body text-sm text-muted-foreground">
              {section.links.map(([label, path]) => (
                <Link key={label} to={path} className="block hover:text-primary transition-colors duration-300">{label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-border/30 pt-6 text-center font-body text-sm text-muted-foreground/60">
        © {new Date().getFullYear()} ServiZone. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
