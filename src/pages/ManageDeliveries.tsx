import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Download, Filter, Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { ShipmentTable } from '@/components/ShipmentTable';
import { StatsCards } from '@/components/StatsCards';
import { useAllShipments } from '@/hooks/useShipments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShipmentStatus } from '@/types/shipment';
import { Skeleton } from '@/components/ui/skeleton';

const ManageDeliveries = () => {
  const { data: shipments, isLoading } = useAllShipments();
  const [statusFilter, setStatusFilter] = useState<ShipmentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalCount = shipments?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 sm:py-8 lg:py-10 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Manage Deliveries
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time control over active shipments and logistics nodes.
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
            <Link to="/create">
              <Button variant="hero" size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                New Shipment
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="mb-6 sm:mb-8">
            <StatsCards shipments={shipments || []} />
          </div>
        )}

        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by tracking ID, recipient, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ShipmentStatus | 'all')}
            className="w-full sm:w-auto"
          >
            <TabsList className="w-full sm:w-auto grid grid-cols-5 sm:flex">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All <span className="hidden sm:inline ml-1">({totalCount})</span>
              </TabsTrigger>
              <TabsTrigger value="in_transit" className="text-xs sm:text-sm">
                In Transit
              </TabsTrigger>
              <TabsTrigger value="ordered" className="text-xs sm:text-sm">
                Pending
              </TabsTrigger>
              <TabsTrigger value="delivered" className="text-xs sm:text-sm">
                Delivered
              </TabsTrigger>
              <TabsTrigger value="out_for_delivery" className="text-xs sm:text-sm">
                Out
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button variant="outline" size="sm" className="gap-2 sm:hidden">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <ShipmentTable 
                shipments={shipments || []} 
                statusFilter={statusFilter} 
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 py-6 border-t border-border text-center text-sm text-muted-foreground">
          LogiTrack Fleet Management Console v2.1 • © 2024 LogiTrack International
        </footer>
      </main>
    </div>
  );
};

export default ManageDeliveries;

