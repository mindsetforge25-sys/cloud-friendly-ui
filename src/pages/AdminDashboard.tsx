import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { StatsCards } from '@/components/StatsCards';
import { CreateDeliveryForm } from '@/components/CreateDeliveryForm';
import { ShipmentTable } from '@/components/ShipmentTable';
import { useAllShipments } from '@/hooks/useShipments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, List, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: shipments = [], isLoading } = useAllShipments();

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">

      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage shipments and create new deliveries
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>

        <StatsCards shipments={shipments} />

        <Tabs defaultValue="manage" className="mt-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="manage" className="gap-2">
              <List className="w-4 h-4" />
              Manage
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <Plus className="w-4 h-4" />
              Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="mt-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Package className="w-8 h-8 animate-pulse text-primary" />
              </div>
            ) : (
              <ShipmentTable shipments={shipments} statusFilter="all" />
            )}
          </TabsContent>

          <TabsContent value="create" className="mt-6">
            <CreateDeliveryForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
