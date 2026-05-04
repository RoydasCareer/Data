import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import horizontalLogo from "../../imports/Horizontal_Logo.png";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Strip */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white mb-1" style={{ fontSize: "1.1rem" }}>
                Stay ahead in your sponsorship journey
              </h3>
              <p className="text-gray-400 text-sm">
                Get the latest job postings, guides, and visa updates delivered to your inbox.
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto md:min-w-[360px]">
              <Input
                placeholder="Enter your email address"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 flex-1"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <img
              src={horizontalLogo}
              alt="HiSponsor"
              className="h-9 w-auto object-contain brightness-200 opacity-90"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              HiSponsor is your trusted platform for finding employer-sponsored opportunities worldwide.
              We connect ambitious talent with companies ready to invest in their future.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <span>Seoul, South Korea · Remote Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <span>hello@hisponsor.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                <span>+82 02-000-0000</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-2 pt-1">
              {[
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-sm">Explore</h4>
            <nav className="flex flex-col space-y-2.5">
              {["Home", "Information", "Jobs", "Template", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors hover:translate-x-0.5 inline-block duration-150"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Top Destinations */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-sm">Top Destinations</h4>
            <nav className="flex flex-col space-y-2.5">
              {[
                "🇺🇸 USA",
                "🇨🇦 Canada",
                "🇬🇧 United Kingdom",
                "🇦🇺 Australia",
                "🇩🇪 Germany",
                "🇸🇬 Singapore",
              ].map((country) => (
                <a
                  key={country}
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {country}
                </a>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-white font-medium text-sm">Company</h4>
            <nav className="flex flex-col space-y-2.5">
              {[
                "About Us",
                "Careers",
                "Blog",
                "Press Kit",
                "Partners",
                "Advertise",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 HiSponsor. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            {["Privacy Policy", "Terms of Service", "Cookie Policy", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-gray-300 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
