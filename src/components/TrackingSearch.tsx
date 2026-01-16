import { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export function TrackingSearch() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track/${trackingNumber.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="h-12 sm:h-14 text-base"
          />
        </div>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          className="h-12 sm:h-14 px-6 sm:px-8"
          disabled={!trackingNumber.trim()}
        >
          Track
          <ArrowRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </form>
  );
}
