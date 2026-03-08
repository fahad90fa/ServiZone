import { Link } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const Footer = () => (
  <footer className="border-t border-border bg-card">
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Wrench className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">ServiZone</span>
          </div>
          <p className="text-sm text-muted-foreground">Your trusted platform for on-demand home services. Professional, reliable, affordable.</p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Services</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/services" className="block hover:text-foreground">Home Cleaning</Link>
            <Link to="/services" className="block hover:text-foreground">Plumbing</Link>
            <Link to="/services" className="block hover:text-foreground">Electrical</Link>
            <Link to="/services" className="block hover:text-foreground">Painting</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Company</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/about" className="block hover:text-foreground">About Us</Link>
            <Link to="/help" className="block hover:text-foreground">Help & Support</Link>
            <Link to="/signup" className="block hover:text-foreground">Become a Provider</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/help" className="block hover:text-foreground">Help Center</Link>
            <Link to="/help" className="block hover:text-foreground">Contact Us</Link>
            <p className="cursor-pointer hover:text-foreground">Terms of Service</p>
            <p className="cursor-pointer hover:text-foreground">Privacy Policy</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ServiZone. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
