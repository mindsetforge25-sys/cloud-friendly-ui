import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { ShipmentDetails } from '@/components/ShipmentDetails';
import { useShipment } from '@/hooks/useShipments';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const TrackShipment = () => {
  const { trackingNumber } = useParams<{ trackingNumber: string }>();
  const { data: shipment, isLoading, error } = useShipment(trackingNumber || null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 sm:py-12 lg:py-16 px-4">
        {/* Brand */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary">
            LogiTrack
          </h1>
        </div>

        {isLoading && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-card rounded-xl border border-border/50 p-6 sm:p-8 shadow-card">
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-6 w-32 mb-8" />
              <Skeleton className="h-20 w-full mb-6" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        )}

        {!isLoading && !shipment && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-2">
              Shipment Not Found
            </h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find a shipment with tracking number{' '}
              <span className="font-mono font-medium text-foreground">{trackingNumber}</span>
            </p>
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Try Another Number
              </Button>
            </Link>
          </div>
        )}

        {shipment && (
          <>
            <ShipmentDetails shipment={shipment} />
            
            <div className="text-center mt-8">
              <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline font-medium">
                <ArrowLeft className="w-4 h-4" />
                Track another shipment
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TrackShipment;
