import { TrackingSearch } from '@/components/TrackingSearch';
import { Package } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      
      <main className="container py-12 sm:py-20 lg:py-28">
        <div className="flex flex-col items-center text-center">
          {/* Hero Section */}
          <div className="mb-8 sm:mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 mb-6">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              Track Your Package
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
              Enter your tracking number to get real-time updates on your package's journey.
            </p>
          </div>

          {/* Search Box */}
          <div className="w-full max-w-xl px-4 sm:px-0 animate-slide-in">
            <TrackingSearch />
          </div>

          {/* Carrier Logos */}
          <div className="mt-10 sm:mt-14 flex items-center gap-6 sm:gap-8">
            <img src="/images/carriers/fedex.png" alt="FedEx" className="h-6 sm:h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <img src="/images/carriers/dhl.png" alt="DHL" className="h-6 sm:h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <img src="/images/carriers/ups.png" alt="UPS" className="h-8 sm:h-10 object-contain opacity-80 hover:opacity-100 transition-opacity" />
            <img src="/images/carriers/usps.png" alt="USPS" className="h-6 sm:h-8 object-contain opacity-80 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
